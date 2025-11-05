<template>
  <nut-popup v-model:visible="visible" position="bottom" :style="{ height: '50vh' }" lock-scroll round :safe-area-inset-bottom="true">
    <view class="cart-popup">
      <view class="header">
        <text>购物车</text>
        <nut-icon name="close" @click="close" />
      </view>
      <scroll-view class="list" scroll-y>
        <view v-if="!loading && items.length === 0" class="empty">暂无商品</view>
        <view v-for="it in items" :key="it.id" class="item">
          <nut-checkbox v-model="it.selected" :disabled="togglingIds.has(it.id)" @change="onToggleSelected(it)" />
          <image v-if="coverOf(it)" class="cover" :src="coverOf(it)" mode="aspectFill" />
          <view class="info">
            <view class="title">
              <text class="name">{{ it.spu?.name || '商品' }}</text>
              <text v-if="it.spu?.sub_title" class="sub">{{ it.spu?.sub_title }}</text>
            </view>
            <text class="price">￥{{ Number(it.sku?.price || 0).toFixed(2) }}</text>
            <view v-if="Array.isArray(it.sku?.attributes) && it.sku.attributes.length" class="attrs">
              <text v-for="a in it.sku.attributes" :key="(a.key_id||'') + ':' + (a.value_id||'')" class="attr">
                {{ a.key_name || a.key_id }}：{{ a.value || a.value_id }}
              </text>
            </view>
          </view>
          <nut-input-number v-model="it.quantity" min="1" @change="(val:any)=>onChangeQty(it, Number(val))" />
          <nut-icon name="del2" @click="remove(it)" />
        </view>
      </scroll-view>
      <view class="footer">
        <view class="total">已选 {{ selectedCount }} 件，合计 ￥{{ totalPrice.toFixed(2) }}</view>
        <nut-button type="primary" size="small" :disabled="selectedCount===0" @click="goConfirm">去结算</nut-button>
      </view>
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref, nextTick } from 'vue'
import api from '@/services/api'
import { getUploadUrl } from '@/services/mall'
import Taro from '@tarojs/taro';

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const loading = ref(false)
const items = ref<any[]>([])
const togglingIds = ref<Set<string>>(new Set())
const suppressIds = ref<Set<string>>(new Set())

const selectedCount = computed(() => items.value.filter(i => i.selected).reduce((n, i) => n + (Number(i.quantity)||0), 0))
const totalPrice = computed(() => items.value.filter(i => i.selected).reduce((sum, i) => sum + Number(i.sku?.price || 0) * (Number(i.quantity)||0), 0))

const close = () => { visible.value = false }

async function fetchList() {
  loading.value = true
  try {
    const { code, data } = await api.get('/cart')
    if (code === 0 && data) items.value = data as any[]
  } finally {
    loading.value = false
  }
}

function coverOf(it: any): string | undefined {
  return getUploadUrl(it?.spu?.main_material)
}

function goConfirm() {
  const ids = items.value.filter(i => i.selected).map(i => i.id)
  if (!ids.length) return
  emit('update:modelValue', false)
  setTimeout(() => {
    // 以逗号串传递 cart_item_ids
    Taro.navigateTo({ url: `/pages/mall/order-confirm/index?ids=${ids.join(',')}` })
  }, 0)
}

async function onChangeQty(it: any, qty: number) {
  if (!qty || qty < 1) return
  const { code, data } = await api.put(`/cart/${it.id}`, { quantity: qty })
  if (code === 0 && data) {
    it.quantity = (data as any).quantity
  }
}

async function onToggleSelected(it: any) {
  if (!it?.id) return
  if (suppressIds.value.has(it.id)) return
  if (togglingIds.value.has(it.id)) return
  const target = !!it.selected
  togglingIds.value.add(it.id)
  const { code } = await api.put('/cart/selected', { selected: target, cart_item_ids: [it.id] })
  if (code !== 0) {
    // 失败回退，阻止回退触发的 change 再次调用
    suppressIds.value.add(it.id)
    it.selected = !target
    await nextTick()
    suppressIds.value.delete(it.id)
  }
  togglingIds.value.delete(it.id)
}

async function remove(it: any) {
  const { code } = await api.delete(`/cart/${it.id}`)
  if (code === 0) items.value = items.value.filter(x => x.id !== it.id)
}

watch(() => props.modelValue, (v) => { if (v) fetchList() })
onMounted(() => { if (visible.value) fetchList() })
</script>

<style lang="scss">
.cart-popup { display: flex; flex-direction: column; height: 100%; }
.cart-popup .header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; font-weight: 600; border-bottom: 1px solid #f0f0f0; }
.cart-popup .list { flex: 1; padding: 8px 12px; }
.cart-popup .empty { color: #999; text-align: center; padding: 24px 0; }
.cart-popup .item { display: flex; align-items: center; gap: 8px; padding: 10px 6px; background: #fff; border-radius: 8px; margin-bottom: 8px; }
.cart-popup .cover { width: 56px; height: 56px; border-radius: 6px; background: #f6f6f6 }
.cart-popup .info { flex: 1; display: flex; flex-direction: column; }
.cart-popup .name { font-size: 14px; }
.cart-popup .title { display: flex; gap: 8px; align-items: baseline; }
.cart-popup .sub { color: #888; font-size: 12px; }
.cart-popup .price { color: #fa2c19; font-weight: 600; margin-top: 4px; }
.cart-popup .footer { border-top: 1px solid #f0f0f0; padding: 10px 12px env(safe-area-inset-bottom); display: flex; align-items: center; justify-content: space-between; }
.attrs { margin-top: 4px; color: #666; font-size: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
.attr { background: #f6f6f6; padding: 2px 6px; border-radius: 3px; }
</style>


