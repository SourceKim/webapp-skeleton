<template>
  <view class="order-confirm">
    <nut-navbar title="确认订单" left-show @on-click-back="goBack" safe-area-inset-top />

    <view class="section addr" @click="goChooseAddress">
      <view v-if="address">
        <view class="name">{{ address.name }} {{ address.phone }}</view>
        <view class="detail">{{ address.province }}{{ address.city }}{{ address.country }}{{ address.town || '' }} {{ address.detail }}</view>
      </view>
      <view v-else class="placeholder">请选择收货地址</view>
    </view>

    <nut-popup
      v-model:visible="showPopupExist"
      position="bottom"
      closeable
      round
      :style="{ height: '60%' }"
      @close="onAddressClose"
    >
      <view class="addr-popup">
        <view class="addr-header">配送至</view>
        <scroll-view :scroll-y="true" class="addr-list" v-if="addressesList.length > 0">
           <view v-for="a in addressesList" :key="a.id" class="addr-item" @click="selectAddress(a)">
              <view class="left">
                 <view class="top">
                   <text class="name">{{ a.name }}</text>
                   <text class="phone">{{ a.phone }}</text>
                   <text v-if="a.is_default" class="tag">默认</text>
                 </view>
                 <view class="detail">{{ a.province }}{{ a.city }}{{ a.country }}{{ a.town||'' }} {{ a.detail }}</view>
              </view>
              <nut-icon v-if="address && address.id === a.id" name="Check" color="#fa2c19" />
           </view>
           <!-- 底部留白 -->
           <view style="height: 60px"></view>
        </scroll-view>
        <view v-else class="addr-empty">
          <nut-empty description="暂无收货地址" />
          <nut-button type="primary" size="small" @click="goCreateAddr">添加收货地址</nut-button>
        </view>
        <view class="addr-footer" v-if="addressesList.length > 0">
           <nut-button block type="primary" @click="goCreateAddr">新增地址</nut-button>
        </view>
      </view>
    </nut-popup>

    <view class="section">
      <view v-for="it in items" :key="it.cart_id" class="row">
        <image v-if="coverOf(it)" class="cover" :src="coverOf(it)" mode="aspectFill" />
        <view class="info">
          <view class="title">{{ it.spu?.name }}</view>
          <view class="sub" v-if="it.spu?.sub_title">{{ it.spu?.sub_title }}</view>
        </view>
        <view class="attrs" v-if="Array.isArray(it.sku?.attributes)">
          <text v-for="a in it.sku.attributes" :key="(a.key_id||'')+':'+(a.value_id||'')" class="attr">{{ a.key_name || a.key_id }}：{{ a.value || a.value_id }}</text>
        </view>
        <view class="meta">
          <text class="price">￥{{ Number(it.sku?.price || 0).toFixed(2) }}</text>
          <text class="qty">x{{ it.quantity }}</text>
        </view>
      </view>
    </view>

    <view class="section total">
      <view>合计：<text class="amount">￥{{ payable.toFixed(2) }}</text></view>
    </view>

    <!-- 隐藏原有支付方式选择，改为底部弹窗 -->
    <!-- <view class="section pay"> ... </view> -->

    <view class="footer">
      <nut-button type="primary" block @click="onSubmitClick" :disabled="!address || submitting">立即付款</nut-button>
    </view>

    <!-- 支付方式选择弹窗 -->
    <nut-action-sheet
      v-model:visible="showPay"
      :menu-items="paymentOptions"
      @choose="onPayChoose"
      title="选择支付方式"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import api from '@/services/api'
import { getUploadUrl } from '@/services/mall'

const router = useRouter()
const ids = ref<string[]>([])
const items = ref<any[]>([])
const payable = ref(0)
const submitting = ref(false)
const address = ref<any | null>(null)
const addressesList = ref<any[]>([])
const showPopupExist = ref(false)
const existAddress = ref<any[]>([])
// const paymentMethod = ref<'ALIPAY' | 'WECHAT' | 'CASH'>('ALIPAY')

const showPay = ref(false)
const paymentOptions = [
  { name: '微信支付', value: 'WECHAT' },
  { name: '支付宝', value: 'ALIPAY' },
  { name: '模拟支付', value: 'CASH' }
]

function goBack() { Taro.navigateBack() }
function goChooseAddress() { showPopupExist.value = true }

// 1. 点击立即付款 -> 弹出选择
function onSubmitClick() {
  if (!address.value) { Taro.showToast({ title: '请选择地址', icon: 'none' }); return }
  showPay.value = true
}

