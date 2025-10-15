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
      />
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
  </div>
 </template>

<script setup lang='ts'>
import MForm from '@/components/form/index.vue'
import { reactive, ref, watch, computed } from 'vue'
import type { Product } from '@/api/product/product.d'
import { createProduct, updateProduct } from '@/api/product/product'
import type { CommonFormColumn } from '@/components/interface/form'
import { formColumnTypes } from '@/components/mutils'

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
  status: 'active' as 'active' | 'inactive'
})

const isDetail = computed(() => props.handleType === 'detail')

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return
    form.name = v.name
    form.description = v.description || ''
    form.price = v.price
    form.stock = v.stock
    form.status = v.status
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
  ...(props.handleType !== 'add' ? [
    formColumnTypes.readonly({ prop: 'id', label: 'ID' })
  ] : [])
])
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