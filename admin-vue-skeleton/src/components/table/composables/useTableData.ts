import { ref, computed, watch, toRef, nextTick, type Ref } from 'vue'
import type { PageQuery, PageResult, RestResponse, TableFetchFunction } from '../types'
import type { TablePagination } from '@/components/interface/table'

/**
 * 表格数据管理逻辑
 */
export function useTableData<T extends object, F extends object>(props: {
  data?: T[]
  isPage?: boolean
  defaultQuery?: boolean
  filterParam?: F
  pagination?: Partial<TablePagination>
  fetchData?: TableFetchFunction<T, F>
}) {
  const loadingRef = ref(false)

  // 表格数据
  const data = ref(toRef(props, 'data').value ?? []) as Ref<T[]>
  
  watch(
    () => props.data,
    (newData) => {
      data.value = newData ?? []
    }
  )

  // 过滤查询数据
  const pageQuery: Ref<PageQuery<F>> = ref({
    isPage: toRef(props, 'isPage').value ?? false,
    currentPage: 1,
    pageSize: 20,
    param: toRef(props, 'filterParam').value ?? {} as F,
  })

  watch(
    () => props.filterParam,
    (val) => {
      pageQuery.value.param = val ?? {} as F
    }
  )

  // 分页信息对象
  const pagination = ref<TablePagination>({
    total: 0,
    currentPage: 1,
    pageSize: 20,
    pageSizes: [5, 10, 20, 50, 100, 1000],
    background: true,
    layout: 'total,sizes,prev,pager,next,jumper'
  })

  if (props.pagination) {
    pagination.value = Object.assign(pagination.value, props.pagination)
    if (pagination.value.defaultPageSize) {
      pageQuery.value.pageSize = pagination.value.defaultPageSize
    }
  }

  watch(
    () => [pageQuery.value.currentPage, pageQuery.value.pageSize],
    ([currentPage, pageSize]) => {
      pagination.value.currentPage = currentPage!
      pagination.value.pageSize = pageSize!
    },
    { immediate: true }
  )

  // 当前分页的数据
  const pageData = computed(() => {
    if (!props.fetchData && props.isPage) {
      const start = pageQuery.value.pageSize! * (pageQuery.value.currentPage! - 1)
      return data.value.slice(start, start + pageQuery.value.pageSize!)
    }
    return data.value
  })

  // 向后端请求表格数据
  async function fetchQuery() {
    if (props.fetchData) {
      loadingRef.value = true
      try {
        const response = await props.fetchData(pageQuery.value.param, { loadingRef })
        const resData = response.data!
        data.value = resData.items
        pagination.value.total = resData.total
        return resData
      } finally {
        loadingRef.value = false
      }
    }
  }

  // 默认启动就执行一次查询
  if (props.defaultQuery) {
    nextTick(fetchQuery)
  }

  return {
    loadingRef,
    data,
    pageQuery,
    pagination,
    pageData,
    fetchQuery
  }
} 