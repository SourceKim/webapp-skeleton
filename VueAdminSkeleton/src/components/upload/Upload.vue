<template>
  <el-upload
    v-bind="uploadParam"
    ref="uploadRef"
    :limit="1"
    :on-exceed="onExceed"
  >
    <template v-for="name in Object.keys($slots)" #[name]="ctx">
      <slot :name="name" v-bind="ctx"></slot>
    </template>

    <!-- 如果传入了 tip，则显示提示 -->
    <template v-if="!$slots.tip" #tip>
      <div class="tip">
        {{ tip }}
      </div>
    </template>

    <template #trigger>
      <slot name="trigger">
        <!-- 如果提供了 request prop，使用 OverwriteUpload 风格的按钮 -->
        <template v-if="request">
          <el-button v-if="fileList.length > 0" :disabled="disabled" type="primary" plain size="small">
            {{ replaceText || '更换图片' }}
          </el-button>
          <el-icon v-else><Plus /></el-icon>
        </template>
        <!-- 默认样式：如果类型是 upload-img，则显示图片上传按钮 -->
        <template v-else-if="type === 'upload-img'">
          <div class="el-upload--picture-card">
            <div class="file-lib-btn" v-if="selectFromLib" @click.stop="openFileLib('image/')">
              {{ $t('comp.upload.selectFromLib') }}
            </div>
            <Plus class="icon" />
          </div>
        </template>
        <!-- 默认样式：如果类型是 upload-file，则显示文件上传按钮 -->
        <template v-else>
          <el-button-group>
            <el-button type="primary" v-if="selectFromLib" @click.stop="openFileLib()" icon="search" />
            <el-button type="primary">{{ $t('comp.upload.selectFromFile') }}</el-button>
          </el-button-group>
        </template>
      </slot>
    </template>
    <el-image-viewer
      teleported
      v-if="previewImageVisible"
      :url-list="previewImageUrlList"
      hide-on-click-modal
      :initial-index="initialIndex"
      @close="previewImageVisible = false"
    />
    <!-- 从文件库中选择 -->
    <el-dialog
      :title="$t('comp.upload.selectFromLib')"
      v-model="visible"
      align-center
      draggable
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      width="90%"
    >
      <selectSysFile
        :param="param"
        :selection-limit="1"
        style="height: calc(90vh - 80px)"
        @select="select"
        @close="visible = false"
      />
    </el-dialog>
  </el-upload>
</template>
<script setup lang="ts">
/**
 * 增强 el-upload 上传功能，支持文件库选择、图片预览等
 * @author sxh 2023-4-14
 */
import type { ExtractPropTypes, PropType } from 'vue'
import { computed, inject, onUnmounted, ref, watchEffect } from 'vue'
import { uploadFile } from '@/api/file'
import selectSysFile from '@/components/form/selectSysFile.vue'
import { getDownloadFileUrl, getUploadFileUrl } from '@/utils/file'
import { ElUpload, genFileId, uploadProps } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export interface UploadFileItem extends UploadFile {
  // sys_file id
  id?: number
  // 云存储 object 值
  object?: string
}

/**
 * 文件库选择的文件项类型
 */
interface SysFileItem {
  id: number
  name: string
  object: string
}

/**
 * modelValue 的类型：字符串（单文件模式）或文件数组（多文件模式）
 */
type ModelValueType = string | UploadFileItem[] | undefined

/**
 * 自定义上传函数的返回类型
 */
export interface UploadResult {
  url: string
  id?: string | number
  raw?: unknown
}

defineOptions({
  name: 'MUpload',
  extends: ElUpload
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValueType): void
  (e: 'uploaded', payload: UploadResult): void
  (e: 'error', err: unknown): void
  (e: 'remove'): void
}>()

const props = defineProps({
  ...uploadProps,
  type: {
    type: String as PropType<'upload-img' | 'upload-file'>
  },
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Array] as PropType<ModelValueType>,
    required: true
  },
  // 单文件模式，返回字符串 URL（而非数组）
  single: {
    type: Boolean,
    default: false
  },
  // 是否允许从文件库中选择
  selectFromLib: {
    type: Boolean,
    default: true
  },
  tip: {
    type: String
  },
  // 自定义上传函数（如果提供，则使用自定义上传，否则使用默认的 uploadFile）
  request: {
    type: Function as PropType<(file: File) => Promise<UploadResult>>
  },
  // 替换文本（当使用 request 时显示）
  replaceText: {
    type: String,
    default: '更换图片'
  }
})

