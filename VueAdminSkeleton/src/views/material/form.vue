<template>
  <div class="material-form">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="12"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      >
        <!-- 文件预览插槽 -->
        <template #file-preview>
          <div class="file-preview-container" v-if="currentFileUrl">
            <!-- 图片预览 -->
            <div v-if="isImageFile(formData.type)" class="image-preview">
              <el-image
                :src="currentFileUrl"
                style="width: 200px; height: 150px; border-radius: 8px;"
                fit="cover"
                :preview-src-list="[currentFileUrl]"
                hide-on-click-modal
                preview-teleported
              />
            </div>
            
            <!-- 视频预览 -->
            <div v-else-if="isVideoFile(formData.type)" class="video-preview">
              <video 
                :src="currentFileUrl" 
                style="width: 200px; height: 150px; border-radius: 8px;"
                controls
                preload="metadata"
              />
            </div>
            
            <!-- 音频预览 -->
            <div v-else-if="isAudioFile(formData.type)" class="audio-preview">
              <audio 
                :src="currentFileUrl" 
                controls
                style="width: 100%; max-width: 300px;"
              />
            </div>
            
            <!-- PDF或其他文件预览 -->
            <div v-else class="file-preview">
              <div class="file-icon">
                <el-icon size="48"><Document /></el-icon>
              </div>
              <div class="file-info">
                <p><strong>{{ formData.filename || formData.original_name }}</strong></p>
                <p>类型: {{ formData.type }}</p>
                <p>大小: {{ formatFileSize(formData.file_size) }}</p>
              </div>
              <el-button type="primary" @click="openFileInNewTab">
                <el-icon><TopRight /></el-icon>
                在新窗口中打开
              </el-button>
            </div>
          </div>
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close(false)">{{ $t('common.cancel') }}</el-button>
      <template v-if="!formLoading">
        <el-button
          v-if="handleType && ['add', 'edit'].includes(handleType)"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import MForm from '@/components/form/index.vue'
import { computed, ref, watch } from 'vue'
import type { Material } from '@/api/material/material.d'
import type { PropType } from 'vue'
import { getMaterialCategories } from '@/api/material/material-category'
import type { CommonItemData } from '@/components/interface'
import type { CommonFormColumn } from '@/components/interface/form'
import { getMaterialTags } from '@/api/material/material-tags'
import { uploadMaterial, updateMaterial } from '@/api/material/material'
import type { MaterialCategory } from '@/api/material/material-category.d'
import type { MaterialTag } from '@/api/material/material-tags.d'
import { formColumnTypes } from '@/components/mutils'
import { Document, TopRight } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'close', needRefresh: boolean): void
}>()

// 外部传入的参数
const props = defineProps({
  // 1. 处理类型，增、改、查
  handleType: {
    type: String,
    default: 'add'
  },
  // 2. 表单数据
  modelValue: {
    type: Object as PropType<Material>,
  }
})

const formData = ref<Partial<Material>>({}) // 表单数据
const formLoading = ref(false) // 表单加载状态
const saveLoading = ref(false) // 保存加载状态
const formRef = ref()

// 基础URL配置 - 可以通过环境变量配置
const BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/'

// 拼接完整的文件URL
function getFileUrl(filePath?: string): string | null {
  if (!filePath) return null
  return BASE_URL + filePath
}

// 获取当前文件的完整URL
const currentFileUrl = computed(() => {
  // 根据实际的字段名获取文件路径，支持file_path或path字段
  const filePath = formData.value.file_path || (formData.value as any).path
  return getFileUrl(filePath)
})

// 初始化表单数据
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    formData.value = { ...newValue }
  } else {
    // 新增时的默认值
    formData.value = {
      is_public: false,
      metadata: {},
      tags: []
    }
  }
}, { immediate: true })

