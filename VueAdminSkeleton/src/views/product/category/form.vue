<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="上级分类">
      <el-input v-model="parentName" disabled placeholder="顶级分类" style="width: 240px; margin-right: 8px;" />
      <el-button v-if="!isDetail" size="small" @click="chooseParent">选择</el-button>
      <el-button v-if="!isDetail && form.parent_id" size="small" @click="clearParent">清除</el-button>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" :disabled="isDetail" placeholder="请输入分类名称" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="form.description" :disabled="isDetail" placeholder="请输入描述" />
    </el-form-item>
    <el-form-item label="图片">
      <Upload v-model="imageUrl" :disabled="isDetail" :request="uploader" list-type="picture" replace-text="更新图片" @uploaded="onUploaded" />
    </el-form-item>
    <el-form-item label="层级">
      <el-input v-model="levelStr" disabled style="width: 120px;" />
    </el-form-item>
    <el-form-item label="所属品牌">
      <el-select v-model="form.brand_id" :disabled="isDetail" placeholder="请选择品牌" style="width: 240px" clearable>
        <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status" :disabled="isDetail" style="width: 200px">
        <el-option label="启用" value="ENABLED" />
        <el-option label="禁用" value="DISABLED" />
      </el-select>
    </el-form-item>

    <el-form-item v-if="!isDetail">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="emit('close')">取消</el-button>
    </el-form-item>

    <el-dialog title="选择上级分类" v-model="selectVisible" width="40%" append-to-body>
      <el-tree
        ref="treeRef"
        node-key="id"
        :props="{ label: 'name', children: 'children', isLeaf: 'isLeaf' }"
        :load="loadNode"
        lazy
        highlight-current
        @node-click="onPickParentNode"
      />
    </el-dialog>
  </el-form>
 </template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateProductCategoryDto, ProductCategory, UpdateProductCategoryDto } from '@/api/product/category.d'
import type { ProductBrand } from '@/api/product/brand.d'
import { createCategory, updateCategory, getCategories } from '@/api/product/category'
import { getBrandsAll } from '@/api/product/brand'
import { uploadMaterial } from '@/api/material/material'
import { getUploadFileUrl } from '@/utils/file'
import Upload from '@/components/upload/Upload.vue'

const props = defineProps<{ handleType?: string, modelValue?: ProductCategory }>()
const emit = defineEmits<{ (e: 'close', refresh?: boolean): void }>()

const isDetail = computed(() => props.handleType === 'detail')
const isEdit = computed(() => props.handleType === 'edit')

const formRef = ref<FormInstance>()
const form = reactive<CreateProductCategoryDto & { id?: string; level?: number }>({
  name: '',
  description: '',
  parent_id: undefined,
  material_id: undefined,
  brand_id: undefined,
  status: 'ENABLED'
})
const imageUrl = ref<string>()
const parentName = ref('顶级分类')
const selectVisible = ref(false)
const treeRef = ref()

const brandList = ref<ProductBrand[]>([])

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

const levelStr = computed(() => String(form.level ?? 0))

watch(() => props.modelValue, (v) => {
  if (!v) return
  form.id = v.id
  form.name = v.name
  form.description = v.description || ''
  form.parent_id = v.parent_id
  form.level = v.level
  form.status = v.status
  form.material_id = v.material_id
  form.brand_id = v.brand_id
  imageUrl.value = v.material?.file_path ? getUploadFileUrl(v.material.file_path) || undefined : undefined
  parentName.value = v.parent_id ? v.parent_id : '顶级分类'
}, { immediate: true })

async function fetchBrands() {
  const res = await getBrandsAll({ limit: 100, status: 'ENABLED' })
  if (res.code === 0) {
    brandList.value = res.data?.items || []
  }
}

async function onSubmit() {
  await formRef.value?.validate()
  if (isEdit.value && form.id) {
    const payload: UpdateProductCategoryDto = {
      name: form.name,
      description: form.description,
      parent_id: form.parent_id ?? null,
      material_id: form.material_id ?? null,
      brand_id: form.brand_id ?? null,
      status: form.status,
    }
    await updateCategory(form.id, payload)
  } else {
    await createCategory({
      name: form.name,
      description: form.description,
      parent_id: form.parent_id,
      material_id: form.material_id,
      brand_id: form.brand_id,
      status: form.status,
    })
  }
  emit('close', true)
}

onMounted(fetchBrands)

function onUploaded(res: { url: string; id?: string; raw?: any }) {
  imageUrl.value = res.url
  if (res.id) form.material_id = res.id
}

const uploader = async (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('is_public', 'true')
  fd.append('description', 'category image')
  const res: any = await uploadMaterial(fd, { showLoading: true })
  if (res?.code === 0 && res.data?.id) {
    const url = getUploadFileUrl(res.data.file_path) || ''
    return { url, id: res.data.id, raw: res.data }
  }
  throw new Error('upload failed')
}

async function chooseParent() {
  selectVisible.value = true
  await nextTick()
  // 触发根节点渲染
  ;(treeRef.value as any)?.load(null, () => {})
}
function onPickParentNode(node: ProductCategory) {
  form.parent_id = node.id
  parentName.value = node.name
  form.level = (node.level ?? 0) + 1
  selectVisible.value = false
}
const loadNode = async (node: any, resolve: (data: any[]) => void) => {
  if (node.level === 0) {
    const res: any = await getCategories({ parent_id: null })
    const list = (res?.code === 0 ? res.data?.items : []) || []
    return resolve(list.map((i: any) => ({ ...i, isLeaf: false })))
  }
  const parent = node.data
  const res: any = await getCategories({ parent_id: parent.id })
  const list = (res?.code === 0 ? res.data?.items : []) || []
  return resolve(list.map((i: any) => ({ ...i, isLeaf: false })))
}
function clearParent() {
  form.parent_id = undefined
  parentName.value = '顶级分类'
  form.level = 0
}
</script>

<style scoped>
</style>


