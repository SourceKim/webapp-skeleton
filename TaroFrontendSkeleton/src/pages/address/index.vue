<template>
  <view class="address-page">
    <nut-navbar title="地址管理" safe-area-inset-top left-show right-show @click-right="goCreate" @click-back="goBack">
      <template #right>
        <text>新增</text>
      </template>
    </nut-navbar>

    <view v-if="list.length === 0" class="empty">
      <nut-empty description="暂无地址" />
    </view>

    <nut-address-list
      :data="listWithFullAddress"
      @click-item="editClick"
      @del-icon="delClick"
      @edit-icon="editClick"
      :show-bottom-button="false"
      :data-options="dataOptions"
    >
  </nut-address-list>


  </view>
  
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Taro from '@tarojs/taro'
import addressService, { AddressItem } from '@/services/address'

const list = ref<(AddressItem)[]>([])
const listWithFullAddress = computed(() => list.value.map(item => ({
  ...item,
  fullAddress: [
    item.province,
    item.city,
    item.country,
    item.town,
    item.detail
  ].filter(Boolean).join('')
})))

// 组件内优先获取基础数据结构中定义的字段，若想自定义 key 值，可以通过 dataOptions 设置映射关系
const dataOptions = reactive({
  id: 'id',
  addressName: 'name',
  phone: "phone",
  defaultAddress: 'is_default',
  fullAddress: 'fullAddress',
})

const load = async () => {
  const res = await addressService.list()
  if (res.code === 0) list.value = res.data || []
}

onMounted(async () => {
  await load()
})

const goBack = () => {
  Taro.navigateBack()
}

const goCreate = () => {
  Taro.navigateTo({ url: '/pages/address/form/index' })
}

const editClick = (id: string) => {
  Taro.navigateTo({ url: `/pages/address/form/index?id=${id}` })
}

const delClick = async (id: string) => {
  const confirm = await Taro.showModal({ title: '删除地址', content: '确认删除该地址？' })
  if (confirm.confirm) {
    const res = await addressService.remove(id)
    if (res.code === 0) {
      await load()
    }
  }
}

const setDefault = async (item: AddressItem) => {
  const res = await addressService.setDefault(item.id)
  if (res.code === 0) await load()
}

</script>

<style lang="scss">
.address-page { padding: $style-spacing-xs 0 $style-spacing-base; }
.ops { display: flex; gap: $style-spacing-xs; }
.ml-6 { margin-left: 6px; }
.empty { margin-top: $style-spacing-lg; }
</style>


