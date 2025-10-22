<template>
  <view v-if="visible" class="cart-modal" @tap="emitClose">
    <view class="cart-panel" @tap.stop>
      <view class="cart-header">
        <text>我的购物车</text>
        <button size="mini" class="close-btn" @tap="emitClose">关闭</button>
      </view>
      <view class="cart-body">
        <view v-if="loading" class="loading">加载中...</view>
        <view v-else-if="!(cart?.items?.length)" class="empty">购物车为空</view>
        <scroll-view v-else class="items" scroll-y>
          <view v-for="it in cart!.items" :key="it.id" class="cart-item">
            <text class="name">{{ it.product?.name || '商品' }}</text>
            <view class="qty-box">
              <button size="mini" class="btn" @tap.stop="decrease(it)">-</button>
              <text class="qty">{{ it.quantity }}</text>
              <button size="mini" class="btn" @tap.stop="increase(it)">+</button>
            </view>
            <text class="price">￥{{ formatPrice(it.product?.price || 0) }}</text>
            <button size="mini" class="rm-btn" @tap.stop="removeItem(it.id)">移出</button>
          </view>
        </scroll-view>
      </view>
      <view class="cart-footer">
        <text class="total">合计：￥{{ totalPrice }}</text>
        <view class="actions">
          <button size="mini" class="clear-btn" @tap="clearCart">清空</button>
          <button size="mini" class="checkout-btn" @tap.stop="checkout">结算</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Taro from '@tarojs/taro'
import { cartService, orderService } from '../../../services'
import type { Cart, CartItem } from '../../../services/cart'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'count-change', count: number): void }>()

const cart = ref<Cart | null>(null)
const loading = ref(false)

const emitClose = () => emit('close')

const load = async () => {
  loading.value = true
  const resp = await cartService.getCart()
  loading.value = false
  if (resp.code === 0 && resp.data) {
    cart.value = resp.data
    emit('count-change', (cart.value.items || []).reduce((s, i) => s + (i.quantity || 0), 0))
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
}

watch(() => props.visible, (v) => { if (v) load() })

const formatPrice = (price: number) => { try { return Number(price).toFixed(2) } catch { return String(price) } }
const totalPrice = computed(() => { const v = Number(cart.value?.total_price || 0); try { return v.toFixed(2) } catch { return String(v) } })

const updateQty = async (item: CartItem, qty: number) => {
  if (qty <= 0) {
    await removeItem(item.id)
    return
  }
  const maxStock = Number(item.product?.stock ?? Infinity)
  if (!Number.isNaN(maxStock) && qty > maxStock) {
    Taro.showToast({ title: '超过库存', icon: 'none' })
    return
  }
  const resp = await cartService.updateCartItem(item.id, { quantity: qty })
  if (resp.code === 0 && resp.data) {
    cart.value = resp.data
    emit('count-change', (cart.value.items || []).reduce((s, i) => s + (i.quantity || 0), 0))
  } else {
    Taro.showToast({ title: resp.message || '更新失败', icon: 'none' })
  }
}
const increase = (item: CartItem) => updateQty(item, item.quantity + 1)
const decrease = (item: CartItem) => updateQty(item, item.quantity - 1)

const removeItem = async (id: string) => {
  const resp = await cartService.removeFromCart(id)
  if (resp.code === 0 && resp.data) {
    cart.value = resp.data
    emit('count-change', (cart.value.items || []).reduce((s, i) => s + (i.quantity || 0), 0))
  } else {
    Taro.showToast({ title: resp.message || '操作失败', icon: 'none' })
  }
}

const clearCart = async () => {
  const resp = await cartService.clearCart()
  if (resp.code === 0 && resp.data) {
    cart.value = resp.data
    emit('count-change', 0)
    Taro.showToast({ title: '已清空', icon: 'success' })
  } else {
    Taro.showToast({ title: resp.message || '操作失败', icon: 'none' })
  }
}

const checkout = async () => {
  if (!cart.value || !(cart.value.items?.length)) {
    Taro.showToast({ title: '购物车为空', icon: 'none' })
    return
  }
  const resp = await orderService.createOrderFromCart()
  if (resp.code === 0 && resp.data) {
    emit('close')
    Taro.navigateTo({ url: `/pages/mall/order-detail/index?id=${resp.data.id}` })
  } else {
    Taro.showToast({ title: resp.message || '下单失败', icon: 'none' })
  }
}
</script>

<style lang="scss">
.cart-modal { position: fixed; left: 0; right: 0; top: 0; bottom: 0; background: rgba(0,0,0,0.45); z-index: 10000; display: flex; align-items: flex-end; padding-bottom: calc(constant(safe-area-inset-bottom) + 50px); padding-bottom: calc(env(safe-area-inset-bottom) + 50px); }
.cart-panel { background: #fff; width: 100%; max-height: 70vh; border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden; }
.cart-header { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f0f0f0; }
.close-btn { background: #f5f5f5; color: #333; padding: 4px 8px; border-radius: 4px; }
.cart-body { height: 48vh; }
.items { height: 100%; }
.cart-item { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #f5f5f5; }
.cart-item .name { flex: 1; color: #333; font-size: 14px; }
.qty-box { display: inline-flex; align-items: center; gap: 6px; }
.btn { padding: 2px 6px; }
.qty { width: 24px; text-align: center; font-size: 14px; }
.cart-item .price { width: 80px; text-align: right; color: #e64a19; font-size: 12px; }
.rm-btn { padding: 2px 6px; font-size: 12px; }
.empty { padding: 24px; text-align: center; color: #999; }
.cart-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-top: 1px solid #f0f0f0; }
.total { color: #333; font-weight: 600; }
.clear-btn { background: #ff4d4f; color: #fff; padding: 4px 8px; border-radius: 4px; }
</style>


