<template>
  <view class="order-detail">
    <nut-navbar title="订单详情" left-show @on-click-back="goBack" safe-area-inset-top />
    <view class="section">
      <view class="row"><text>订单号</text><text class="val">{{ order?.id }}</text></view>
      <view class="row"><text>状态</text><text class="val">{{ order?.order_status }}</text></view>
      <view class="row"><text>金额</text><text class="val">￥{{ Number(order?.payable_amount||0).toFixed(2) }}</text></view>
      <view class="row"><text>支付方式</text><text class="val">{{ order?.payment_method || '-' }}</text></view>
      <view class="row"><text>收货人</text><text class="val">{{ order?.address_snapshot?.name }} {{ order?.address_snapshot?.phone }}</text></view>
      <view class="row"><text>地址</text><text class="val">{{ fullAddr }}</text></view>
    </view>
    <view class="section">
      <view class="title">商品列表</view>
      <view class="item" v-for="it in items" :key="it.id">
        <image v-if="coverOf(it)" class="cover" :src="coverOf(it)" mode="aspectFill" />
        <view class="info">
          <view class="name">{{ it?.sku_snapshot?.spu?.name || '商品' }}</view>
          <view class="sub" v-if="it?.sku_snapshot?.spu?.sub_title">{{ it?.sku_snapshot?.spu?.sub_title }}</view>
        </view>
        <view class="attrs" v-if="Array.isArray(it?.sku_snapshot?.attributes)">
          <text v-for="a in it.sku_snapshot.attributes" :key="(a.key_id||'')+':'+(a.value_id||'')" class="attr">{{ a.key_name || a.key_id }}：{{ a.value || a.value_id }}</text>
        </view>
        <view class="meta"><text>￥{{ Number(it.unit_price||0).toFixed(2) }}</text><text>x{{ it.quantity }}</text></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import api from '@/services/api'
import { getUploadUrl } from '@/services/mall'

const order = ref<any | null>(null)
const items = ref<any[]>([])
const fullAddr = computed(() => {
  const a = order.value?.address_snapshot || {}
  return `${a.province || ''}${a.city || ''}${a.country || ''}${a.town || ''} ${a.detail || ''}`.trim()
})

function goBack(){ Taro.navigateBack() }

useLoad(async (options) => {
  const id = String(options?.id || '')
  if (!id) { Taro.showToast({ title: '参数错误', icon: 'none' }); Taro.navigateBack(); return }
  const resp = await api.get(`/orders/${id}`)
  if (resp.code === 0 && resp.data) {
    order.value = (resp.data as any).order
    items.value = (resp.data as any).items || []
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
})

function coverOf(it: any): string | undefined {
  return getUploadUrl(it?.sku_snapshot?.spu?.main_material.file_path)
}
</script>

<style lang="scss">
.section { background: #fff; padding: 12px; margin-top: 8px; }
.row { display: flex; justify-content: space-between; padding: 6px 0 }
.val { font-weight: 600 }
.title { font-weight: 600; margin-bottom: 8px }
.item { padding: 8px 0; border-bottom: 1px solid #f5f5f5; display: flex; gap: 10px; align-items: flex-start }
.cover { width: 56px; height: 56px; border-radius: 6px; background: #f6f6f6 }
.info { flex: 1; display: flex; flex-direction: column }
.item:last-child { border-bottom: none }
.name { font-weight: 600 }
.sub { color: #888; font-size: 12px; margin-top: 2px }
.attrs { margin-top: 4px; display: flex; gap: 6px; flex-wrap: wrap }
.attr { background: #f6f6f6; padding: 2px 6px; border-radius: 3px; color: #666; font-size: 12px }
.meta { display: flex; justify-content: space-between; margin-top: 6px }
</style>