const uploadRef = ref()

const uploadParam = computed(() => {
  const param: ExtractPropTypes<typeof ElUpload> = {
    limit: props.limit || 1,
    ...props,
    fileList: fileList.value,
    onChange,
    onRemove,
    onPreview,
    multiple: false, // 单文件模式
    autoUpload: false, // 手动上传模式
    // 如果提供了自定义 request，使用自定义上传
    httpRequest: props.request ? handleHttpRequest : undefined
  }

  // 上传图片默认参数
  if (props.type === 'upload-img') {
    if (props.listType === 'text') param.listType = 'picture-card'
    param.accept = 'image/*'
  }

  return param
})

const fileList = ref<UploadFileItem[]>([])
watchEffect(() => {
  const mv = props.modelValue
  let files: UploadFileItem[] = []
  if (Array.isArray(mv)) {
    // 多文件模式：直接使用数组
    files = mv
  } else if (typeof mv === 'string' && mv) {
    // 单文件模式：字符串 URL 或 object，转换为文件项
    files = [{ uid: genFileId(), object: mv, status: 'success' } as UploadFileItem]
  }
  // 为文件项生成预览 URL
  files.forEach((file) => {
    if (!file.url) {
      let url: string | null | undefined
      if (file.object) {
        const objectValue = file.object
        // 如果是完整的 URL（http/https/data），直接使用
        if (typeof objectValue === 'string' && (objectValue.startsWith('http') || objectValue.startsWith('data:'))) {
          url = objectValue
        } else {
          // 判断是静态上传文件路径还是云存储 object
          // 静态上传文件路径特征：以 images/、uploads/ 开头，或简单文件名
          const isStaticPath = 
            (typeof objectValue === 'string' && (
              objectValue.startsWith('images/') || 
              objectValue.startsWith('/images/') ||
              objectValue.startsWith('uploads/') || 
              objectValue.startsWith('/uploads/') ||
              (!objectValue.includes('/') && objectValue.includes('.')) // 简单文件名如 avatar.jpg
            ))
          
          if (isStaticPath) {
            // 使用静态文件访问 URL
            url = getUploadFileUrl(objectValue)
          } else {
            // 使用文件下载 API（云存储 object）
            url = getDownloadFileUrl({ id: file.id, object: objectValue })
          }
        }
      } else if (file.id) {
        // 只有 id，使用下载 API
        url = getDownloadFileUrl({ id: file.id })
      }
      if (url) file.url = url
    }
  })
  fileList.value = files
})

const previewImageUrlList = ref<string[]>([])
const previewImageVisible = ref(false)
const initialIndex = ref(0)

const visible = ref(false)
const param = ref<{ type: string }>({
  type: ''
})

// 超过限制时，替换掉第一个 (From element-plus 官网)
const onExceed = (files: UploadFileItem[]) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
}

function onChange(file: UploadFileItem, files: UploadFileItem[]) {
  onUpdateFileList(files)
  // 如果使用自定义 request，选择文件后自动上传
  if (props.request && !props.disabled && file.raw) {
    uploadRef.value?.submit()
  }
  props.onChange?.(file, files)
}

function onRemove(file: UploadFileItem, files: UploadFileItem[]) {
  onUpdateFileList(files)
  emit('remove')
  props.onRemove?.(file, files)
}

function onUpdateFileList(files: UploadFileItem[]) {
  fileList.value = files
  emitModelValue()
}

function onPreview(file: UploadFileItem) {
  if (props.type === 'upload-img') {
    const urls = fileList.value
      .map((i) => i.url)
      .filter((u): u is string => typeof u === 'string' && !!u)
    previewImageUrlList.value = urls
    initialIndex.value = fileList.value.findIndex((i) => i === file)
    previewImageVisible.value = true
  } else {
    if (file.object || file.id) {
      globalThis.open(getDownloadFileUrl({ object: file.object, id: file.id, fileName: file.name }))
    }
  }
}

