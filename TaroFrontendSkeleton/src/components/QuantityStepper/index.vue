<template>
  <view class="quantity-stepper" :class="{ 'is-min': modelValue <= min, 'is-max': modelValue >= max }">
    <view class="btn minus" @tap.stop="onMinus">
      <nut-icon name="minus" size="12" :color="modelValue <= min ? '#ccc' : '#1677ff'" />
    </view>
    <text class="num">{{ modelValue }}</text>
    <view class="btn plus" @tap.stop="onPlus">
      <nut-icon name="plus" size="12" :color="modelValue >= max ? '#ccc' : '#ffffff'" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
}>(), {
  min: 0,
  max: 99999
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
  (e: 'change', val: number): void
  (e: 'minus'): void
  (e: 'plus'): void
}>()

const { modelValue, min, max } = toRefs(props)

const onMinus = () => {
  if (modelValue.value <= min.value) return
  const val = modelValue.value - 1
  emit('update:modelValue', val)
  emit('change', val)
  emit('minus')
}

const onPlus = () => {
  if (modelValue.value >= max.value) return
  const val = modelValue.value + 1
  emit('update:modelValue', val)
  emit('change', val)
  emit('plus')
}
</script>

<style lang="scss">
.quantity-stepper {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &.minus {
      border: 1px solid $style-color-primary;
      background: $style-color-white;
      
      &:active {
        background: #f0f0f0;
      }
    }
    
    &.plus {
      background: $style-color-primary;
      
      &:active {
        opacity: 0.8;
      }
    }
  }
  
  &.is-min .btn.minus {
    border-color: #ccc;
    background: #f5f5f5;
  }
  
  &.is-max .btn.plus {
    background: #f5f5f5;
  }
  
  .num {
    font-size: $style-text-size-lg;
    color: $style-text-color-primary;
    min-width: 32px;
    text-align: center;
    font-weight: 600;
  }
}
</style>
