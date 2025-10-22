<template>
  <div class='root'>
    <!-- 表格 -->
    <m-table
      class='m-table'
      ref='tableRef'
      is-filter-table
      is-complex-filter
      row-key='id'
      selection='multiple'
      :filter-param="filterParam"
      :columns="columns"
      :fetch-data="getMaterials"
      @selection-change='(rows) => (selectRows = rows)'
      v-model:data="data"
      :cell-style='cellStyle'
    >
      <!-- 右侧操作 -->
      <template #right-action>
        <el-button type='primary' @click="openForm('add')" icon='upload'>新增</el-button>
      </template>
    </m-table>
    
    <!-- 表单弹窗，用以增改查 -->
    <el-dialog
      :title="handleType && $t('common.' + handleType)"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="50%"
    >
      <material-form :handle-type="handleType" :model-value="row" @close="formClose" style="height: 60vh" />
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import MTable from '@/components/table/index.vue'
import { getMaterials, deleteMaterial } from '@/api/material/material'
import { reactive, ref, computed, h } from 'vue'
import MaterialForm from './form.vue'
import { useI18n } from 'vue-i18n'
import type { Material } from '@/api/material/material.d'
import type { CommonTableColumn } from '@/components/interface/table'
import { Document, VideoPlay, Microphone, CopyDocument, TopRight } from '@element-plus/icons-vue'
import { ElMessage, ElButton, ElIcon, ElMessageBox } from 'element-plus'

// 表格
const data = ref<Material[]>([]) // 表格模型数据
const tableRef = ref() // 表格的引用
const filterParam = reactive({}) // 过滤
const selectRows = ref<Material[]>([]) // 选中行
const { t } = useI18n()

// 基础URL配置 - 可以通过环境变量配置
const BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/'

// 拼接完整的文件URL
function getFileUrl(filePath?: string): string | null {
  if (!filePath) return null
  return BASE_URL + filePath
}

// 表单
const formVisible = ref(false) // 表单是否显示
const handleType = ref<string>() // 表单类型
const row = ref<Material>() // 表单数据

// 表格单元格样式
function cellStyle({ row, column }: { row: Material; column: { property: string } }) {
  if (column.property === 'status' && (row as Material & { status?: number }).status === 1) {
    return {
      color: 'green'
    }
  }
}

// 删除功能
async function del(rows: Material[]) {
  if (!rows || rows.length === 0) {
    ElMessage.warning('请选择要删除的素材')
    return
  }
  try {
    await ElMessageBox.confirm(`确认删除所选 ${rows.length} 个素材？`, '提示', { type: 'warning' })
  } catch {
    return
  }

  const ids = rows.map(r => r.id)
  try {
    for (const id of ids) {
      await deleteMaterial(id, { showLoading: true })
    }
    ElMessage.success('删除成功')
    tableRef.value.fetchQuery()
    selectRows.value = []
  } catch (err) {
    console.error('删除失败:', err)
    ElMessage.error('删除失败')
  }
}

const columns = computed((): CommonTableColumn<Material>[] => [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'original_name', label: '原文件名', width: 150 },
  { prop: 'filename', label: '文件名', width: 150 },
  { prop: 'file_path', label: '路径', width: 200 },
  { prop: 'file_size', label: '大小', width: 100, formatter: (row, column, cellValue) => {
    if (!cellValue) return '-'
    const bytes = parseInt(cellValue)
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }},
  { prop: 'type', label: '类型', width: 100 },
  { 
    prop: 'material_category', 
    label: '分类', 
    width: 120, 
    formatter: (row, column, cellValue) => {
      return cellValue?.name || '未分类'
    }
  },
  { 
    prop: 'material_tags', 
    label: '标签', 
    width: 150, 
    formatter: (row, column, cellValue) => {
      if (!cellValue || !Array.isArray(cellValue) || cellValue.length === 0) {
        return '无标签'
      }
      return cellValue.map(tag => tag.name).join(', ')
    }
  },
  { 
    prop: 'user', 
    label: '上传者', 
    width: 120, 
    formatter: (row, column, cellValue) => {
      return cellValue?.username || '未知用户'
    }
  },
  { prop: 'description', label: '描述', width: 200, showOverflowTooltip: true },
  { prop: 'is_public', label: '公开', type: 'switch', width: 100 },
  { 
    prop: 'preview', 
    label: '预览', 
    width: 120,
    align: 'center',
    showOverflowTooltip: false,
    slots: { 
      default: (scope: { row: Material }) => renderPreview(scope.row) 
    }
  },
  { 
    prop: 'url', 
    label: 'URL', 
    width: 100,
    align: 'center',
    showOverflowTooltip: false,
    slots: { 
      default: (scope: { row: Material }) => renderUrlActions(scope.row) 
    }
  },
  { prop: 'created_at', label: '创建时间', width: 160 },
  { prop: 'updated_at', label: '更新时间', width: 160 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    width: 200,
    buttons: [
      { 
        label: t('common.edit'), 
        icon: 'edit', 
        onClick: (row: Material, index: { $index: number; $fullIndex: number }) => openForm('edit', row) 
      },
      { 
        label: t('common.detail'), 
        icon: 'document', 
        onClick: (row: Material, index: { $index: number; $fullIndex: number }) => openForm('detail', row)
      },
      { 
        label: t('common.del'), 
        icon: 'delete', 
        type: 'danger', 
        onClick: (row: Material, index: { $index: number; $fullIndex: number }) => del([row]) 
      }
    ]
  }
])

