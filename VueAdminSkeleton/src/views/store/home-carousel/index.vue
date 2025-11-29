<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :fetch-data="getCarousels"
      v-model:data="tableData"
    >
      <template #right-action>
        <el-button type="primary" icon="plus" @click="openForm('add')">新增轮播图</el-button>
      </template>
    </m-table>

    <!-- Form Dialog -->
    <el-dialog
      :title="formType === 'add' ? '新增轮播图' : '编辑轮播图'"
      v-model="formVisible"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        
        <el-form-item label="图片" prop="material_id">
           <el-upload
             class="avatar-uploader"
             action="#"
             :show-file-list="false"
             :http-request="handleUpload"
             :before-upload="beforeAvatarUpload"
           >
             <img v-if="formData.material_id && selectedMaterialPath" :src="getFileUrl(selectedMaterialPath)" class="avatar" />
             <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
           </el-upload>
           <div class="upload-tip">点击上传图片 (支持 jpg/png/webp)</div>
        </el-form-item>

        <el-form-item label="关联SPU" prop="spu_id">
          <el-select
            v-model="formData.spu_id"
            placeholder="请选择关联商品"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in spuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div class="spu-option">
                <img 
                  v-if="item.main_material?.file_path" 
                  :src="getFileUrl(item.main_material.file_path)" 
                  class="spu-option-img"
                />
                <span class="spu-option-text">{{ item.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort_order">
          <el-input-number v-model="formData.sort_order" :min="0" />
        </el-form-item>

        <el-form-item label="启用" prop="is_active">
          <el-switch v-model="formData.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h, onMounted } from 'vue'
import MTable from '@/components/table/index.vue'
import { getCarousels, createCarousel, updateCarousel, deleteCarousel, getSpuList } from '@/api/mall/home'
import { uploadMaterial } from '@/api/material/material'
import type { CarouselDTO } from '@/api/mall/home'
import { ElMessage, ElMessageBox, ElUpload, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'

const tableRef = ref()
const formVisible = ref(false)
const formType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const tableData = ref<CarouselDTO[]>([])
const spuList = ref<any[]>([])

const formData = reactive({
    id: '',
    title: '',
    material_id: '',
    spu_id: '',
    sort_order: 0,
    is_active: true
})

const selectedMaterialPath = ref('')

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/'
function getFileUrl(path: string) {
    if (!path) return ''
    return BASE_URL + path
}

const rules: FormRules = {
    material_id: [{ required: true, message: '请上传图片', trigger: 'change' }]
}

const columns = computed(() => [
    { prop: 'title', label: '标题' },
    { 
        prop: 'material', 
        label: '图片', 
        width: 100,
        slots: { default: renderImage }
    },
    { 
        prop: 'spu', 
        label: '关联SPU', 
        width: 200,
        slots: { default: renderSpu }
    },
    { prop: 'sort_order', label: '排序', width: 80 },
    { prop: 'is_active', label: '状态', width: 80, formatter: (row: any) => row.is_active ? '启用' : '禁用' },
    { prop: 'created_at', label: '创建时间' },
    {
        type: 'operation',
        label: '操作',
        fixed: 'right',
        width: 150,
        buttons: [
            { label: '编辑', type: 'primary', onClick: (row: CarouselDTO) => openForm('edit', row) },
            { label: '删除', type: 'danger', onClick: (row: CarouselDTO) => handleDelete(row) }
        ]
    }
])

function renderImage(scope: { row: CarouselDTO }) {
    const path = scope.row.material?.file_path
    if (path) {
        return h('img', {
            src: getFileUrl(path),
            style: 'width: 50px; height: 50px; object-fit: cover; border-radius: 4px;'
        })
    }
    return '-'
}

function renderSpu(scope: { row: CarouselDTO }) {
    const spu = scope.row.spu
    if (!spu) return '-'
    
    const children = []
    if (spu.main_material?.file_path) {
        children.push(h('img', {
            src: getFileUrl(spu.main_material.file_path),
            style: 'width: 30px; height: 30px; object-fit: cover; border-radius: 4px; margin-right: 5px; vertical-align: middle;'
        }))
    }
    children.push(h('span', spu.name))
    
    return h('div', { style: 'display: flex; align-items: center;' }, children)
}

async function loadSpuList() {
    if (spuList.value.length > 0) return
    try {
        const res = await getSpuList({ page: 1, limit: 100 })
        if (res.code === 0 && res.data) {
            spuList.value = res.data.items || []
        }
    } catch (e) {
        console.error(e)
    }
}

async function openForm(type: 'add' | 'edit', row?: CarouselDTO) {
    formType.value = type
    formVisible.value = true
    selectedMaterialPath.value = ''
    
    // Load SPUs if needed
    await loadSpuList()
    
    if (type === 'edit' && row) {
        Object.assign(formData, {
            id: row.id,
            title: row.title,
            material_id: row.material_id,
            spu_id: row.spu_id,
            sort_order: row.sort_order,
            is_active: row.is_active
        })
        if (row.material) {
            selectedMaterialPath.value = row.material.file_path || ''
        }
    } else {
        // Reset form data correctly
        formData.id = ''
        formData.title = ''
        formData.material_id = ''
        formData.spu_id = ''
        formData.sort_order = 0
        formData.is_active = true
    }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(rawFile.type)) {
    ElMessage.error('Avatar picture must be image format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!')
    return false
  }
  return true
}

const handleUpload = async (options: any) => {
    const { file } = options
    const form = new FormData()
    form.append('file', file)
    
    try {
        const res = await uploadMaterial(form, { showLoading: true })
        if (res && res.code === 0 && res.data) {
            const material = res.data
            formData.material_id = material.id
            selectedMaterialPath.value = material.file_path
            ElMessage.success('上传成功')
        }
    } catch (error) {
        console.error('Upload error:', error)
    }
}

async function submitForm() {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                const submitData: any = { ...formData }
                if (submitData.id === '') delete submitData.id
                // 如果 spu_id 为空字符串，则不传或设为 null
                if (!submitData.spu_id) submitData.spu_id = null

                if (formType.value === 'add') {
                    await createCarousel(submitData)
                    ElMessage.success('创建成功')
                } else {
                    await updateCarousel(submitData.id, submitData)
                    ElMessage.success('更新成功')
                }
                formVisible.value = false
                tableRef.value.fetchQuery()
            } catch (error) {
                console.error(error)
            } finally {
                submitting.value = false
            }
        }
    })
}

async function handleDelete(row: CarouselDTO) {
    try {
        await ElMessageBox.confirm('确定删除该轮播图吗？', '提示', { type: 'warning' })
        await deleteCarousel(row.id)
        ElMessage.success('删除成功')
        tableRef.value.fetchQuery()
    } catch (e) {
        // cancel
    }
}
</script>

<style scoped>
.m-table {
    height: 100%;
}
.preview-box {
    display: flex;
    align-items: center;
    gap: 10px;
}
.preview-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #ddd;
}
.spu-option {
    display: flex;
    align-items: center;
}
.spu-option-img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    margin-right: 8px;
    border-radius: 2px;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  border-radius: 4px;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100px;
  height: 100px;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.upload-tip {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
</style>
