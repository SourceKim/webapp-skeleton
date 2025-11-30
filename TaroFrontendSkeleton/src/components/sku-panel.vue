<template>
  <nut-popup
    v-model:visible="model"
    position="bottom"
    round
    :safe-area-inset-bottom="true"
    class="sku-popup"
    @closed="onPopupClosed"
  >
    <view class="sku-container">
      <!-- 头部信息 -->
      <view class="sku-header">
        <image class="goods-img" :src="goods.imagePath" mode="aspectFill" @tap="previewImage" />
        <view class="goods-info">
          <view class="price-box">
            <text class="symbol">¥</text>
            <text class="price">{{ displayPrice }}</text>
          </view>
          <view class="stock">库存 {{ displayStock }} 件</view>
          <view class="selected-tip">
            <text v-if="!isSkuSelected">请选择 {{ missingKeys.join(' ') }}</text>
            <text v-else>已选 {{ selectedText }}</text>
          </view>
        </view>
        <view class="close-btn" @tap="onClose">
          <nut-icon name="close" size="18" color="#999" />
        </view>
      </view>

      <!-- 规格列表 -->
      <scroll-view class="sku-body" scroll-y>
        <view class="sku-group" v-for="(group, gIndex) in localSku" :key="group.id">
          <view class="group-name">{{ group.name }}</view>
          <view class="group-values">
            <view
              v-for="val in group.list"
              :key="val.id"
              class="sku-tag"
              :class="{ active: val.active, disabled: val.disable }"
              @tap="onSelectAttr(gIndex, val)"
            >
              {{ val.name }}
            </view>
          </view>
        </view>

        <!-- 数量选择 -->
        <view class="count-row">
          <view class="count-label">购买数量</view>
          <QuantityStepper
            v-model="buyNum"
            :min="1"
            :max="maxBuyNum"
          />
        </view>
      </scroll-view>

      <!-- 底部按钮 -->
      <view class="sku-actions">
        <view v-if="btnOptions.includes('cart')" class="action-btn cart-btn" @tap="handleAction('cart')">
          加入购物车
        </view>
        <view v-if="btnOptions.includes('buy')" class="action-btn buy-btn" @tap="handleAction('buy')">
          立即购买
        </view>
      </view>
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch, toRaw } from 'vue'
import Taro from '@tarojs/taro'
import QuantityStepper from './QuantityStepper/index.vue'

