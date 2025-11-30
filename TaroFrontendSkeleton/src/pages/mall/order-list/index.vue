<template>
  <view class="order-list">
    <nut-navbar title="我的订单" left-show @on-click-back="goBack" safe-area-inset-top />
    <view class="list">
      <view v-for="o in items" :key="o.id" class="card" @click="goDetail(o.id)">
        <view class="header">
          <text class="sn">订单号：{{ o.id }}</text>
          <text class="status">{{ getStatusText(o.order_status) }}</text>
        </view>
        
        <view class="body">
          <view class="goods-group">
            <image 
              v-if="getCover(o)" 
              class="goods-img" 
              :src="getCover(o)" 
              mode="aspectFill" 
            />
            <view class="goods-info">
              <view class="goods-name">{{ getGoodsName(o) }}</view>
              <view class="goods-desc">{{ getGoodsDesc(o) }}</view>
            </view>
          </view>
        </view>

        <view class="footer">
          <text class="time">{{ o.created_at }}</text>
          <view class="right-side">
            <view class="total">
              共 {{ getCount(o) }} 件，合计：<text class="price">￥{{ Number(o.payable_amount||0).toFixed(2) }}</text>
            </view>
            <view class="btns" v-if="o.order_status === 'SHIPPED'">
               <nut-button type="primary" size="mini" @click.stop="onReceive(o)">确认收货</nut-button>
            </view>
          </view>
        </view>
      </view>
      <view v-if="!loading && items.length===0" class="empty">暂无订单</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import api from '@/services/api'
import { getUploadUrl } from '@/services/mall'

const items = ref<any[]>([])
const loading = ref(false)

const statusMap: Record<string, string> = {
  'UNPAID': '待付款',
  'PENDING': '待付款',
  'TO_BE_SHIPPED': '待发货',
  'CONFIRMED': '待发货',
  'SHIPPED': '待收货',
  'DELIVERED': '待收货',
  'COMPLETED': '已完成',
  'CANCELED': '已取消'
}

function getStatusText(status: string) {
  return statusMap[status] || status
}

function goBack(){ Taro.navigateBack() }
function goDetail(id: string){ Taro.navigateTo({ url: `/pages/mall/order-detail/index?id=${id}` }) }

function getCover(o: any) {
  const first = o.items?.[0]
  const path = first?.sku_snapshot?.spu?.main_material?.file_path
  return getUploadUrl(path)
}

function getGoodsName(o: any) {
  const first = o.items?.[0]
  return first?.sku_snapshot?.spu?.name || '商品'
}

function getGoodsDesc(o: any) {
  const first = o.items?.[0]
  // 显示规格信息
  const attrs = first?.sku_snapshot?.attributes || []
  return attrs.map((a: any) => a.value || a.value_id).join(' ')
}

function getCount(o: any) {
  return (o.items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0)
}

async function load(){
  loading.value = true
  try {
    const { code, data } = await api.get('/orders')
    if (code === 0 && Array.isArray(data)) items.value = data
  } finally { loading.value = false }
}

async function onReceive(o: any) {
  const res = await Taro.showModal({ title: '提示', content: '确认已收到货物？' })
  if (res.confirm) {
    try {
      const { code, message } = await api.put(`/orders/${o.id}/receive`)
      if (code === 0) {
        Taro.showToast({ title: '已确认收货', icon: 'success' })
        load()
      } else {
        Taro.showToast({ title: message || '操作失败', icon: 'none' })
      }
    } catch (e) {
      Taro.showToast({ title: '操作异常', icon: 'none' })
    }
  }
}

onMounted(load)
</script>

<style lang="scss">
.list { padding: 12px; padding-bottom: env(safe-area-inset-bottom); }
.card { background: $style-color-white; border-radius: $style-border-radius-base; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04) }

.header { display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid $style-color-bg; margin-bottom: 12px; font-size: $style-text-size-sm; }
.sn { color: $style-text-color-regular; }
.status { color: $style-text-color-price; font-weight: 600; }

.body { display: flex; flex-direction: column; gap: 10px; }
.goods-group { display: flex; gap: 10px; }
.goods-img { width: 70px; height: 70px; border-radius: 4px; background: $style-color-bg; flex-shrink: 0; }
.goods-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 2px 0; }
.goods-name { font-size: $style-text-size-base; color: $style-text-color-primary; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.goods-desc { font-size: $style-text-size-sm; color: $style-text-color-secondary; }

.footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid $style-color-bg; }
.time { color: $style-text-color-secondary; font-size: $style-text-size-sm; }
.right-side { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.total { font-size: $style-text-size-sm; color: $style-text-color-primary; display: flex; align-items: baseline; }
.price { color: $style-text-color-primary; font-size: $style-text-size-lg; font-weight: 600; margin-left: 4px; }
.btns { display: flex; gap: 8px; }

.empty { text-align: center; color: $style-text-color-secondary; padding: 24px 0 }
</style>