// 预览图片弹窗相关
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 渲染预览列
function renderPreview(row: Material) {
  // 根据实际的字段名获取文件路径，支持file_path或path字段
  const filePath = (row as any).file_path || row.path
  const fileUrl = getFileUrl(filePath)
  
  if (!fileUrl) {
    return h('span', '-')
  }
  
  // 从文件路径中提取文件扩展名
  const fileExtension = filePath?.split('.').pop()?.toLowerCase()
  
  // 如果没有扩展名，尝试使用row.type
  const fileType = fileExtension || row.type?.toLowerCase()
  
  // 图片类型预览 - 使用原生img标签
  if (fileType && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'image'].includes(fileType)) {
    return h('div', { style: 'display: flex; justify-content: center;' }, [
      h('img', {
        src: fileUrl,
        style: 'width: 60px; height: 60px; border-radius: 4px; object-fit: cover; cursor: pointer;',
        onClick: () => {
          // 点击图片时在新窗口中预览
          window.open(fileUrl, '_blank')
        },
        onError: (e: Event) => {
          console.error('图片加载失败:', fileUrl)
          // 可以设置一个默认图片
          const target = e.target as HTMLImageElement
          if (target) {
            target.style.display = 'none'
          }
        }
      })
    ])
  }
  
  // 视频类型预览
  if (fileType && ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'video'].includes(fileType)) {
    return h('div', { style: 'display: flex; justify-content: center;' }, [
      h(ElButton, {
        size: 'small',
        type: 'primary',
        icon: VideoPlay,
        onClick: () => openVideoPreview(fileUrl)
      }, () => '播放')
    ])
  }
  
  // 音频类型预览
  if (fileType && ['mp3', 'wav', 'ogg', 'aac', 'flac', 'audio'].includes(fileType)) {
    return h('div', { style: 'display: flex; justify-content: center;' }, [
      h(ElButton, {
        size: 'small',
        type: 'success',
        icon: Microphone,
        onClick: () => openAudioPreview(fileUrl)
      }, () => '播放')
    ])
  }
  
  // PDF类型预览
  if (fileType === 'pdf') {
    return h('div', { style: 'display: flex; justify-content: center;' }, [
      h(ElButton, {
        size: 'small',
        type: 'warning',
        icon: Document,
        onClick: () => openPdfPreview(fileUrl)
      }, () => 'PDF')
    ])
  }
  
  // 其他文件类型
  return h('div', { style: 'display: flex; justify-content: center;' }, [
    h(ElIcon, { 
      style: 'font-size: 20px; color: #909399; width: 20px; height: 20px;' 
    }, () => h(Document))
  ])
}

// 渲染URL操作列
function renderUrlActions(row: Material) {
  // 根据实际的字段名获取文件路径，支持file_path或path字段
  const filePath = (row as any).file_path || row.path
  const fileUrl = getFileUrl(filePath)
  
  if (!fileUrl) {
    return h('span', '-')
  }
  
  return h('div', { style: 'display: flex; justify-content: center; gap: 5px;' }, [
    // 复制链接按钮
    h(ElButton, {
      size: 'small',
      icon: CopyDocument,
      title: '复制链接',
      onClick: () => copyToClipboard(fileUrl)
    }),
    // 在新窗口打开按钮
    h(ElButton, {
      size: 'small',
      icon: TopRight,
      title: '在新窗口打开',
      onClick: () => window.open(fileUrl, '_blank')
    })
  ])
}

// 打开视频预览
function openVideoPreview(url: string) {
  // 在新窗口中打开视频
  window.open(url, '_blank')
}

// 打开音频预览
function openAudioPreview(url: string) {
  // 在新窗口中打开音频
  window.open(url, '_blank')
}

// 打开PDF预览
function openPdfPreview(url: string) {
  // 在新窗口中打开PDF
  window.open(url, '_blank')
}

// 复制到剪贴板
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('链接已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('链接已复制到剪贴板')
  }
}

function openForm(type: string, materialData?: Material) {
  handleType.value = type
  row.value = materialData
  formVisible.value = true
}

function formClose(needRefresh: boolean) {
  formVisible.value = false
  if (needRefresh) {
    tableRef.value.fetchQuery()
  }
}

</script>

<style lang='scss' scoped>
  .m-table {
    height: 100%;
  }
</style>
