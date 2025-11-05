<template>
  <view class="order-list">
    <nut-navbar title="我的订单" left-show @on-click-back="goBack" safe-area-inset-top />
    <view class="list">
      <view v-for="o in items" :key="o.id" class="card" @click="goDetail(o.id)">
        <view class="row"><text>订单号</text><text class="val">{{ o.id }}</text></view>
        <view class="row"><text>金额</text><text class="val">￥{{ Number(o.payable_amount||0).toFixed(2) }}</text></view>
        <view class="row"><text>状态</text><text class="val">{{ o.order_status }}</text></view>
        <view class="time">{{ o.created_at }}</view>
      </view>
      <view v-if="!loading && items.length===0" class="empty">暂无订单</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import api from '@/services/api'

const items = ref<any[]>([])
const loading = ref(false)

function goBack(){ Taro.navigateBack() }
function goDetail(id: string){ Taro.navigateTo({ url: `/pages/mall/order-detail/index?id=${id}` }) }

async function load(){
  loading.value = true
  try {
    const { code, data } = await api.get('/orders')
    if (code === 0 && Array.isArray(data)) items.value = data
  } finally { loading.value = false }
}

onMounted(load)
</script>

<style lang="scss">
.list { padding: 12px }
.card { background: #fff; border-radius: 8px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04) }
.row { display: flex; justify-content: space-between; padding: 4px 0 }
.val { font-weight: 600 }
.time { color: #999; font-size: 12px; margin-top: 6px }
.empty { text-align: center; color: #999; padding: 24px 0 }
</style>




