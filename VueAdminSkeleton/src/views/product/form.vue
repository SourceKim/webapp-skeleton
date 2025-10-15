<template>
  <div class="product-form">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="12"
        :columns="columns"
        :model="form"
        :handleType="handleType"
        :loading="formLoading"
      >
        <template #materials>
          <el-form-item class="form-item">
            <template #label>
              <div class="form-item-label"><div>资源库</div></div>
            </template>
            <div class="form-input">
              <el-button type="primary" icon="folder" :disabled="isDetail" @click="openMaterialPicker">选择资源</el-button>
              <div v-if="selectedMaterials.length" style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
                <el-tag
                  v-for="m in selectedMaterials"
                  :key="m.id"
                  closable
                  :disable-transitions="true"
                  @close="removeMaterial(m.id)"
                >{{ materialLabel(m) }}</el-tag>
              </div>
            </div>
          </el-form-item>
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close(false)">{{ $t('common.cancel') }}</el-button>
      <template v-if="!formLoading">
        <el-button
          v-if="handleType && ['add', 'edit'].includes(handleType)"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
    <el-dialog
      v-model="pickerVisible"
      title="选择资源"
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="60%"
    >
      <m-table
        class="m-table"
        ref="pickerTableRef"
        is-filter-table
        is-complex-filter
        row-key="id"
        selection="multiple"
        v-model:data="pickerData"
        :filter-param="pickerFilterParam"
        :columns="pickerColumns"
        :fetch-data="getMaterials"
        @selection-change="(rows:any) => (materialSelectRows = rows)"
        style="height: 60vh"
      >
        <template #left-action>
          <el-button type="primary" :disabled="!materialSelectRows.length" @click="confirmSelectMaterials">{{ $t('common.select') }}</el-button>
        </template>
      </m-table>
    </el-dialog>
  </div>
 </template>

<script setup lang='ts'>
import MForm from '@/components/form/index.vue'
import { reactive, ref, watch, computed } from 'vue'
import type { Product } from '@/api/product/product.d'
import type { Material } from '@/api/material/material.d'
import { createProduct, updateProduct } from '@/api/product/product'
import type { CommonFormColumn } from '@/components/interface/form'
import { formColumnTypes } from '@/components/mutils'
import MTable from '@/components/table/index.vue'
import { getMaterials } from '@/api/material/material'

const props = defineProps<{ handleType?: 'add' | 'edit' | 'detail'; modelValue?: Product }>()
const emit = defineEmits<{ (e: 'close', refresh?: boolean): void }>()
const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  status: 'active' as 'active' | 'inactive',
  material_ids: [] as string[]
})

const isDetail = computed(() => props.handleType === 'detail')

// 提前定义，避免 watch(immediate) 期间 TDZ 报错
const selectedMaterials = ref<Material[]>([])

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return
    form.name = v.name
    form.description = v.description || ''
    form.price = v.price
    form.stock = v.stock
    form.status = v.status
    const materials = v.materials || []
    selectedMaterials.value = (materials as unknown as Material[])
    form.material_ids = materials.map(m => m.id)
  },
  { immediate: true }
)

function close(needRefresh = false) {
  emit('close', needRefresh)
}

async function save() {
  try {
    saveLoading.value = true
    await formRef.value.submit()
    // 强制将数值字段转为 number，避免字符串导致后端校验失败
    form.price = Number(form.price)
    form.stock = Number(form.stock)
    if (props.handleType === 'add') {
      await createProduct(form)
    } else if (props.handleType === 'edit' && props.modelValue) {
      await updateProduct(props.modelValue.id, form)
    }
    saveLoading.value = false
    close(true)
  } catch (e) {
    saveLoading.value = false
  }
}

const columns = computed((): CommonFormColumn<typeof form>[] => [
  formColumnTypes.input({ prop: 'name', label: '名称', required: true }),
  formColumnTypes.textarea({ prop: 'description', label: '描述', rows: 3 }),
  formColumnTypes.input({ prop: 'price', label: '价格', required: true, type: 'number', min: 0 }),
  formColumnTypes.input({ prop: 'stock', label: '库存', required: true, type: 'number', min: 0 }),
  formColumnTypes.select({ prop: 'status', label: '状态', itemList: [
    { label: 'active', value: 'active' },
    { label: 'inactive', value: 'inactive' }
  ] }),
  { slotName: 'materials' },
  ...(props.handleType !== 'add' ? [
    formColumnTypes.readonly({ prop: 'id', label: 'ID' })
  ] : [])
])

// 资源库选择
const pickerVisible = ref(false)
const pickerTableRef = ref()
const pickerFilterParam = reactive({})
const pickerData = ref<Material[]>([])
const materialSelectRows = ref<Material[]>([])

const pickerColumns = computed(() => [
  { prop: 'id', label: 'ID', width: 160 },
  { prop: 'original_name', label: '原文件名', width: 180 },
  { prop: 'filename', label: '文件名', width: 180 },
  { prop: 'type', label: '类型', width: 100 }
])

function openMaterialPicker() {
  if (isDetail.value) return
  pickerVisible.value = true
}

function confirmSelectMaterials() {
  selectedMaterials.value = materialSelectRows.value.slice()
  form.material_ids = selectedMaterials.value.map(m => m.id)
  pickerVisible.value = false
}

function removeMaterial(id: string) {
  if (isDetail.value) return
  selectedMaterials.value = selectedMaterials.value.filter(m => m.id !== id)
  form.material_ids = selectedMaterials.value.map(m => m.id)
}

function materialLabel(m: Partial<Material> & { file_path?: string; filename?: string; id: string }) {
  return m.filename || (m as any).original_name || (m.file_path ? ((m.file_path.split('/').pop()) || m.id) : m.id)
}
</script>
<style scoped lang="scss">
.product-form {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;
  }
}
</style>