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
import Taro from '@tarojs/taro'

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
function getSelections() {
  const pairs: string[] = []
  const map: Record<string, string> = {}
  for (const group of localSku.value || []) {
    const k = group?.id
    const active = Array.isArray(group?.list) ? group.list.find((it: any) => it?.active) : null
    if (!k || !active?.id) return { ok: false, pairs: [], map: {} }
    pairs.push(`${k}:${active.id}`)
    map[k] = String(active.id)
  }
  return { ok: true, pairs, map }
}

function resolveMatchedSku(pairs: string[]) {
  // 允许空 pairs (默认 SKU)
  const key = (pairs || []).join(';')
  // skuList 中 row.skuId 在上游构建时按相同顺序拼接
  const item = (props.skuList || []).find((row: any) => String(row?.skuId || '') === key)
  return item || null
}

function forwardOperate(type: 'cart'|'buy', original: any) {
  const sel = getSelections()
  if (!sel.ok) {
    Taro.showToast({ title: '请选择完整规格', icon: 'none' })
    return
  }
  const matched = resolveMatchedSku(sel.pairs)
  if (!matched) {
    Taro.showToast({ title: '该规格不存在或已下架', icon: 'none' })
    return
  }
  const payload = {
    ...original,
    sku: { id: matched.id, price: matched.price, stock: matched.stock },
    skuPairs: sel.pairs,
    selections: sel.map,
    buyNum: Number(original?.buyNum || original?.num || 1)
  }
  if (type === 'cart') emit('add-cart', payload)
  else emit('buy-click', payload)
}

const onAddCart = (p: any) => forwardOperate('cart', p)
const onBuyClick = (p: any) => forwardOperate('buy', p)

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
  // 兼容不同版本的 NutUI Sku：有的版本只抛 click-btn-operate
  const t = op?.operate || op?.type || op?.event || op
  if (t === 'cart' || t === 'add-cart') {
    forwardOperate('cart', op)
    return
  }
  if (t === 'buy' || t === 'buy-click') {
    forwardOperate('buy', op)
    return
  }
  emit('click-btn-operate', op)
}
</script>

<style scoped>
</style>


