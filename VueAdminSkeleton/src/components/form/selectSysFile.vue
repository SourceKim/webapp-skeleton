<template>
  <div class="form-view">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
      row-key="id"
      :data="[]"
      :filter-param="param"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryFileList"
      :selection="selectionMode"
      :selection-limit="selectionLimit"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button
          :disabled="selectRows.length === 0 || selectRows.length > selectionLimit"
          type="primary"
          @click="emit('select', selectRows)"
          >{{ $t('common.select') }}
        </el-button>
      </template>
    </m-table>
  </div>
</template>
<script setup lang="jsx">
import MTable from '@/components/table/index.vue'
import { ref, shallowRef, computed } from 'vue'
import { queryFileList } from '@/api/file'
import { statusList } from '@/components/interface/form'
import { getDownloadFileUrl } from '@/utils/file'
import { filesize } from 'filesize'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  param: {
    type: Object,
    default: () => ({})
  },
  /**
   * 最多可选择行数
   */
  selectionLimit: {
    type: [Number, undefined]
  }
})

const { t } = useI18n()
const emit = defineEmits(['close', 'select'])

const selectRows = ref([])

// 根据 selectionLimit 动态设置 selection 模式
const selectionMode = computed(() => {
  return props.selectionLimit === 1 ? 'single' : 'multiple'
})

const topFilterColumns = shallowRef([
  { prop: 'filename', label: t('system.file.name') },
  { prop: 'mime_type', label: t('system.file.contentType') },
  { prop: 'type', label: '类型' }
])

// 表格列定义
const columns = ref([
  { 
    prop: 'id', 
    label: t('common.id'),
    width: 80,
    showOverflowTooltip: true
  },
  { 
    prop: 'object', 
    label: t('system.file.object'),
    formatter: (row) => row.object || row.file_path || '-'
  },
  { 
    prop: 'name', 
    label: t('system.file.name'),
    formatter: (row) => row.name || row.filename || row.original_name || '-'
  },
  { 
    prop: 'contentType', 
    label: t('system.file.contentType'),
    formatter: (row) => row.contentType || row.mime_type || '-'
  },
  { 
    prop: 'suffix', 
    label: t('system.file.suffix'),
    formatter: (row) => {
      if (row.suffix) return row.suffix
      const path = row.object || row.file_path || ''
      return path.split('.').pop()?.toLowerCase() || '-'
    }
  },
  {
    prop: 'size',
    label: t('system.file.size'),
    formatter: (row) => {
      const size = row.size || row.file_size || 0
      return filesize(Number(size), { base: 2, standard: 'jedec' })
    }
  },
  { prop: 'preview', label: t('system.file.preview'), slots: { default: previewImage } },
  { 
    prop: 'imgWidth', 
    label: t('system.file.imgWidth'),
    formatter: (row) => row.imgWidth || row.metadata?.width || '-'
  },
  { 
    prop: 'imgHeight', 
    label: t('system.file.imgHeight'),
    formatter: (row) => row.imgHeight || row.metadata?.height || '-'
  },
  { 
    prop: 'imgRatio', 
    label: t('system.file.imgRatio'),
    formatter: (row) => row.imgRatio || row.metadata?.ratio || '-'
  },
  { 
    prop: 'status', 
    label: t('system.file.status'), 
    type: 'select', 
    itemList: statusList,
    formatter: (row) => {
      // 兼容 Material 的 is_public 字段
      if (row.status !== undefined) return row.status
      return row.is_public ? 1 : 2
    }
  },
  { 
    prop: 'sha1', 
    label: t('system.file.sha1'), 
    comment: t('system.file.sha1Comment'),
    formatter: (row) => row.sha1 || row.file_hash || '-'
  },
  { 
    prop: 'createTime', 
    label: t('system.file.createTime'), 
    width: 160,
    formatter: (row) => row.createTime || row.created_at || '-'
  }
])

// 图片文件预览
function previewImage(scope) {
  const file = scope.row
  // 兼容 Material 数据格式：contentType 或 mime_type
  const contentType = file?.contentType || file?.mime_type
  if (contentType?.startsWith('image')) {
    // 兼容 Material 数据格式：object 或 file_path
    const filePath = file.object || file.file_path
    if (!filePath) return null
    
    const src = getDownloadFileUrl({ object: filePath, isScale: true })
    const suffix = file.suffix || filePath.split('.').pop()?.toLowerCase()
    if (suffix === 'svg')
      return <m-svg-icon inherited={true} style="width: 25px; height: 25px; display: block" src={src} />
    return (
      <el-image
        {...{
          src,
          style: 'width: 30px; height: 30px;',
          fit: 'cover',
          previewSrcList: [getDownloadFileUrl({ object: filePath })],
          hideOnClickModal: true,
          previewTeleported: true
        }}
      />
    )
  }
  return null
}
</script>
<style lang="scss" scoped>
.form-view {
  padding: 10px;
  background-color: var(--layout-bg-color);
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-table {
    height: 0;
    flex-grow: 1;
  }

  :deep(.el-image) {
    display: block;
  }
}
</style>
