<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" :disabled="isDetail" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="副标题">
      <el-input v-model="form.sub_title" :disabled="isDetail" placeholder="请输入副标题" />
    </el-form-item>
    <el-form-item label="描述">
      <el-input type="textarea" v-model="form.description" :disabled="isDetail" placeholder="请输入描述" />
    </el-form-item>
    <el-form-item label="主图">
      <OverwriteUpload v-model="mainImageUrl" :disabled="isDetail" :request="uploadMain" list-type="picture" replace-text="更新主图" @uploaded="(res)=> form.main_material_id = res.id" />
    </el-form-item>
    <el-form-item label="图集">
      <el-upload
        list-type="picture-card"
        :auto-upload="false"
        multiple
        :file-list="gallery"
        :http-request="uploadSub"
        :on-change="() => galleryRef?.submit()"
        :on-remove="onGalleryRemove"
        ref="galleryRef"
        accept="image/*"
        :disabled="isDetail"
      >
        <el-icon><plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="品牌">
      <el-input v-model="brandName" disabled placeholder="未选择" style="width: 240px; margin-right: 8px;" />
      <el-button v-if="!isDetail" size="small" @click="selectBrandVisible = true">选择</el-button>
    </el-form-item>
    <el-form-item label="分类">
      <el-input v-model="categoryName" disabled placeholder="需先选品牌" style="width: 240px; margin-right: 8px;" />
      <el-button v-if="!isDetail" size="small" @click="openSelectCategory">选择</el-button>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status" :disabled="isDetail" style="width: 200px">
        <el-option label="草稿" value="DRAFT" />
        <el-option label="上架" value="ON_SHELF" />
        <el-option label="下架" value="OFF_SHELF" />
      </el-select>
    </el-form-item>
    <el-form-item label="详情">
      <el-input type="textarea" :rows="6" v-model="form.detail_content" :disabled="isDetail" placeholder="可填 HTML" />
    </el-form-item>

    <el-form-item v-if="!isDetail">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="emit('close')">取消</el-button>
    </el-form-item>
  </el-form>

  <el-dialog title="选择分类" v-model="selectCategoryVisible" width="50%" append-to-body>
    <el-table :data="categoryList" @row-click="onPickCategory" height="400">
      <el-table-column label="图片" width="80">
        <template #default="{ row }">
          <el-image :src="row.image_url" style="width:40px;height:40px;object-fit:cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
    </el-table>
  </el-dialog>

  <el-dialog title="选择品牌" v-model="selectBrandVisible" width="40%" append-to-body>
    <el-table :data="brandList" @row-click="onPickBrand">
      <el-table-column label="Logo" width="80">
        <template #default="{ row }">
          <el-image :src="row.logo_url" style="width:40px;height:40px;object-fit:cover" :preview-src-list="row.logo_url ? [row.logo_url] : []" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态" width="100" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules, UploadFile, UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { CreateProductSpuDto, ProductSpu, UpdateProductSpuDto } from '@/api/product/spu.d'
import { createSpu, updateSpu } from '@/api/product/spu'
import { uploadMaterial } from '@/api/material/material'
import OverwriteUpload from '@/components/upload/OverwriteUpload.vue'
import { Plus } from '@element-plus/icons-vue'
import { getCategories } from '@/api/product/category'
import { getBrandsAll } from '@/api/product/brand'
import type { ProductBrand } from '@/api/product/brand.d'
import { getUploadFileUrl } from '@/utils/file'

const props = defineProps<{ handleType?: string, modelValue?: ProductSpu }>()
const emit = defineEmits<{ (e: 'close', refresh?: boolean): void }>()

const isDetail = computed(() => props.handleType === 'detail')
const isEdit = computed(() => props.handleType === 'edit')

const formRef = ref<FormInstance>()
const form = reactive<CreateProductSpuDto & { id?: string; sub_material_ids?: string[] }>({
  name: '',
  sub_title: '',
  description: '',
  category_id: undefined,
  brand_id: undefined,
  status: 'DRAFT',
  main_material_id: undefined,
  sub_material_ids: [],
  detail_content: ''
})
const mainImageUrl = ref<string>()
const gallery = ref<UploadFile[]>([])
const galleryRef = ref<UploadInstance>()
const categoryName = ref('')
const brandName = ref('')
const selectCategoryVisible = ref(false)
const selectBrandVisible = ref(false)
const brandList = ref<ProductBrand[]>([])
const categoryList = ref<any[]>([])

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

