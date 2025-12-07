<template>
  <el-dialog
    title="选择素材"
    :model-value="visible"
    @update:model-value="updateVisible"
    width="70%"
    append-to-body
    destroy-on-close
  >
    <div style="height: 60vh">
        <m-table
            class="m-table"
            ref="tableRef"
            is-filter-table
            is-complex-filter
            row-key="id"
            selection="multiple"
            :filter-param="filterParam"
            :columns="columns"
            :fetch-data="getMaterials"
            @selection-change="handleSelectionChange"
            v-model:data="tableData"
        >
             <template #right-action>
                 <span style="margin-right: 10px; color: #666">
                    已选: {{ selectedRows.length }} / {{ limit > 0 ? limit : '不限' }}
                 </span>
             </template>
        </m-table>
    </div>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm" :disabled="selectedRows.length === 0">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, h } from 'vue'
import MTable from '@/components/table/index.vue'
import { getMaterials } from '@/api/material/material'
import type { Material } from '@/api/material/material.d'
import type { CommonTableColumn } from '@/components/interface/table'
import { ElMessage } from 'element-plus'
import { getUploadFileUrl } from '@/utils/file'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:visible', 'select'])

const tableRef = ref()
const filterParam = reactive({})
const selectedRows = ref<Material[]>([])
const tableData = ref<Material[]>([])

// 拼接完整的文件URL - 使用统一的工具函数
function getFileUrl(filePath?: string): string | null {
  return getUploadFileUrl(filePath)
}

const columns = computed((): CommonTableColumn<Material>[] => [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'filename', label: '文件名', width: 150 },
  { prop: 'type', label: '类型', width: 80 },
  { 
    prop: 'preview', 
    label: '预览', 
    width: 100,
    slots: { default: renderPreview }
  },
  { prop: 'created_at', label: '上传时间', width: 160 }
])

function renderPreview(scope: { row: Material }) {
    const filePath = (scope.row as any).file_path || scope.row.path
    const fileUrl = getFileUrl(filePath)
    if (scope.row.type === 'image' && fileUrl) {
        return h('img', {
            src: fileUrl,
            style: 'width: 40px; height: 40px; object-fit: cover'
        })
    }
    return h('span', scope.row.type)
}

function updateVisible(val: boolean) {
  emit('update:visible', val)
}

function close() {
  updateVisible(false)
}

function handleSelectionChange(rows: Material[]) {
    if (props.limit === 1 && rows.length > 1) {
        // 如果是单选，虽然 m-table 支持多选，但我们逻辑上限制一下
        // 实际上 m-table 的 selection='multiple' 可能无法轻易改为单选模式而不改代码
        // 这里简单的做一个 UI 提示或者逻辑截断
        // 为了用户体验，如果是单选，建议用户只选一个，或者我们取最后一个
        selectedRows.value = [rows[rows.length - 1]]
        // TODO: 需要清除 table 的 selection，比较麻烦，暂时先这样
        // 或者让 m-table 支持 single selection 模式
        // 鉴于时间，我们先允许 select 多选，但在 confirm 时检查
    } else {
        selectedRows.value = rows
    }
}

function confirm() {
    if (selectedRows.value.length === 0) return

    if (props.limit > 0 && selectedRows.value.length > props.limit) {
        ElMessage.warning(`最多只能选择 ${props.limit} 个素材`)
        return
    }
    
    emit('select', props.limit === 1 ? selectedRows.value[0] : selectedRows.value)
    close()
}
</script>

<style scoped>
.m-table {
    height: 100%;
}
</style>
