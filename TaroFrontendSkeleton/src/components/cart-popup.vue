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
import Taro from '@tarojs/taro'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const cartStore = useCartStore()
const { items, loading, totalCount, totalPrice } = storeToRefs(cartStore)

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const togglingIds = ref<Set<string>>(new Set())
const suppressIds = ref<Set<string>>(new Set())

const selectedCount = computed(() => items.value.filter(i => i.selected).reduce((n, i) => n + (Number(i.quantity)||0), 0))

const close = () => { visible.value = false }

function coverOf(it: any): string | undefined {
  return getUploadUrl(it?.spu?.main_material.file_path)
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
  await cartStore.updateQty(it.id, qty)
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
  await cartStore.removeItem(it.id)
}

watch(() => props.modelValue, (v) => { if (v) cartStore.fetchCart() })
onMounted(() => { if (visible.value) cartStore.fetchCart() })
</script>

<style lang="scss">
.cart-popup { display: flex; flex-direction: column; height: 100%; }
.cart-popup .header { display: flex; align-items: center; justify-content: space-between; padding: 12px $style-spacing-sm; font-weight: 600; border-bottom: 1px solid $style-border-color; }
.cart-popup .list { flex: 1; padding: 8px 12px; }
.cart-popup .empty { color: $style-text-color-secondary; text-align: center; padding: $style-spacing-base 0; }
.cart-popup .item { display: flex; align-items: center; gap: 8px; padding: 10px 6px; background: $style-color-white; border-radius: $style-border-radius-base; margin-bottom: 8px; }
.cart-popup .cover { width: 56px; height: 56px; border-radius: 6px; background: $style-color-bg }
.cart-popup .info { flex: 1; display: flex; flex-direction: column; }
.cart-popup .name { font-size: $style-text-size-base; }
.cart-popup .title { display: flex; gap: 8px; align-items: baseline; }
.cart-popup .sub { color: $style-text-color-secondary; font-size: $style-text-size-sm; }
.cart-popup .price { color: $style-text-color-price; font-weight: 600; margin-top: 4px; }
.cart-popup .footer { border-top: 1px solid $style-border-color; padding: 10px 12px env(safe-area-inset-bottom); display: flex; align-items: center; justify-content: space-between; }
.attrs { margin-top: 4px; color: $style-text-color-regular; font-size: $style-text-size-sm; display: flex; flex-wrap: wrap; gap: 6px; }
.attr { background: $style-color-bg; padding: 2px 6px; border-radius: 3px; }
</style>