watch(() => props.modelValue, (v) => {
  if (!v) return
  form.id = v.id
  form.name = v.name
  form.sub_title = v.sub_title || ''
  form.description = v.description || ''
  form.category_id = v.category_id
  form.brand_id = v.brand_id
  form.status = v.status
  form.main_material_id = v.main_material_id
  form.sub_material_ids = (v.sub_materials || []).map((m: any) => m.id)
  form.detail_content = v.detail_content || ''
  mainImageUrl.value = (v as any)?.main_material?.file_path ? (getUploadFileUrl((v as any).main_material.file_path) || undefined) : undefined
  // 初始化图集预览
  const files = ((v.sub_materials || []) as any[]).map(m => ({ name: m.filename || m.original_name || m.id, url: getUploadFileUrl(m.file_path) || '', response: { id: m.id } }))
  gallery.value = files as any
  categoryName.value = (v as any)?.category?.name || ''
  brandName.value = (v as any)?.brand?.name || ''
}, { immediate: true })

async function onSubmit() {
  await formRef.value?.validate()
  if (isEdit.value && form.id) {
    const payload: UpdateProductSpuDto = {
      name: form.name,
      sub_title: form.sub_title,
      description: form.description,
      category_id: form.category_id ?? null,
      brand_id: form.brand_id ?? null,
      status: form.status,
      main_material_id: form.main_material_id ?? null,
      sub_material_ids: form.sub_material_ids ?? null,
      detail_content: form.detail_content ?? null
    }
    await updateSpu(form.id, payload)
  } else {
    await createSpu({
      name: form.name,
      sub_title: form.sub_title,
      description: form.description,
      category_id: form.category_id,
      brand_id: form.brand_id,
      status: form.status,
      main_material_id: form.main_material_id,
      sub_material_ids: form.sub_material_ids,
      detail_content: form.detail_content
    })
  }
  emit('close', true)
}

async function uploadMain(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('is_public', 'true')
  fd.append('description', 'spu main image')
  const res: any = await uploadMaterial(fd, { showLoading: true })
  if (res?.code === 0 && res.data?.id) {
    const url = getUploadFileUrl(res.data.file_path) || ''
    return { url, id: res.data.id, raw: res.data }
  }
  throw new Error('upload failed')
}

async function uploadSub(option: any) {
  const file: File = option.file
  const fd = new FormData()
  fd.append('file', file)
  fd.append('is_public', 'true')
  fd.append('description', 'spu sub image')
  const res: any = await uploadMaterial(fd, { showLoading: false })
  if (res?.code === 0 && res.data?.id) {
    const url = getUploadFileUrl(res.data.file_path) || ''
    form.sub_material_ids = [...(form.sub_material_ids || []), res.data.id]
    option.onSuccess?.({ url, id: res.data.id }, file)
  } else {
    option.onError?.(new Error('upload failed'))
  }
}

// 分类选择
async function openSelectCategory() {
  if (!form.brand_id) {
    ElMessage.warning('请先选择品牌')
    return
  }
  const res: any = await getCategories({ filters: { brand_id: form.brand_id }, limit: 1000 } as any)
  categoryList.value = (res?.code === 0 ? res.data?.items : []) || []
  selectCategoryVisible.value = true
}
function onPickCategory(row: any) {
  form.category_id = row.id
  categoryName.value = row.name
  selectCategoryVisible.value = false
}

// 品牌列表获取
watch(selectBrandVisible, async (v) => {
  if (v) {
    const res: any = await getBrandsAll({ limit: 100, status: 'ENABLED' })
    brandList.value = (res?.code === 0 ? res.data?.items : []) || []
  }
})
function onPickBrand(r: ProductBrand) {
  // 品牌变更，清空分类
  if (form.brand_id !== r.id) {
    form.brand_id = r.id
    brandName.value = r.name
    form.category_id = undefined
    categoryName.value = ''
  }
  selectBrandVisible.value = false
}

function onGalleryRemove(file: any, fileList: any[]) {
  // 从当前文件列表同步 sub_material_ids，优先读取 response.id
  const ids: string[] = []
  for (const f of fileList) {
    const id = f?.response?.id
    if (id) ids.push(id)
  }
  form.sub_material_ids = ids
}
</script>

<style scoped>
</style>