interface GoodsData { 
  imagePath?: string; 
  price?: number | string; 
  stockNum?: number; 
  name?: string;
  subTitle?: string;
  [k: string]: any 
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  sku: any[]      // 规格树 [{id, name, list: [{id, name, active}]}]
  skuList: any[]  // SKU 列表 [{id, price, stock, skuId: 'k:v;k:v'}]
  goods: GoodsData
  loading?: boolean
  btnOptions?: Array<'buy' | 'cart'>
}>(), {
  loading: false,
  btnOptions: () => ['buy', 'cart']
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'close'): void
  (e: 'add-cart', payload: any): void
  (e: 'buy-click', payload: any): void
  (e: 'select-sku', payload: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const localSku = ref<any[]>([])
const buyNum = ref(1)

// 初始化本地规格状态
watch(() => props.sku, (newVal) => {
  if (!newVal) {
    localSku.value = []
    return
  }
  // 深拷贝一份用于本地状态维护
  try {
    localSku.value = JSON.parse(JSON.stringify(newVal))
  } catch {
    localSku.value = []
  }
}, { immediate: true, deep: true })

// 重置数量
watch(() => props.modelValue, (val) => {
  if (val) {
    if (buyNum.value < 1) buyNum.value = 1
  }
})

// --- 计算属性 ---

// 当前选中的规格组合 { keyId: valueId }
const selectedMap = computed(() => {
  const map: Record<string, string> = {}
  localSku.value.forEach(group => {
    const activeItem = group.list?.find((i: any) => i.active)
    if (activeItem) {
      map[group.id] = String(activeItem.id)
    }
  })
  return map
})

// 缺少的规格名
const missingKeys = computed(() => {
  const missing: string[] = []
  localSku.value.forEach(group => {
    const activeItem = group.list?.find((i: any) => i.active)
    if (!activeItem) missing.push(group.name)
  })
  return missing
})

// 是否已选择全部规格
const isSkuSelected = computed(() => missingKeys.value.length === 0)

// 匹配到的 SKU 对象
const matchedSku = computed(() => {
  if (!isSkuSelected.value) return null
  // 构建 key 序列，顺序需与 skuList 生成时一致
  // 假设 skuList 生成时是按 skuTree 的 group id 顺序拼接的
  const pairs: string[] = []
  localSku.value.forEach(group => {
    const valId = selectedMap.value[group.id]
    if (valId) pairs.push(`${group.id}:${valId}`)
  })
  const key = pairs.join(';')
  return props.skuList.find((s: any) => s.skuId === key) || null
})

// 显示价格
const displayPrice = computed(() => {
  if (matchedSku.value) {
    return Number(matchedSku.value.price || 0).toFixed(2)
  }
  // 未选全时，显示价格区间或 SPU 价格
  // 1. 尝试计算区间
  if (props.skuList && props.skuList.length > 0) {
    const prices = props.skuList.map(s => Number(s.price || 0))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return min.toFixed(2)
    if (max > min) return `${min.toFixed(2)} - ${max.toFixed(2)}`
  }
  // 2. 回退到 goods.price
  const p = Number(props.goods.price || 0)
  return p > 0 ? p.toFixed(2) : '0.00'
})

// 显示库存
const displayStock = computed(() => {
  if (matchedSku.value) return matchedSku.value.stock
  return props.goods.stockNum || 0
})

// 最大购买数
const maxBuyNum = computed(() => {
  if (matchedSku.value) return matchedSku.value.stock || 0
  return props.goods.stockNum || 999
})

// 已选文案
const selectedText = computed(() => {
  const arr: string[] = []
  localSku.value.forEach(group => {
    const activeItem = group.list?.find((i: any) => i.active)
    if (activeItem) arr.push(activeItem.name)
  })
  return arr.join('，') + `，${buyNum.value}件`
})


// --- 方法 ---

function onSelectAttr(groupIndex: number, val: any) {
  if (val.disable) return
  
  const group = localSku.value[groupIndex]
  if (!group) return

  // 切换选中状态
  // 如果已选中且允许反选（通常规格必选一个，这里为了体验允许反选为空）
  // 但通常 NutUI 逻辑是点击已选中则取消，点击未选中则选中
  const isSame = val.active
  
  // 先清除该组所有选中
  group.list.forEach((v: any) => v.active = false)
  
  // 如果刚才没选中，则选中当前
  if (!isSame) {
    val.active = true
  }

  // TODO: 这里可以加入 SKU 可选性判断（disable 逻辑），暂时略过，假定所有组合有效或依靠 skuList 验证
  
  emit('select-sku', { sku: val, parentIndex: groupIndex })
}

function handleAction(type: 'cart' | 'buy') {
  if (!isSkuSelected.value) {
    Taro.showToast({ title: `请选择 ${missingKeys.value[0]}`, icon: 'none' })
    return
  }
  
  const sku = matchedSku.value
  if (!sku) {
    Taro.showToast({ title: '该规格暂时缺货', icon: 'none' })
    return
  }

  if (buyNum.value > sku.stock) {
    Taro.showToast({ title: '库存不足', icon: 'none' })
    return
  }

  const payload = {
    skuId: sku.id,
    buyNum: buyNum.value,
    sku: { id: sku.id, price: sku.price, stock: sku.stock },
    ...toRaw(props.goods) // 携带商品信息方便上层使用
  }

  if (type === 'cart') emit('add-cart', payload)
  else emit('buy-click', payload)
}

function onClose() {
  model.value = false
}

function onPopupClosed() {
  emit('close')
}

function previewImage() {
  if (props.goods.imagePath) {
    Taro.previewImage({ urls: [props.goods.imagePath] })
  }
}
</script>

<style lang="scss">
.sku-popup {
  // 确保弹窗层级
  z-index: 2000;
}

.sku-container {
  display: flex;
  flex-direction: column;
  height: 70vh; // 增加高度，避免太挤
  background: $style-color-white;
  position: relative;
}

.sku-header {
  display: flex;
  padding: $style-spacing-sm;
  padding-right: 40px; // 留出关闭按钮位置
  position: relative;
  
  .goods-img {
    width: 180px; // 90px * 2
    height: 180px;
    border-radius: $style-border-radius-base;
    background: $style-color-bg;
    flex-shrink: 0;
    margin-right: $style-spacing-sm;
  }
  
  .goods-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 4px;
    
    .price-box {
      color: $style-text-color-price;
      display: flex;
      align-items: baseline;
      margin-bottom: 4px;
      
      .symbol {
        font-size: $style-text-size-sm;
        margin-right: 2px;
        font-weight: bold;
      }
      
      .price {
        font-size: 40px; // 更大一点
        font-weight: bold;
      }
    }
    
    .stock {
      font-size: $style-text-size-sm;
      color: $style-text-color-secondary;
      margin-bottom: 4px;
    }
    
    .selected-tip {
      font-size: $style-text-size-sm;
      color: $style-text-color-primary;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .close-btn {
    position: absolute;
    top: $style-spacing-sm;
    right: $style-spacing-sm;
    padding: 4px;
    z-index: 10;
  }
}

.sku-body {
  flex: 1;
  padding: $style-spacing-sm;
  overflow-y: auto;
  
  .sku-group {
    margin-bottom: $style-spacing-base;
    
    .group-name {
      font-size: $style-text-size-base;
      font-weight: bold;
      color: $style-text-color-primary;
      margin-bottom: $style-spacing-xs;
    }
    
    .group-values {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      
      .sku-tag {
        padding: 6px 16px;
        border-radius: 100px; // 圆角胶囊
        background: $style-color-bg;
        color: $style-text-color-primary;
        font-size: $style-text-size-sm;
        border: 1px solid transparent;
        
        &.active {
          color: $style-color-primary;
          background: rgba($style-color-primary, 0.1);
          border-color: $style-color-primary;
          font-weight: 500;
        }
        
        &.disabled {
          opacity: 0.5;
          background: #eee;
          color: #ccc;
          text-decoration: line-through;
        }
      }
    }
  }
  
  .count-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $style-spacing-lg;
    margin-bottom: $style-spacing-lg;
    
    .count-label {
      font-size: $style-text-size-base;
      font-weight: bold;
    }
  }
}

.sku-actions {
  padding: $style-spacing-sm;
  padding-bottom: calc($style-spacing-sm + env(safe-area-inset-bottom));
  display: flex;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
  
  .action-btn {
    flex: 1;
    height: 44px;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $style-text-size-base;
    font-weight: 600;
    color: #fff;
    
    &:active {
      opacity: 0.9;
    }
    
    &.cart-btn {
      background: linear-gradient(135deg, #ffba0d 0%, #ff9c00 100%);
    }
    
    &.buy-btn {
      background: linear-gradient(135deg, #ff6034 0%, #ee0a24 100%);
    }
  }
}
</style>
