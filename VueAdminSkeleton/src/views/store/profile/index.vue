<template>
  <div class="shop-intro-container">
    <el-card header="店铺资料管理">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" v-loading="loading">
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入店铺名称" />
        </el-form-item>

        <el-form-item label="店铺简介" prop="introduction">
          <el-input v-model="formData.introduction" type="textarea" :rows="2" placeholder="请输入简介" />
        </el-form-item>

        <el-form-item label="详细介绍" prop="detail">
          <el-input v-model="formData.detail" type="textarea" :rows="4" placeholder="请输入详细介绍" />
        </el-form-item>

        <el-form-item label="联系电话" prop="contact_phone">
          <el-input v-model="formData.contact_phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="店铺位置">
           <div class="location-wrapper">
               <location-picker
                 v-model="locationData"
                 @change="handleLocationChange"
               />
               <div class="location-display">
                   <span>当前坐标: {{ formData.longitude || '-' }}, {{ formData.latitude || '-' }}</span>
                   <span>当前地址: {{ formData.address || '-' }}</span>
               </div>
           </div>
        </el-form-item>

        <el-form-item label="店铺轮播图">
            <div class="banners-list">
                <div v-for="(banner, index) in banners" :key="index" class="banner-item">
                    <img :src="getFileUrl(banner.material?.file_path)" class="banner-img" />
                    <div class="banner-actions">
                        <el-button size="small" type="danger" circle icon="delete" @click="removeBanner(index)" />
                    </div>
                </div>
                <div class="add-banner-btn" @click="showMaterialSelector = true">
                    <el-icon><Plus /></el-icon>
                    <span>添加图片</span>
                </div>
            </div>
            <div class="tip">提示：图片顺序即为展示顺序</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <material-selector
        v-model:visible="showMaterialSelector"
        :limit="5"
        @select="handleBannersSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getShopIntro, updateShopIntro } from '@/api/mall/home'
import type { ShopIntroDTO } from '@/api/mall/home'
import LocationPicker from '@/components/map/LocationPicker.vue'
import MaterialSelector from '@/components/material/MaterialSelector.vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const showMaterialSelector = ref(false)

// 临时存储选中的 banner 对象，用于显示
const banners = ref<any[]>([])

const formData = reactive({
    name: '',
    introduction: '',
    detail: '',
    contact_phone: '',
    longitude: 0,
    latitude: 0,
    address: '',
    banner_ids: [] as string[]
})

const locationData = ref({ lng: 0, lat: 0, address: '' })

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/'
function getFileUrl(path?: string) {
    if (!path) return ''
    return BASE_URL + path
}

const rules: FormRules = {
    name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }]
}

onMounted(() => {
    fetchData()
})

async function fetchData() {
    loading.value = true
    try {
        const res = await getShopIntro()
        const data = res.data as ShopIntroDTO
        if (data) {
            formData.name = data.name
            formData.introduction = data.introduction || ''
            formData.detail = data.detail || ''
            formData.contact_phone = data.contact_phone || ''
            formData.longitude = Number(data.longitude) || 0
            formData.latitude = Number(data.latitude) || 0
            formData.address = data.address || ''
            
            // 同步到 locationPicker
            locationData.value = {
                lng: formData.longitude,
                lat: formData.latitude,
                address: formData.address
            }

            // 处理 banners
            if (data.banners) {
                // 假设后端返回的 banners 已经按 sort_order 排序
                banners.value = data.banners.map(b => ({
                    id: b.material_id, // 注意这里的 id 用 material_id，因为提交时需要 material_id
                    material: b.material
                }))
            }
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

function handleLocationChange(val: any) {
    formData.longitude = val.lng
    formData.latitude = val.lat
    formData.address = val.address
}

function handleBannersSelect(selected: any | any[]) {
    const newItems = Array.isArray(selected) ? selected : [selected]
    
    // 避免重复添加 (可选)
    newItems.forEach(item => {
        // 注意：MaterialSelector 返回的是 Material 对象
        // 我们需要把它转换成我们 banners 数组的格式
        // 这里不做严格去重，允许同一张图多次出现（如果是业务需求），通常去重比较好
        if (!banners.value.find(b => b.id === item.id)) {
            banners.value.push({
                id: item.id,
                material: item
            })
        }
    })
}

function removeBanner(index: number) {
    banners.value.splice(index, 1)
}

async function submitForm() {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                // 构造 banner_ids
                formData.banner_ids = banners.value.map(b => b.id)
                
                await updateShopIntro(formData)
                ElMessage.success('保存成功')
                fetchData() // 刷新数据
            } catch (error) {
                console.error(error)
            } finally {
                submitting.value = false
            }
        }
    })
}
</script>

<style scoped>
.shop-intro-container {
    padding: 20px;
}
.location-wrapper {
    width: 100%;
}
.location-display {
    margin-top: 10px;
    color: #666;
    font-size: 12px;
    display: flex;
    gap: 20px;
}

.banners-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 5px;
}

.banner-item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.banner-actions {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px;
    background: rgba(0,0,0,0.3);
    display: none;
}

.banner-item:hover .banner-actions {
    display: block;
}

.add-banner-btn {
    width: 100px;
    height: 100px;
    border: 1px dashed #ddd;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #999;
}

.add-banner-btn:hover {
    border-color: #409eff;
    color: #409eff;
}

.tip {
    font-size: 12px;
    color: #999;
}
</style>
