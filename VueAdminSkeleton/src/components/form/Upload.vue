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
        <!-- 如果类型是 upload-img，则显示图片上传按钮 -->
        <div v-if="type === 'upload-img'" class="el-upload--picture-card">
          <div class="file-lib-btn" v-if="selectFromLib" @click.stop="openFileLib('image/')">
            {{ $t('m.form.lib') }}
          </div>
          <Plus class="icon" />
        </div>
        <!-- 如果类型是 upload-file，则显示文件上传按钮 -->
        <div v-else>
          <el-button-group>
            <el-button type="primary" v-if="selectFromLib" @click.stop="openFileLib()" icon="search" />
            <el-button type="primary">{{ $t('comp.upload.selectFromFile') }}</el-button>
          </el-button-group>
        </div>
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
        :selection="selection"
        selectLimit="1"
        style="height: calc(90vh - 80px)"
        @select="select"
        @close="visible = false"
      />
    </el-dialog>
    <!-- 裁剪 -->
    <el-dialog
      :title="$t('comp.upload.imageCropper')"
      v-model="visible2"
      draggable
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      width="75%"
    >
      <cropper :="cropperOption" @close="visible2 = false" />
    </el-dialog>
  </el-upload>
</template>
<script setup lang="ts">
/**
 * 增强el-upload上传功能，增加裁剪，直接粘贴图片文件等。
 * sxh 2023-4-14
 */
import type { ExtractPropTypes, PropType } from 'vue'
import { computed, inject, onUnmounted, ref, watchEffect } from 'vue'
import { uploadFile } from '@/api/file'
import selectSysFile from '@/components/form/selectSysFile.vue'
import { getDownloadFileUrl } from '@/utils/file'
import type { DownloadParam } from '@/interface/utils.d'
import { ElUpload, genFileId, uploadProps } from 'element-plus'
import type { UploadFile } from 'element-plus'
import Cropper from './Cropper.vue'
import { Plus } from '@element-plus/icons-vue'

export interface UploadFileItem extends UploadFile {
  // sys_file id
  id?: number
  // 云存储 object 值
  object?: string
}

defineOptions({
  name: 'MUpload',
  extends: ElUpload
})

const emit = defineEmits(['update:fileList', 'update:modelValue'])

const props = defineProps({
  ...uploadProps,
  autoUpload: {
    type: Boolean
  },
  type: {
    type: String as PropType<'upload-img' | 'upload-file'>
  },
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    required: true
  },
  // 是否允许从文件库中选择
  selectFromLib: {
    type: Boolean,
    default: true
  },
  // 裁剪参数
  cropper: {
    type: Object
  },
  tip: {
    type: String
  }
})

const uploadRef = ref()

const uploadParam = computed(() => {
  const param: ExtractPropTypes<typeof ElUpload> = {
    limit: props.limit,
    ...props,
    fileList: fileList.value,
    onChange,
    onRemove,
    onPreview,
    // 需要裁剪的图片一次只能选择一张
    multiple: !props.cropper
  }

  // 上传图片默认参数
  if (props.type === 'upload-img') {
    if (props.listType === 'text') param.listType = 'picture-card'
    param.accept = 'image/*'
  }

  return param
})

const fileList = ref<any[]>([])
watchEffect(() => {
  const files = (props.modelValue as any[]) ?? []
  files.forEach((file) => {
    if (!file.url) {
      const url = getDownloadFileUrl({ id: file.id, object: file.object })
      if (url) file.url = url
    }
  })
  fileList.value = files
})

const previewImageUrlList = ref<string[]>([])
const previewImageVisible = ref(false)
const initialIndex = ref(1)

const visible = ref(false)
const param = ref({
  type: ''
})
const selection = ref('multiple')

const visible2 = ref(false)
const cropperOption = ref({})
const cropperFile = ref()

// 超过限制时，替换掉第一个 (From element-plus 官网)
const onExceed = (files: UploadFileItem[], fileList: UploadFileItem[]) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
}

function onChange(file: UploadFileItem, files: UploadFileItem[]) {
  if (props.cropper) {
    visible2.value = true
    cropperOption.value = {
      img: file.url,
      onCropper(blob: Blob) {
        const fileName = cropperFile.value.name.replace(/\.[0-9a-z]+$/, '') + '.png'
        const file = new File([blob], fileName, { type: blob.type })
        fileList.value.push({
          ...cropperFile.value,
          name: fileName,
          raw: file,
          size: file.size,
          url: (window.URL || window.webkitURL).createObjectURL(file)
        })
        visible2.value = false
      },
      ...props.cropper
    }
    cropperFile.value = file
    files.pop()
  }
  onUpdateFileList(files)
  props.onChange?.(file, files)
}

function onRemove(file: UploadFileItem, files: UploadFileItem[]) {
  onUpdateFileList(files)
  props.onRemove?.(file, files)
}

function onUpdateFileList(files: UploadFileItem[]) {
  fileList.value = files
  console.log('fileList.value', fileList.value)
  if (props.autoUpload) upload()
  emitModelValue()
}

function onPreview(file: UploadFileItem) {
  if (props.type === 'upload-img') {
    previewImageUrlList.value = fileList.value.map((i) => i.url)
    initialIndex.value = fileList.value.findIndex((i) => i === file)
    previewImageVisible.value = true
  } else {
    if (file.object || file.id) {
      globalThis.open(getDownloadFileUrl({ object: file.object, id: file.id, fileName: file.name }))
    }
  }
}

//
// function onDownload (file) {
//   previewImageUrlList.value = fileList.value.map((i) => i.url)
//   initialIndex.value = fileList.value.findIndex((i) => i === file)
//   previewImageVisible.value = true
// }

// 图片库选择后事件
function select(rows: any[]) {
  onUpdateFileList([
    ...fileList.value,
    ...rows.map((i) => {
      return {
        url: getDownloadFileUrl({ object: i.object }),
        status: 'success',
        id: i.id,
        name: i.name,
        object: i.object,
        contentType: i.contentType,
        suffix: i.suffix,
        size: i.size,
        imgWidth: i.imgWidth,
        imgHeight: i.imgHeight,
        imgRatio: i.imgRatio
      }
    })
  ])
  visible.value = false
}

// 文件手动上传
async function upload() {
  // 'ready' | 'uploading' | 'success' | 'fail'
  const uploadFiles = fileList.value.filter((i) => ['ready', 'fail'].includes(i.status) || !i.status)
  for (const item of uploadFiles) {
    item.status = 'uploading'
    const res = await uploadFile(item.raw)
    if (res) {
      item.status = 'success'
    }
  }
    // try {
    // try {
    //   const res = await uploadFile(item.raw, (progressEvent) => {
    //     item.percentage = (progressEvent.loaded! / progressEvent.total!) * 100
    //   })
    //   item.status = 'success'
    //   item.id = res.data.id
    //   item.name = res.data.name
    //   item.object = res.data.object
    //   item.contentType = res.data.contentType
    //   item.suffix = res.data.suffix
    //   item.size = res.data.size
    //   item.imgWidth = res.data.imgWidth
    //   item.imgHeight = res.data.imgHeight
    //   item.imgRatio = res.data.imgRatio
    // } catch (e) {
    //   item.status = 'fail'
    //   throw e
    // }

  emitModelValue()
}

//从文件库中直接选择
function openFileLib(type?: string) {
  param.value.type = type ?? ''
  visible.value = true
}

function emitModelValue() {
  emit('update:modelValue', fileList.value)
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
