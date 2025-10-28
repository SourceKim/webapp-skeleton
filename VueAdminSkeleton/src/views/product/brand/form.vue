<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="Logo">
      <OverwriteUpload
        v-model="logoUrl"
        :list-type="'picture'"
        :disabled="isDetail"
        :request="uploader"
        tip="支持图片，大小由后端限制"
        replace-text="更新图片"
        @uploaded="onUploaded"
      />
      <el-image-viewer v-if="previewVisible" :url-list="previewList" @close="previewVisible=false" />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" :disabled="isDetail" placeholder="请输入品牌名称" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="form.description" :disabled="isDetail" placeholder="请输入描述" />
    </el-form-item>
    <el-form-item label="官网" prop="website">
      <el-input v-model="form.website" :disabled="isDetail" placeholder="https://..." />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="form.status" :disabled="isDetail" style="width: 200px">
        <el-option label="启用" value="ENABLED" />
        <el-option label="禁用" value="DISABLED" />
      </el-select>
    </el-form-item>

    <el-form-item v-if="!isDetail">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="emit('close')">取消</el-button>
    </el-form-item>
  </el-form>
 </template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateProductBrandDto, ProductBrand, UpdateProductBrandDto } from '@/api/product/brand.d'
import { createBrand, updateBrand } from '@/api/product/brand'
import { uploadMaterial } from '@/api/material/material'
import OverwriteUpload from '@/components/upload/OverwriteUpload.vue'

const props = defineProps<{ handleType?: string, modelValue?: ProductBrand }>()
const emit = defineEmits<{ (e: 'close', refresh?: boolean): void }>()

const isDetail = computed(() => props.handleType === 'detail')
const isEdit = computed(() => props.handleType === 'edit')

const formRef = ref<FormInstance>()
const form = reactive<CreateProductBrandDto & { id?: string }>({
  name: '',
  description: '',
  website: '',
  status: 'ENABLED',
  material_id: ''
})
const logoUrl = ref<string>()
const previewVisible = ref(false)
const previewList = ref<string[]>([])

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

watch(() => props.modelValue, (v) => {
  if (!v) return
  form.id = v.id
  form.name = v.name
  form.description = v.description || ''
  form.website = v.website || ''
  form.status = v.status
  form.material_id = v.material_id || ''
  logoUrl.value = v.logo_url
}, { immediate: true })

async function onSubmit() {
  await formRef.value?.validate()
  if (isEdit.value && form.id) {
    const payload: UpdateProductBrandDto = {
      name: form.name,
      description: form.description,
      website: form.website,
      status: form.status,
      material_id: form.material_id || undefined,
    }
    await updateBrand(form.id, payload)
  } else {
    await createBrand({
      name: form.name,
      description: form.description,
      website: form.website,
      status: form.status,
      material_id: form.material_id || undefined,
    })
  }
  emit('close', true)
}

function onUploaded(res: { url: string; id?: string; raw?: any }) {
  logoUrl.value = res.url
  if (res.id) form.material_id = res.id
}

const uploader = async (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('is_public', 'true')
  fd.append('description', 'brand logo')
  const res: any = await uploadMaterial(fd, { showLoading: true })
  if (res?.code === 0 && res.data?.id) {
    const UPLOAD_BASE = (import.meta.env.VITE_UPLOAD_BASE_URL || import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/') as string
    const base = UPLOAD_BASE.replace(/\/$/, '')
    const filePath = String(res.data.file_path || '').replace(/^\//,'')
    const url = `${base}/${filePath}`
    return { url, id: res.data.id, raw: res.data }
  }
  throw new Error('upload failed')
}
</script>

<style scoped>
</style>


