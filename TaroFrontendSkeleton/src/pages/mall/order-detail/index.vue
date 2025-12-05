<template>
  <view class="order-detail">
    <nut-navbar title="订单详情" left-show @on-click-back="goBack" safe-area-inset-top />
    
    <!-- 状态栏 -->
    <view class="status-bar">
      <view class="status-text">{{ getStatusText(order?.order_status) }}</view>
      <view class="status-desc">感谢您对我们的信任，期待再次光临</view>
    </view>

    <!-- 地址信息 -->
    <view class="card address-card">
      <view class="icon-box">
        <nut-icon name="location" size="20" color="#333" />
      </view>
      <view class="address-info">
        <view class="user-row">
          <text class="name">{{ order?.address_snapshot?.name }}</text>
          <text class="phone">{{ order?.address_snapshot?.phone }}</text>
        </view>
        <view class="address-text">{{ fullAddr }}</view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="card goods-card">
      <view class="card-title">商品信息</view>
      <view class="goods-list">
        <view class="goods-item" v-for="it in items" :key="it.id">
          <image v-if="coverOf(it)" class="goods-img" :src="coverOf(it)" mode="aspectFill" />
          <view class="goods-content">
            <view class="goods-main">
              <view class="goods-name">{{ it?.sku_snapshot?.spu?.name || '商品' }}</view>
              <view class="goods-price">
                <text class="symbol">￥</text>
                <text class="num">{{ Number(it.unit_price||0).toFixed(2) }}</text>
              </view>
            </view>
            
            <view class="goods-sub">
              <view class="goods-specs" v-if="getSpecs(it)">
                <text>{{ getSpecs(it) }}</text>
              </view>
              <view class="goods-qty">x{{ it.quantity }}</view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="price-summary">
        <view class="summary-row">
          <text>商品总价</text>
          <text>￥{{ Number(order?.total_amount || 0).toFixed(2) }}</text>
        </view>
        <view class="summary-row">
          <text>运费</text>
          <text>+ ￥{{ Number(order?.shipping_amount || 0).toFixed(2) }}</text>
        </view>
        <view class="summary-row">
          <text>优惠</text>
          <text>- ￥{{ Number(order?.discount_amount || 0).toFixed(2) }}</text>
        </view>
        <view class="total-row">
          <text>实付款</text>
          <text class="total-price">￥{{ Number(order?.payable_amount || 0).toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="card info-card">
      <view class="info-row">
        <text class="label">订单编号</text>
        <text class="value">{{ order?.id }}</text>
      </view>
      <view class="info-row">
        <text class="label">下单时间</text>
        <text class="value">{{ order?.created_at }}</text>
      </view>
      <view class="info-row" v-if="order?.payment_method">
        <text class="label">支付方式</text>
        <text class="value">{{ order?.payment_method || '-' }}</text>
      </view>
      <view class="info-row" v-if="order?.remark">
        <text class="label">订单备注</text>
        <text class="value">{{ order?.remark }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer-action" v-if="['UNPAID', 'PENDING', 'SHIPPED'].includes(order?.order_status)">
      <nut-button v-if="['UNPAID', 'PENDING'].includes(order?.order_status)" type="default" size="small" plain @click="onCancel">取消订单</nut-button>
      <nut-button v-if="['UNPAID', 'PENDING'].includes(order?.order_status)" type="primary" size="small" @click="showPay = true">去支付</nut-button>
      <nut-button v-if="order?.order_status === 'SHIPPED'" type="primary" size="small" @click="onReceive">确认收货</nut-button>
    </view>

    <!-- 支付方式弹窗 -->
    <nut-action-sheet
      v-model:visible="showPay"
      :menu-items="paymentOptions"
      @choose="onPay"
      title="选择支付方式"
    />

    <!-- 底部占位 -->
    <view class="footer-placeholder"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import api from '@/services/api'
import { getUploadUrl } from '@/services/mall'

const order = ref<any | null>(null)
const items = ref<any[]>([])
const showPay = ref(false)

const paymentOptions = [
  { name: '微信支付', value: 'WECHAT' },
  { name: '支付宝', value: 'ALIPAY' },
  { name: '模拟支付', value: 'CASH' } // 对应后端的 PaymentMethod 枚举
]

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

const fullAddr = computed(() => {
  const a = order.value?.address_snapshot || {}
  return `${a.province || ''}${a.city || ''}${a.country || ''}${a.town || ''} ${a.detail || ''}`.trim()
})

function goBack(){ Taro.navigateBack() }

function getSpecs(it: any) {
  const attrs = it?.sku_snapshot?.attributes || []
  if (!Array.isArray(attrs) || attrs.length === 0) return ''
  return attrs.map((a: any) => a.value || a.value_id).join('; ')
}

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
  return getUploadUrl(it?.sku_snapshot?.spu?.main_material?.file_path)
}

async function onCancel() {
  const res = await Taro.showModal({ title: '提示', content: '确定要取消订单吗？' })
  if (res.confirm) {
    const { code, message } = await api.put(`/orders/${order.value.id}/cancel`)
    if (code === 0) {
      Taro.showToast({ title: '已取消', icon: 'success' })
      load(order.value.id)
    } else {
      Taro.showToast({ title: message || '取消失败', icon: 'none' })
    }
  }
}

async function onPay(item: any) {
  try {
    const { code, message } = await api.put(`/orders/${order.value.id}/pay`, { payment_method: item.value })
    if (code === 0) {
      Taro.showToast({ title: '支付成功', icon: 'success' })
      showPay.value = false
      load(order.value.id)
    } else {
      Taro.showToast({ title: message || '支付失败', icon: 'none' })
    }
  } catch (e) {
    Taro.showToast({ title: '支付异常', icon: 'none' })
  }
}

async function onReceive() {
  const res = await Taro.showModal({ title: '提示', content: '确认已收到货物？' })
  if (res.confirm) {
    try {
      const { code, message } = await api.put(`/orders/${order.value.id}/receive`)
      if (code === 0) {
        Taro.showToast({ title: '已确认收货', icon: 'success' })
        load(order.value.id)
      } else {
        Taro.showToast({ title: message || '操作失败', icon: 'none' })
      }
    } catch (e) {
      Taro.showToast({ title: '操作异常', icon: 'none' })
    }
  }
}

async function load(id: string) {
  const resp = await api.get(`/orders/${id}`)
  if (resp.code === 0 && resp.data) {
    order.value = (resp.data as any).order
    items.value = (resp.data as any).items || []
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
}

useLoad(async (options) => {
  const id = String(options?.id || '')
  if (!id) { Taro.showToast({ title: '参数错误', icon: 'none' }); Taro.navigateBack(); return }
  load(id)
})
</script>

<style lang="scss">
.order-detail {
  min-height: 100vh;
  background: $style-color-bg;
  padding-bottom: calc(env(safe-area-inset-bottom) + 60px); // 增加底部 padding 防止遮挡
}

.footer-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $style-color-white;
  padding: 10px $style-spacing-sm;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 99;
}

.status-bar {
  background: linear-gradient(135deg, #fa2c19 0%, #fa6419 100%);
  color: $style-color-white;
  padding: 20px $style-spacing-sm;
  
  .status-text {
    font-size: $style-h1-text-size;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .status-desc {
    font-size: $style-text-size-sm;
    opacity: 0.9;
  }
}

.card {
  background: $style-color-white;
  border-radius: $style-border-radius-base;
  margin: 12px;
  padding: $style-spacing-sm;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.address-card {
  display: flex;
  align-items: flex-start;
  margin-top: -20px; // 向上浮动
  position: relative;
  z-index: 1;
  
  .icon-box {
    margin-top: 2px;
    margin-right: 12px;
  }
  
  .address-info {
    flex: 1;
  }
  
  .user-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 6px;
    
    .name {
      font-size: $style-text-size-lg;
      font-weight: 600;
      color: $style-text-color-primary;
      margin-right: 8px;
    }
    
    .phone {
      font-size: $style-text-size-base;
      color: $style-text-color-regular;
    }
  }
  
  .address-text {
    font-size: $style-text-size-base;
    color: $style-text-color-regular;
    line-height: 1.5;
  }
}

.card-title {
  font-size: $style-text-size-lg;
  font-weight: 600;
  color: $style-text-color-primary;
  margin-bottom: 12px;
}

.goods-list {
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.goods-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .goods-img {
    width: 72px;
    height: 72px;
    border-radius: 6px;
    background: #f5f5f5;
    flex-shrink: 0;
  }
  
  .goods-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
  }
  
  .goods-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .goods-name {
      flex: 1;
      font-size: $style-text-size-base;
      color: $style-text-color-primary;
      line-height: 1.4;
      margin-right: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .goods-price {
      font-weight: 600;
      color: $style-text-color-primary;
      font-size: $style-text-size-sm;
      
      .symbol { font-size: $style-text-size-xs; }
    }
  }
  
  .goods-sub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    
    .goods-specs {
      background: #f9f9f9;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: $style-text-size-xs;
      color: $style-text-color-secondary;
    }
    
    .goods-qty {
      font-size: $style-text-size-sm;
      color: $style-text-color-secondary;
    }
  }
}

.price-summary {
  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: $style-text-size-sm;
    color: $style-text-color-regular;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .total-row {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;
    font-size: $style-text-size-base;
    color: $style-text-color-primary;
    
    .total-price {
      font-size: $style-text-size-lg;
      font-weight: 600;
      color: $style-text-color-price;
      margin-left: 6px;
    }
  }
}

.info-card {
  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: $style-text-size-sm;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      color: $style-text-color-regular;
    }
    
    .value {
      color: $style-text-color-primary;
      flex: 1;
      text-align: right;
      margin-left: 20px;
      word-break: break-all;
    }
  }
}

.footer-placeholder {
  height: 20px;
}
</style>
