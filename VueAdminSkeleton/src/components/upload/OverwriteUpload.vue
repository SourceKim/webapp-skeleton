<template>
  <div class="overwrite-upload">
    <el-upload
      ref="uploadRef"
      :file-list="fileList"
      :limit="limit"
      :accept="accept"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :http-request="handleHttpRequest"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :auto-upload="false"
      :disabled="disabled"
      :list-type="listType"
    >
      <template #trigger>
        <el-button v-if="hasFile" :disabled="disabled" type="primary" plain size="small">{{ replaceText }}</el-button>
        <el-icon v-else><plus /></el-icon>
      </template>
      <template #tip>
        <div v-if="showTip && tip" class="el-upload__tip">{{ tip }}</div>
      </template>
    </el-upload>

    <el-image-viewer v-if="previewVisible" :url-list="previewList" @close="previewVisible = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { UploadInstance, UploadProps, UploadUserFile } from 'element-plus'
import { ElImageViewer } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

type UploadResult = { url: string; id?: string; raw?: any }

const props = withDefaults(defineProps<{
  modelValue?: string
  disabled?: boolean
  limit?: number
  accept?: string
  tip?: string
  showTip?: boolean
  listType?: 'text' | 'picture' | 'picture-card'
  overwrite?: boolean
  replaceText?: string
  // 必须：调用方传入上传实现，返回可访问的 url 与可选 id
  request: (file: File) => Promise<UploadResult>
}>(), {
  disabled: false,
  limit: 1,
  accept: 'image/*',
  tip: '仅支持图片，大小受后端限制',
  showTip: true,
  listType: 'picture-card',
  overwrite: true,
  replaceText: '更换图片'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v?: string): void
  (e: 'uploaded', payload: UploadResult): void
  (e: 'remove'): void
  (e: 'error', err: any): void
}>()

const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
const previewVisible = ref(false)
const previewList = ref<string[]>([])

const hasFile = computed(() => fileList.value.length > 0)

watch(() => props.modelValue, (v) => {
  if (v) fileList.value = [{ name: 'file', url: v }]
  else fileList.value = []
}, { immediate: true })

const handleExceed: UploadProps['onExceed'] = (files) => {
  if (!props.overwrite) return
  const file = files[0]
  // 覆盖：清空并开始新文件
  uploadRef.value?.clearFiles()
  // @ts-expect-error 私有方法，但 Element Plus 示例中常用
  uploadRef.value?.handleStart(file)
  uploadRef.value?.submit()
}

const handleChange: UploadProps['onChange'] = () => {
  // 初次选择文件时，自动提交（auto-upload=false 时需要手动 submit）
  if (!props.disabled) {
    uploadRef.value?.submit()
  }
}

const handleHttpRequest: UploadProps['httpRequest'] = async (option) => {
  try {
    const file = option.file as File
    const res = await props.request(file)
    fileList.value = [{ name: file.name || 'file', url: res.url }]
    emit('update:modelValue', res.url)
    emit('uploaded', res)
    option.onSuccess?.(res as any)
  } catch (err) {
    emit('error', err)
    option.onError?.(err as any)
  }
}

const handleRemove: UploadProps['onRemove'] = () => {
  fileList.value = []
  emit('update:modelValue', undefined)
  emit('remove')
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  const url = (file as any).url as string | undefined
  if (!url) return
  previewList.value = [url]
  previewVisible.value = true
}
</script>

<style scoped>
.overwrite-upload {
  display: inline-block;
}
</style>