// 文件库选择后事件
function select(rows: SysFileItem[]) {
  onUpdateFileList([
    ...fileList.value,
    ...rows.map((file) => {
      // 兼容 Material 数据格式：object 或 file_path
      const filePath = (file as any).object || (file as any).file_path || ''
      const fileId = file.id || (file as any).id
      const fileName = file.name || (file as any).filename || (file as any).original_name || ''
      
      const item: UploadFileItem = {
        uid: genFileId(),
        url: getDownloadFileUrl({ object: filePath })!,
        status: 'success',
        id: typeof fileId === 'string' ? Number(fileId) : fileId,
        name: fileName,
        object: filePath
      }
      return item
    })
  ])
  visible.value = false
}

// 自定义上传处理函数
async function handleHttpRequest(option: { file: File; onSuccess?: (response: unknown) => void; onError?: (err: unknown) => void }) {
  if (!props.request) return
  
  try {
    const res = await props.request(option.file)
    // 更新文件列表
    const fileItem = fileList.value.find(f => f.raw === option.file) || fileList.value[0]
    if (fileItem) {
      fileItem.status = 'success'
      fileItem.url = res.url
      if (res.id) fileItem.id = typeof res.id === 'number' ? res.id : Number(res.id)
    }
    emit('update:modelValue', res.url)
    emit('uploaded', res)
    option.onSuccess?.(res)
    emitModelValue()
  } catch (err) {
    const fileItem = fileList.value.find(f => f.raw === option.file) || fileList.value[0]
    if (fileItem) {
      fileItem.status = 'fail'
    }
    emit('error', err)
    option.onError?.(err)
  }
}

// 文件手动上传（使用默认的 uploadFile API）
async function upload() {
  // 'ready' | 'uploading' | 'success' | 'fail'
  const uploadFiles = fileList.value.filter((i) => ['ready', 'fail'].includes(i.status) || !i.status)
  for (const item of uploadFiles) {
    item.status = 'uploading'
    if (!item.raw) {
      // 从库选择的文件没有 raw，跳过上传
      item.status = 'success'
      continue
    }
    const res = await uploadFile(item.raw as File)
    if (res) {
      item.status = 'success'
    }
  }
  emitModelValue()
}

//从文件库中直接选择
function openFileLib(type?: string) {
  param.value.type = type ?? ''
  visible.value = true
}

function emitModelValue() {
  // 如果提供了 request prop，默认使用单文件模式
  const isSingle = props.single || !!props.request
  if (isSingle) {
    // 单文件模式：返回第一个文件的 URL 字符串
    const first = fileList.value?.[0]
    if (first) {
      // 优先使用 url，如果没有则通过 object/id 生成 URL
      const url = first.url || getDownloadFileUrl({ id: first.id, object: first.object })
      emit('update:modelValue', url || undefined)
    } else {
      emit('update:modelValue', undefined)
    }
  } else {
    // 多文件模式：返回文件数组
    emit('update:modelValue', fileList.value)
  }
}

export interface UploadCtx {
  upload: () => Promise<void>
}

const ctx: UploadCtx = {
  upload
}
defineExpose(ctx)
const uploadInstances: UploadCtx[] = inject('uploadInstances', [])
if (uploadInstances) {
  uploadInstances.push(ctx)
  onUnmounted(() => {
    const index = uploadInstances.findIndex((i) => i === ctx)
    uploadInstances.splice(index, 1)
  })
}
</script>
<style scoped lang="scss">
.el-upload--picture-card {
  position: relative;

  .file-lib-btn {
    color: var(--el-text-color-regular);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 5px 5px 10px 10px;
    border: 1px dashed var(--el-border-color);
    text-align: center;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
  }

  .icon {
    width: 25px;
    height: 25px;
    color: var(--el-border-color-dark);
  }

  &:hover {
    .icon {
      color: var(--el-color-primary);
    }
  }
}

:deep(.is-disabled .el-upload) {
  display: none;
}

.select-limit {
  :deep(.el-upload) {
    display: none;
  }
}

.tip {
  color: var(--el-color-danger);
  font-size: var(--el-font-size-base);
}
</style>
