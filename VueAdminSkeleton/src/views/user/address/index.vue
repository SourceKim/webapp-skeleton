<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      row-key="id"
      selection="multiple"
      :filter-param="filterParam"
      :columns="columns"
      :fetch-data="fetchPage"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
    </m-table>
  </div>
</template>

<script setup lang="ts">
import MTable from '@/components/table/index.vue'
import { reactive, ref, computed } from 'vue'
import type { CommonTableColumn } from '@/components/interface/table'
import type { UserAddress } from '@/api/user/address.d'
import type { FetchPageDataFun } from '@/interface/request'
import { listAdminAddresses, deleteAdminAddress } from '@/api/user/address'

const data = ref<UserAddress[]>([])
const tableRef = ref()
const filterParam = reactive({})
const selectRows = ref<UserAddress[]>([])

const fetchPage: FetchPageDataFun<UserAddress> = (filters?: Record<string, any>) => {
  const params = { ...filters }
  return listAdminAddresses(params).then(res => {
    // 适配后端分页结构（data.items + data.meta.total）到 MTable 需要的 PageResult 结构
    const items = (res.data as any)?.items || []
    const total = (res.data as any)?.meta?.total ?? 0
    return {
      code: res.code || 0,
      message: res.message,
      data: { items, total }
    } as any
  }) as any
}

const columns = computed((): CommonTableColumn<UserAddress>[] => [
  { prop: 'id', label: 'ID', width: 160 },
  { prop: 'user_id', label: '用户ID', width: 160 },
  { prop: 'name', label: '收货人', width: 120 },
  { prop: 'phone', label: '手机号', width: 140 },
  { prop: 'province', label: '省', width: 120 },
  { prop: 'city', label: '市', width: 120 },
  { prop: 'country', label: '区/县', width: 120 },
  { prop: 'town', label: '乡镇', width: 120 },
  { prop: 'detail', label: '详细地址', width: 240 },
  { prop: 'is_default', label: '默认', width: 80, formatter: (r) => (r.is_default ? '是' : '否') },
  { prop: 'tag', label: '标签', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'updatedAt', label: '更新时间', width: 160 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    width: 160,
    buttons: [
      { label: '删除', icon: 'delete', type: 'danger', onClick: async (r: UserAddress) => { await deleteAdminAddress(r.id); tableRef.value?.fetchQuery?.() } },
    ]
  }
])
</script>

<style lang="scss" scoped>
.root { padding: 12px; }
</style>


