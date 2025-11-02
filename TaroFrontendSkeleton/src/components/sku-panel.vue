<template>
  <nut-sku
    v-model:visible="model"
    :sku="localSku"
    :sku-list="skuList"
    :goods="goods"
    :loading="loading"
    :btn-options="btnOptions"
    @close="onClose"
    @add-cart="onAddCart"
    @buy-click="onBuyClick"
    @select-sku="onSelectSku"
    @click-btn-operate="onClickBtnOperate"
  />
  
</template>

<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'

interface GoodsData { imagePath?: string; price?: number; stockNum?: number; [k: string]: any }

const props = withDefaults(defineProps<{
  modelValue: boolean
  sku: any[]
  skuList: any[]
  goods: GoodsData
  loading?: boolean
  btnOptions?: Array<'buy' | 'cart'>
}>(), {
  loading: false,
  btnOptions: () => ['buy', 'cart']
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'close'): void
  (e: 'add-cart', payload?: any): void
  (e: 'buy-click', payload?: any): void
  (e: 'select-sku', payload?: any): void
  (e: 'click-btn-operate', payload?: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const onClose = () => {
  emit('close')
  emit('update:modelValue', false)
}
const onAddCart = (p: any) => emit('add-cart', p)
const onBuyClick = (p: any) => emit('buy-click', p)

// 本地可选状态副本
const localSku = shallowRef<any[]>([])
watch(() => props.sku, (v) => {
  try {
    localSku.value = JSON.parse(JSON.stringify(v || []))
  } catch {
    localSku.value = Array.isArray(v) ? [...(v as any[])] : []
  }
}, { immediate: true, deep: true })

// 规格点击：维护 active，并透传事件
function onSelectSku(ss: any) {
  const { sku, parentIndex } = ss || {}
  if (typeof parentIndex !== 'number' || !localSku.value[parentIndex]) {
    emit('select-sku', ss)
    return
  }
  const group = localSku.value[parentIndex]
  if (group && Array.isArray(group.list)) {
    group.list.forEach((s: any) => { s.active = s?.id === sku?.id })
    // 触发视图更新（shallowRef 不追踪深层变更）
    const next = localSku.value.map((g: any) => ({
      ...g,
      list: g?.list ? g.list.map((it: any) => ({ ...it })) : []
    }))
    localSku.value = next
  }
  emit('select-sku', ss)
}

function onClickBtnOperate(op: any) {
  emit('click-btn-operate', op)
}
</script>

<style scoped>
</style>


