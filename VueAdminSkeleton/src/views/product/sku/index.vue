<template>
  <div class="root">
    <div class="header">
      <div class="title">SKU 管理</div>
      <div class="spu-select">
        <el-select
          v-model="spuId"
          filterable
          remote
          placeholder="输入 SPU 名称搜索切换"
          :remote-method="fetchSpuOptions"
          :loading="spuLoading"
          style="width: 300px"
          @change="handleSpuChange"
        >
          <el-option
            v-for="item in spuOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>

    <div v-if="!spuId">
      <el-empty description="请先选择一个 SPU 进行管理" />
    </div>
    
    <template v-else>
      <el-card class="group-card">
        <template #header>
          <div class="card-header">SPU 基本信息</div>
        </template>
        <div class="group-body">
          <div style="display: flex; gap: 20px;">
            <div style="width: 100px; height: 100px; border: 1px solid #eee; border-radius: 6px; overflow: hidden; flex-shrink: 0;">
               <el-image 
                  v-if="spu?.main_material?.file_path"
                  :src="getUploadFileUrl(spu.main_material.file_path)"
                  style="width: 100%; height: 100%;"
                  fit="cover"
                  :preview-src-list="[getUploadFileUrl(spu.main_material.file_path)]"
                  preview-teleported
               />
               <div v-else style="width:100%;height:100%;background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">暂无图片</div>
            </div>
            <div style="flex: 1;">
              <el-descriptions :column="3" border>
                <el-descriptions-item label="标题">{{ spu?.name || '-' }}</el-descriptions-item>
                <el-descriptions-item label="副标题">{{ spu?.sub_title || '-' }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                   <el-tag :type="spu?.status === '上架' ? 'success' : 'info'">{{ spu?.status }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="分类">{{ spu?.category?.name || '-' }}</el-descriptions-item>
                <el-descriptions-item label="品牌">{{ spu?.brand?.name || '-' }}</el-descriptions-item>
                <el-descriptions-item label="ID">{{ spuId }}</el-descriptions-item>
                <el-descriptions-item label="描述" :span="3">{{ spu?.description || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="group-card">
        <template #header>
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
            <span>SKU 属性管理</span>
            <div>
              <el-button size="small" @click="openKeyDialog()">新增属性键</el-button>
            </div>
          </div>
        </template>
        <div class="group-body">
          <div v-if="attrKeys.length === 0">
            <el-empty description="暂无属性键" />
          </div>
          <div v-else>
            <el-card v-for="k in attrKeys" :key="k.id" class="attr-card" shadow="never">
              <template #header>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <b>{{ k.name }}</b>
                    <span style="margin-left:8px;color:var(--el-text-color-secondary);">({{ k.key }})</span>
                  </div>
                  <div>
                    <el-button size="small" @click="openValueDialog(k.id)">新增值</el-button>
                    <el-button size="small" @click="openKeyDialog(k)">编辑</el-button>
                    <el-button size="small" type="danger" @click="removeKey(k.id)">删除</el-button>
                  </div>
                </div>
              </template>
              <el-table :data="k.values || []" style="width:100%" size="small">
                <el-table-column prop="value" label="值" width="180" />
                <el-table-column prop="value_id" label="值ID" width="200" />
                <el-table-column label="操作" width="200" align="center">
                  <template #default="{ row }">
                    <el-button size="small" @click="openValueDialog(k.id, row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="removeValue(row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </el-card>

      <el-card class="group-card">
        <template #header>
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
            <span>SKU 列表</span>
            <el-button type="primary" size="small" @click="openGenerate">生成 SKU</el-button>
            <el-button size="small" @click="generateDefaultSku" :loading="genDefaultLoading">生成默认 SKU</el-button>
          </div>
        </template>
        <div class="group-body">
          <el-table :data="skuList" style="width:100%" row-key="id">
            <el-table-column prop="id" label="ID" width="160">
              <template #default="{ row }">
                <el-tooltip :content="row.id" placement="top">
                  <span class="ellipsis w-140">{{ row.id }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="sku_code" label="编码" width="160">
              <template #default="{ row }">
                <el-tooltip :content="row.sku_code" placement="top">
                  <span class="ellipsis w-140">{{ row.sku_code }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="属性" min-width="240">
              <template #default="{ row }">
                <span v-if="row.attributes && row.attributes.length">
                  {{ row.attributes.map((a:any)=>`${a.key_name||a.key_id}:${a.value||a.value_id}`).join(' / ') }}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="150">
              <template #default="{ row }">
                <el-input v-model="row.price" size="small" @change="saveRow(row)" />
              </template>
            </el-table-column>
            <el-table-column label="库存" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.stock" :min="0" size="small" @change="saveRow(row)" />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-select 
                  :model-value="getStatusValue(row.status)" 
                  @update:model-value="(val) => { row.status = val; saveRow(row) }"
                  size="small" 
                  style="width:110px"
                >
                  <el-option label="上架" value="ON_SHELF" />
                  <el-option label="下架" value="OFF_SHELF" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="{ row }">
                <el-button size="small" @click="saveRow(row)">保存</el-button>
                <el-button size="small" type="danger" @click="delRow(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </template>

    <el-dialog title="生成 SKU" v-model="genVisible" width="60%" append-to-body>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-card shadow="never">
            <template #header>选择属性</template>
            <div v-for="k in attrKeys" :key="k.id" style="margin-bottom:10px;">
              <div style="font-weight:600;margin-bottom:6px;">{{ k.name }}</div>
              <div v-if="!k.values || k.values.length === 0" style="color:#999;font-size:12px;">
                (暂无属性值，请先在下方“SKU 属性管理”中添加)
              </div>
              <el-checkbox-group v-else v-model="selected[k.id]">
                <el-checkbox v-for="v in (k.values||[])" :key="v.id" :value="v.id">
                  {{ v.value }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never">
            <template #header>基础参数</template>
            <el-form :model="genForm" label-width="90px">
              <el-form-item label="基础价格"><el-input v-model="genForm.price" /></el-form-item>
              <el-form-item label="基础库存"><el-input-number v-model="genForm.stock" :min="0" /></el-form-item>
            </el-form>
            <div style="margin-top:10px;">
              <el-button size="small" @click="previewCombos">预览组合</el-button>
              <div style="margin-top:8px; color: var(--el-text-color-secondary);">将生成 {{ preview.length }} 个 SKU</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="genVisible=false">取消</el-button>
        <el-button type="primary" @click="doGenerate">生成</el-button>
      </template>
    </el-dialog>
    
    <el-dialog :title="keyForm.id ? '编辑属性键' : '新增属性键'" v-model="keyVisible" width="40%" append-to-body>
    <el-form :model="keyForm" label-width="90px">
      <el-form-item label="名称"><el-input v-model="keyForm.name" /></el-form-item>
      <el-form-item label="必选"><el-switch v-model="keyForm.required" /></el-form-item>
      <el-alert v-if="keyForm.key" type="info" :closable="false" style="margin-top: 10px;">
        <template #title>键名：{{ keyForm.key }}（由系统自动生成）</template>
      </el-alert>
    </el-form>
    <template #footer>
      <el-button @click="keyVisible=false">取消</el-button>
      <el-button type="primary" @click="saveKey">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog :title="valForm.id ? '编辑属性值' : '新增属性值'" v-model="valVisible" width="40%" append-to-body>
    <el-form :model="valForm" label-width="90px">
      <el-form-item label="值"><el-input v-model="valForm.value" /></el-form-item>
      <el-alert v-if="valForm.value_id" type="info" :closable="false" style="margin-top: 10px;">
        <template #title>值ID：{{ valForm.value_id }}（由系统自动生成）</template>
      </el-alert>
    </el-form>
    <template #footer>
      <el-button @click="valVisible=false">取消</el-button>
      <el-button type="primary" @click="saveValue">保存</el-button>
    </template>
  </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUploadFileUrl } from '@/utils/file'
import type { ProductSpu } from '@/api/product/spu.d'
import { getSpuById, getSpuList } from '@/api/product/spu'
import type { ProductSku, UpdateProductSkuDto } from '@/api/product/sku.d'
import { getSkuList, updateSku, deleteSku, generateSkus } from '@/api/product/sku'
import { getAttributeKeys, createAttributeKey, updateAttributeKey, deleteAttributeKey, createAttributeValue, updateAttributeValue, deleteAttributeValue } from '@/api/product/attribute'
import type { ProductAttributeKey } from '@/api/product/attribute.d'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const spuId = ref((route.query.spuId as string) || '')
const spu = ref<ProductSpu>()
const skuList = ref<ProductSku[]>([])
const genVisible = ref(false)
const genForm = ref<{ price: string; stock: number }>({ price: '0', stock: 0 })
const attrKeys = ref<ProductAttributeKey[]>([])
const selected = ref<Record<string, string[]>>({})
const preview = ref<any[]>([])

const spuOptions = ref<ProductSpu[]>([])
const spuLoading = ref(false)

// 远程搜索 SPU
const fetchSpuOptions = async (query: string) => {
  spuLoading.value = true
  try {
    const params: any = { page: 1, limit: 20 }
    if (query) {
      params.filters = { name: { like: query } }
    }
    const res: any = await getSpuList(params)
    if (res?.code === 0) {
      spuOptions.value = res.data?.items || []
    }
  } finally {
    spuLoading.value = false
  }
}

// 切换 SPU
const handleSpuChange = async (val: string) => {
  // 更新 URL query
  await router.replace({ query: { ...route.query, spuId: val } })
  
  // 更新当前状态
  // spuId 已经是 v-model 绑定，所以 val 已经是新的值了，这里主要是触发重新加载
  await loadData()
}

// 加载数据逻辑封装
const loadData = async () => {
    if (!spuId.value) return
    
    // 顺便把当前选中的 SPU 放入 options，避免回显 ID
    if (spuOptions.value.length === 0) {
      // 如果 options 为空，尝试获取一下当前 SPU 详情并放入
      const res: any = await getSpuById(spuId.value)
      if (res?.code === 0) {
        spu.value = res.data
        spuOptions.value = [res.data]
      }
    } else {
      // 如果 options 有值，尝试从中找到当前 spu 更新详情
      const found = spuOptions.value.find(s => s.id === spuId.value)
      if (found) spu.value = found
      else {
         // 没找到说明可能不在当前搜索列表里，单独查一下
         const res: any = await getSpuById(spuId.value)
         if (res?.code === 0) spu.value = res.data
      }
    }
    
    // 获取 SKU 列表
    await fetchSku()
    
    // 获取属性键
    const ar: any = await getAttributeKeys(spuId.value)
    attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
    selected.value = Object.fromEntries(attrKeys.value.map(k => [k.id, []]))
}

onMounted(async () => {
  // 初始加载 SPU 列表方便选择
  await fetchSpuOptions('')
  
  if (spuId.value) {
    await loadData()
  }
})

async function fetchSku() {
  const res: any = await getSkuList({ filters: { spu_id: { eq: spuId.value } } })
  skuList.value = (res?.code === 0 ? res.data?.items : []) || []
}

// 状态转换：中文转英文（用于提交）
function convertStatusToEnglish(status: string): 'ON_SHELF' | 'OFF_SHELF' {
  const statusMap: Record<string, 'ON_SHELF' | 'OFF_SHELF'> = {
    '上架': 'ON_SHELF',
    '下架': 'OFF_SHELF',
  }
  return statusMap[status] || (status as 'ON_SHELF' | 'OFF_SHELF')
}

// 状态转换：英文转中文（用于显示）
function convertStatusToChinese(status: string): string {
  const statusMap: Record<string, string> = {
    'ON_SHELF': '上架',
    'OFF_SHELF': '下架',
  }
  return statusMap[status] || status
}

// 获取状态下拉框的值（如果是中文则转换为英文）
function getStatusValue(status: string): 'ON_SHELF' | 'OFF_SHELF' {
  if (status === '上架') return 'ON_SHELF'
  if (status === '下架') return 'OFF_SHELF'
  return status as 'ON_SHELF' | 'OFF_SHELF'
}

async function saveRow(row: ProductSku) {
  const payload: UpdateProductSkuDto = {
    price: row.price,
    stock: row.stock,
    status: convertStatusToEnglish(row.status),
    sku_name: row.sku_name,
  }
  await updateSku(row.id, payload)
  // 重新加载数据以获取最新的中文状态
  await fetchSku()
}

async function delRow(row: ProductSku) {
  await deleteSku(row.id)
  await fetchSku()
}

function openGenerate() { genVisible.value = true }
function cartesian<T>(arr: T[][]): T[][] { return arr.reduce<T[][]>((a, b) => a.flatMap(x => b.map(y => [...x, y])), [[]]) }
function previewCombos() {
  const groups: string[][] = []
  for (const k of attrKeys.value) {
    const s = selected.value[k.id] || []
    if (s.length) groups.push(s)
    else if (k.required) { preview.value = []; return }
  }
  if (!groups.length) { preview.value = []; return }
  preview.value = cartesian(groups)
}
async function doGenerate() {
  if (!spuId.value) return
  if (!preview.value.length) previewCombos()
  const items = preview.value.map((combo: string[]) => {
    // 用已选 value_id 组合编码与名称
    const sku_code = combo.join('-')
    const sku_name = combo.join(' ')
    return { sku_code, sku_name, price: genForm.value.price, stock: genForm.value.stock, attribute_value_ids: combo }
  })
  await generateSkus(spuId.value, items)
  genVisible.value = false
  genForm.value = { price: '0', stock: 0 }
  await fetchSku()
}


const genDefaultLoading = ref(false)

async function generateDefaultSku() {
  if (!spuId.value) return
  try {
    await ElMessageBox.confirm('生成默认 SKU 将清空当前所有 SKU，是否继续？', '提示', { type: 'warning' })
    genDefaultLoading.value = true
    const res = await generateSkus(spuId.value, [{
      sku_code: 'default',
      sku_name: '默认规格',
      price: '0',
      stock: 100,
      attribute_value_ids: [],
      is_default: true
    }])
    if ((res as any).code === 0) {
      ElMessage.success('生成成功')
      await fetchSku()
    } else {
      ElMessage.error((res as any).message || '生成失败')
    }
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  } finally {
    genDefaultLoading.value = false
  }
}

// 属性键/值管理
const keyVisible = ref(false)
const keyForm = ref<{ id?: string; name: string; key: string; required: boolean }>({ name: '', key: '', required: false })
function openKeyDialog(k?: ProductAttributeKey) {
  keyForm.value = k ? { id: k.id, name: k.name, key: k.key, required: k.required } : { name: '', key: '', required: false }
  keyVisible.value = true
}
async function saveKey() {
  if (!spuId.value) return
  if (keyForm.value.id) await updateAttributeKey(keyForm.value.id, { name: keyForm.value.name, required: keyForm.value.required })
  else await createAttributeKey({ spu_id: spuId.value, name: keyForm.value.name, required: keyForm.value.required })
  keyVisible.value = false
  const ar: any = await getAttributeKeys(spuId.value)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
  selected.value = Object.fromEntries(attrKeys.value.map(k => [k.id, []]))
}
async function removeKey(id: string) {
  await deleteAttributeKey(id)
  const ar: any = await getAttributeKeys(spuId.value)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
  selected.value = Object.fromEntries(attrKeys.value.map(k => [k.id, []]))
}

const valVisible = ref(false)
const valForm = ref<{ id?: string; attribute_key_id: string; value: string; value_id: string }>({ attribute_key_id: '', value: '', value_id: '' })
function openValueDialog(attribute_key_id: string, v?: any) {
  valForm.value = v ? { id: v.id, attribute_key_id, value: v.value, value_id: v.value_id } : { attribute_key_id, value: '', value_id: '' }
  valVisible.value = true
}
async function saveValue() {
  if (valForm.value.id) await updateAttributeValue(valForm.value.id, { value: valForm.value.value })
  else await createAttributeValue({ attribute_key_id: valForm.value.attribute_key_id, value: valForm.value.value })
  valVisible.value = false
  const ar: any = await getAttributeKeys(spuId.value)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
}
async function removeValue(id: string) {
  await deleteAttributeValue(id)
  const ar: any = await getAttributeKeys(spuId.value)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
}
</script>

<style scoped>
.root { padding: 12px; }
.header { display: flex; align-items: center; gap: 20px; margin-bottom: 12px; }
.title { font-weight: 600; font-size: 18px; }
.group-card { margin-bottom: 12px; }
.card-header { font-weight: 600; }
.attr-card { margin-bottom: 10px; }
.ellipsis { display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom; }
.w-140 { max-width: 140px; }
.spu-select { flex: 1; max-width: 400px; }
</style>
