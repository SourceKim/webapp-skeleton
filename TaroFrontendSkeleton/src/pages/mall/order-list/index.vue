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
          <!-- 遍历显示所有商品 -->
          <view v-for="it in (o.items || [])" :key="it.id" class="goods-group">
            <image 
              class="goods-img" 
              :src="getItemCover(it)" 
              mode="aspectFill" 
            />
            <view class="goods-info">
              <view class="info-top">
                <view class="goods-name">{{ it?.sku_snapshot?.spu?.name || '商品' }}</view>
                <view class="goods-price">￥{{ Number(it.unit_price||0).toFixed(2) }}</view>
              </view>
              <view class="info-bottom">
                <view class="goods-desc">{{ getItemDesc(it) }}</view>
                <view class="goods-qty">x{{ it.quantity }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="footer">
          <view class="row-time">
            <text class="time">{{ formatDate(o.created_at) }}</text>
          </view>
          <view class="row-actions">
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

function getItemCover(it: any) {
  const path = it?.sku_snapshot?.spu?.main_material?.file_path
  return getUploadUrl(path)
}

function getItemDesc(it: any) {
  const attrs = it?.sku_snapshot?.attributes || []
  return attrs.map((a: any) => a.value || a.value_id).join(' ')
}

function getCount(o: any) {
  return (o.items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0)
}

function formatDate(str: string) {
  if (!str) return ''
  const date = new Date(str)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  const h = date.getHours().toString().padStart(2, '0')
  const min = date.getMinutes().toString().padStart(2, '0')
  const s = date.getSeconds().toString().padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
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
.list { padding: $style-spacing-sm; padding-bottom: env(safe-area-inset-bottom); }
.card { background: $style-color-white; border-radius: $style-border-radius-base; padding: $style-spacing-sm; margin-bottom: $style-spacing-sm; box-shadow: 0 2px 8px rgba(0,0,0,0.04) }

.header { display: flex; justify-content: space-between; padding-bottom: $style-spacing-sm; border-bottom: 1px solid $style-border-color; margin-bottom: $style-spacing-sm; font-size: $style-text-size-sm; }
.sn { color: $style-text-color-regular; }
.status { color: $style-text-color-price; font-weight: 600; }

.body { display: flex; flex-direction: column; gap: $style-spacing-sm; } /* 增加商品间距 */
.goods-group { display: flex; gap: $style-spacing-xs; }
.goods-img { width: 70px; height: 70px; border-radius: $style-border-radius-sm; background: $style-color-bg; flex-shrink: 0; }

.goods-info { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  padding: 2px 0; 
}

.info-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.info-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 4px;
}

.goods-name { 
  font-size: $style-text-size-base; 
  color: $style-text-color-primary; 
  line-height: 1.4; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  flex: 1;
  margin-right: 8px;
}

.goods-price {
  font-size: $style-text-size-base;
  color: $style-text-color-primary;
  font-weight: 600;
}

.goods-desc { 
  font-size: $style-text-size-sm; 
  color: $style-text-color-secondary; 
  flex: 1;
  margin-right: 8px;
}

.goods-qty {
  font-size: $style-text-size-sm;
  color: $style-text-color-secondary;
}

.footer { 
  display: flex; 
  flex-direction: column; 
  gap: $style-spacing-sm; 
  margin-top: $style-spacing-sm; 
  padding-top: $style-spacing-sm; 
  border-top: 1px solid $style-border-color; 
}

.row-time {
  width: 100%;
  display: flex;
}

.time { 
  color: $style-text-color-secondary; 
  font-size: $style-text-size-sm; 
}

.row-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: $style-spacing-sm;
}

.total { font-size: $style-text-size-sm; color: $style-text-color-primary; display: flex; align-items: baseline; }
.price { color: $style-text-color-price; font-size: $style-text-size-lg; font-weight: 600; margin-left: 4px; }
.btns { display: flex; gap: $style-spacing-xs; }

.empty { text-align: center; color: $style-text-color-secondary; padding: $style-spacing-base 0 }
</style>