// 2. 选择支付方式 -> 创建订单 -> 支付
async function onPayChoose(item: any) {
  if (submitting.value) return
  submitting.value = true
  try {
    // 第一步：创建订单 (Status: UNPAID)
    // 注意：创建订单时不再传递 payment_method，或者传递 null
    const { code, data: orderData, message } = await api.post('/orders', { 
      cart_item_ids: ids.value, 
      address_id: address.value.id 
    })
    
    if (code !== 0 || !orderData) {
      Taro.showToast({ title: message || '下单失败', icon: 'none' })
      return
    }

    const orderId = (orderData as any).id

    // 第二步：发起支付 (调用 pay 接口)
    const { code: payCode, message: payMsg } = await api.put(`/orders/${orderId}/pay`, { 
      payment_method: item.value 
    })

    if (payCode === 0) {
      Taro.showToast({ title: '支付成功', icon: 'success' })
      setTimeout(() => Taro.redirectTo({ url: '/pages/mall/order-list/index' }), 600)
    } else {
      // 支付失败，但也跳转到订单列表（状态为待付款）
      Taro.showToast({ title: payMsg || '支付失败', icon: 'none' })
      setTimeout(() => Taro.redirectTo({ url: '/pages/mall/order-list/index' }), 600)
    }

  } catch (e) {
    Taro.showToast({ title: '系统异常', icon: 'none' })
  } finally {
    submitting.value = false
    showPay.value = false
  }
}

async function loadPreview() {
  const { code, data: respData, message } = await api.post('/orders/preview', { cart_item_ids: ids.value })
  if (code === 0 && respData) {
    items.value = (respData as any).items || []
    payable.value = Number((respData as any).payable_amount || 0)
  } else {
    Taro.showToast({ title: message || '预览失败', icon: 'none' })
  }
}

async function loadDefaultAddress() {
  const { code, data: addrData } = await api.get('/addresses')
  if (code === 0 && addrData && Array.isArray(addrData)) {
    addressesList.value = addrData
    address.value = addrData.find((a: any) => a.is_default) || addrData[0] || null
    existAddress.value = addrData.map((a: any) => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      provinceName: a.province,
      cityName: a.city,
      countyName: a.country,
      townName: a.town || '',
      addressDetail: a.detail,
      selectedAddress: !!a.is_default
    }))
  }
}

onMounted(() => {
  const p = (router?.params?.ids as string) || ''
  ids.value = p ? p.split(',').filter(Boolean) : []
  loadPreview()
})

useDidShow(() => {
  loadDefaultAddress()
})

function goCreateAddr() {
  Taro.navigateTo({ url: '/pages/address/form/index' })
}

function selectAddress(item: any) {
  address.value = item
  showPopupExist.value = false
}

function onAddressClose(_: any) {
  // 关闭时不做额外处理
}

function onAddressSelected(_: any, now: any) {
  const id = now?.id
  if (!id) { showPopupExist.value = false; return }
  const found = addressesList.value.find((a: any) => a.id === id)
  if (found) address.value = found
  // 同步默认选中态
  existAddress.value = existAddress.value.map((e: any) => ({ ...e, selectedAddress: e.id === id }))
  showPopupExist.value = false
}

function coverOf(it: any): string | undefined {
  return getUploadUrl(it?.spu?.main_material.file_path)
}
</script>

<style lang="scss">
.order-confirm { padding-bottom: 72px; }
.section { background: #fff; padding: 12px; margin-top: 8px; }
.addr .name { font-weight: 600; }
.addr .detail { margin-top: 4px; color: #666; font-size: 12px; }
.addr .placeholder { color: #999; }
.row { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
.row:last-child { border-bottom: none }
.title { font-weight: 600; }
.sub { color: #888; font-size: 12px; margin-top: 2px; }
.attrs { margin-top: 4px; display: flex; gap: 6px; flex-wrap: wrap; }
.attr { background: #f6f6f6; padding: 2px 6px; border-radius: 3px; color: #666; font-size: 12px }
.meta { display: flex; justify-content: space-between; margin-top: 6px; }
.price { color: #fa2c19; font-weight: 600; }
.total .amount { color: #fa2c19; font-weight: 700; }
.footer { position: fixed; left: 0; right: 0; bottom: 0; background: #fff; padding: 10px 12px env(safe-area-inset-bottom); box-shadow: 0 -2px 8px rgba(0,0,0,0.06); }

.addr-popup { display: flex; flex-direction: column; height: 100%; position: relative; }
.addr-header { text-align: center; padding: 16px; font-weight: 600; font-size: 16px; border-bottom: 1px solid #eee; }
.addr-list { flex: 1; overflow: hidden; background: #f5f5f5; height: 100%; }
.addr-item { background: #fff; padding: 12px; margin-bottom: 1px; display: flex; align-items: center; justify-content: space-between; }
.addr-item .left { flex: 1; margin-right: 12px; }
.addr-item .top { display: flex; align-items: center; margin-bottom: 4px; }
.addr-item .name { font-weight: 600; font-size: 15px; margin-right: 8px; }
.addr-item .phone { color: #666; font-size: 14px; margin-right: 8px; }
.addr-item .tag { background: #fa2c19; color: #fff; font-size: 10px; padding: 1px 4px; border-radius: 2px; }
.addr-item .detail { color: #333; font-size: 13px; line-height: 1.4; }
.addr-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; }
.addr-footer { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px; background: #fff; box-shadow: 0 -2px 8px rgba(0,0,0,0.05); }
</style>


