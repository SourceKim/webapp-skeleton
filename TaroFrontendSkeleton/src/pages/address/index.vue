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

    <nut-cell-group v-else>
      <nut-cell v-for="item in list" :key="item.id" :title="formatTitle(item)" :sub-title="formatSub(item)">
        <template #link>
          <view class="ops">
            <nut-button size="small" type="primary" @click.stop="edit(item.id)">编辑</nut-button>
            <nut-button size="small" plain type="warning" @click.stop="setDefault(item)" v-if="!item.is_default">设为默认</nut-button>
            <nut-button size="small" type="danger" @click.stop="remove(item.id)">删除</nut-button>
          </view>
        </template>
        <template #desc>
          <nut-tag v-if="item.is_default" type="success">默认</nut-tag>
          <nut-tag v-if="item.tag" class="ml-6">{{ item.tag }}</nut-tag>
        </template>
      </nut-cell>
    </nut-cell-group>
  </view>
  
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Taro from '@tarojs/taro'
import addressService, { AddressItem } from '@/services/address'

const list = ref<AddressItem[]>([])

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

const edit = (id: string) => {
  Taro.navigateTo({ url: `/pages/address/form/index?id=${id}` })
}

const remove = async (id: string) => {
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

const formatTitle = (it: AddressItem) => `${it.name} ${it.phone}`
const formatSub = (it: AddressItem) => `${it.province}${it.city}${it.district}${it.detail}`
</script>

<style lang="scss">
.address-page { padding: 8px 0 24px; }
.ops { display: flex; gap: 8px; }
.ml-6 { margin-left: 6px; }
.empty { margin-top: 32px; }
</style>