// 获取素材 category 列表
const materialCategories = ref<CommonItemData[]>([])
const loadCategories = async () => {
  try {
    const response = await getMaterialCategories()
    if (response.data?.items) {
      materialCategories.value = response.data.items.map((item: MaterialCategory) => ({
        label: item.name,
        value: item.id
      }))
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取素材 tags 列表
const materialTags = ref<CommonItemData[]>([])
const loadTags = async () => {
  try {
    const response = await getMaterialTags()
    if (response.data?.items) {
      materialTags.value = response.data.items.map((item: MaterialTag) => ({
        label: item.name,
        value: item.id
      }))
    }
  } catch (error) {
    console.error('获取标签列表失败:', error)
  }
}

// 加载选项数据
if (props.handleType === 'add' || props.handleType === 'edit') {
  loadCategories()
  loadTags()
}

function close(needRefresh: boolean = false) {
  emit('close', needRefresh)
}

function save() {
  formRef.value.submit().then((formResult: Record<string, unknown>) => {
    saveLoading.value = true
    
    if (props.handleType === 'add') {
      // 新增时使用 FormData 上传
      const formData = new FormData()
      
      // 添加文件 - 修复：从数组中提取第一个文件的 raw 属性
      if (formResult.file && Array.isArray(formResult.file) && formResult.file.length > 0) {
        const fileItem = formResult.file[0]
        
        if (fileItem.raw && fileItem.raw instanceof File) {
          formData.append('file', fileItem.raw)
        } else {
          console.error('无效的文件对象:', fileItem)
          saveLoading.value = false
          return
        }
      } else {
        console.error('没有选择文件或文件格式不正确:', formResult.file)
        saveLoading.value = false
        return
      }
      
      // 添加其他字段
      Object.keys(formResult).forEach(key => {
        if (key !== 'file' && formResult[key] !== undefined && formResult[key] !== null) {
          const value = formResult[key]
          if (Array.isArray(value)) {
            // 数组类型转为 JSON 字符串
            formData.append(key, JSON.stringify(value))
          } else if (typeof value === 'object') {
            // 对象类型转为 JSON 字符串
            formData.append(key, JSON.stringify(value))
          } else {
            // 基本类型直接转为字符串
            formData.append(key, String(value))
          }
        }
      })
      
      uploadMaterial(formData).then(() => {
        saveLoading.value = false
        close(true)
      }).catch((error: unknown) => {
        saveLoading.value = false
        console.error('上传失败:', error)
      })
    } else if (props.handleType === 'edit' && props.modelValue?.id) {
      // 编辑时使用普通更新接口
      updateMaterial(props.modelValue.id, formResult).then(() => {
        saveLoading.value = false
        close(true)
      }).catch((error: unknown) => {
        saveLoading.value = false
        console.error('更新失败:', error)
      })
    }
  })
}

const columns = computed((): CommonFormColumn<Partial<Material>>[] => [
  // 文件上传（仅新增时显示）
  ...(props.handleType === 'add' ? [
    formColumnTypes.uploadFile({ prop: 'file', label: '文件', tip: '请选择要上传的文件', required: true })
  ] : []),
  
  // 基本信息
  formColumnTypes.input({ prop: 'filename', label: '文件名', tip: '可自定义文件名' }),
  
  // 分类和描述
  formColumnTypes.select({ prop: 'categoryId', label: '分类', itemList: materialCategories }),
  formColumnTypes.textarea({ prop: 'description', label: '描述', rows: 3 }),
  
  // 公开设置和标签
  formColumnTypes.switch({ prop: 'is_public', label: '是否公开' }),
  formColumnTypes.checkboxGroup({ prop: 'tags', label: '标签', itemList: materialTags }),
  
  // 元数据
  formColumnTypes.textarea({ prop: 'metadata', label: '元数据', tip: '请输入JSON格式的元数据', rows: 4 }),
  
  // 只读信息（仅详情和编辑时显示）
  ...(props.handleType !== 'add' ? [
    formColumnTypes.readonly({ prop: 'id', label: 'ID' }),
    formColumnTypes.readonly({ prop: 'file_path', label: '文件路径' }),
    formColumnTypes.readonly({ prop: 'file_size', label: '文件大小', 
      formatter: (value: any) => formatFileSize(value)
    }),
    formColumnTypes.readonly({ prop: 'type', label: '文件类型' }),
    formColumnTypes.readonly({ prop: 'mime_type', label: 'MIME类型' }),
    formColumnTypes.readonly({ prop: 'original_name', label: '原始文件名' }),
    // 分类信息
    formColumnTypes.readonly({ prop: 'material_category', label: '分类',
      formatter: (value: any) => value?.name || '未分类'
    }),
    // 标签信息
    formColumnTypes.readonly({ prop: 'material_tags', label: '标签',
      formatter: (value: any) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return '无标签'
        }
        return value.map(tag => tag.name).join(', ')
      }
    }),
    // 用户信息
    formColumnTypes.readonly({ prop: 'user', label: '上传者',
      formatter: (value: any) => value?.username || '未知用户'
    }),
    // 文件预览（如果有URL的话）
    ...(currentFileUrl.value ? [{
      type: 'span' as const,
      label: '文件预览',
      slotName: 'file-preview'
    }] : []),
    formColumnTypes.readonly({ prop: 'url', label: 'URL' }),
    formColumnTypes.readonly({ prop: 'created_at', label: '创建时间' }),
    formColumnTypes.readonly({ prop: 'updated_at', label: '更新时间' })
  ] : [])
])

// 文件类型检查函数
function isImageFile(type?: string): boolean {
  if (!type) return false
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  return imageTypes.includes(type.toLowerCase())
}

function isVideoFile(type?: string): boolean {
  if (!type) return false
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
  return videoTypes.includes(type.toLowerCase())
}

function isAudioFile(type?: string): boolean {
  if (!type) return false
  const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac']
  return audioTypes.includes(type.toLowerCase())
}

// 格式化文件大小
function formatFileSize(bytes?: string | number): string {
  if (!bytes) return '-'
  
  const numBytes = typeof bytes === 'string' ? parseInt(bytes) : bytes
  if (numBytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(numBytes) / Math.log(k))
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 在新窗口中打开文件
function openFileInNewTab() {
  const fileUrl = currentFileUrl.value
  if (fileUrl) {
    window.open(fileUrl, '_blank')
  }
}

</script>

<style scoped lang="scss">
.material-form {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;
  }
}

.file-preview-container {
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #f5f7fa;
  
  .image-preview {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }
  
  .video-preview {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }
  
  .audio-preview {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }
  
  .file-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    
    .file-icon {
      color: #909399;
    }
    
    .file-info {
      text-align: center;
      
      p {
        margin: 4px 0;
        color: #606266;
        
        &:first-child {
          color: #303133;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
