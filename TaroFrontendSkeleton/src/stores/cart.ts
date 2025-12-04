import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import Taro from '@tarojs/taro'

export const useCartStore = defineStore('cart', () => {
  const items = ref<any[]>([])
  const loading = ref(false)

  const totalCount = computed(() => items.value.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0))
  const totalPrice = computed(() => items.value.reduce((sum, it) => sum + Number(it.sku?.price || 0) * (Number(it.quantity) || 0), 0))

  async function fetchCart() {
    loading.value = true
    try {
      const { code, data } = await api.get('/cart')
      if (code === 0 && data) {
        items.value = data as any[]
      }
    } finally {
      loading.value = false
    }
  }

  // 获取某 SPU 在购物车中的总数量
  function getSpuQty(spuId: string) {
    return items.value
      .filter(it => it.spu_id === spuId || it.spu?.id === spuId)
      .reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
  }

  // 获取某 SPU 对应的购物车项（如果只有一个）
  function getCartItemBySpu(spuId: string) {
    const matches = items.value.filter(it => it.spu_id === spuId || it.spu?.id === spuId)
    if (matches.length === 1) return matches[0]
    return null // 0 个或多个（多规格）
  }

  async function addToCart(skuId: string, quantity: number) {
    const { code, message } = await api.post('/cart', { sku_id: skuId, quantity })
    if (code === 0) {
      Taro.showToast({ title: '已加入购物车', icon: 'success' })
      await fetchCart()
      return true
    } else {
      Taro.showToast({ title: message || '加入失败', icon: 'none' })
      return false
    }
  }

  async function updateQty(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return removeItem(cartItemId)
    }
    const { code, data } = await api.put(`/cart/${cartItemId}`, { quantity })
    if (code === 0 && data) {
      // 更新本地状态，避免整个重刷闪烁
      const it = items.value.find(i => i.id === cartItemId)
      if (it) it.quantity = (data as any).quantity
      return true
    }
    return false
  }

  async function removeItem(cartItemId: string) {
    const { code } = await api.delete(`/cart/${cartItemId}`)
    if (code === 0) {
      items.value = items.value.filter(i => i.id !== cartItemId)
      return true
    }
    return false
  }

  return {
    items,
    loading,
    totalCount,
    totalPrice,
    fetchCart,
    getSpuQty,
    getCartItemBySpu,
    addToCart,
    updateQty,
    removeItem
  }
})



