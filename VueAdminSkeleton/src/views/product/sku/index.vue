<template>
  <div class="root">
    <div class="header">
      <div class="title">SKU 管理</div>
      <div class="desc">当前 SPU：{{ spuId }}</div>
    </div>

    <el-card class="group-card">
      <template #header>
        <div class="card-header">SPU 基本信息</div>
      </template>
      <div class="group-body">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="SPU ID">{{ spuId }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ spu?.name || '-' }}</el-descriptions-item>
        </el-descriptions>
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
              <el-table-column prop="color_hex" label="颜色" width="120" />
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
              <el-select v-model="row.status" size="small" style="width:110px" @change="saveRow(row)">
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

    <el-dialog title="生成 SKU" v-model="genVisible" width="60%" append-to-body>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-card shadow="never">
            <template #header>选择属性</template>
            <div v-for="k in attrKeys" :key="k.id" style="margin-bottom:10px;">
              <div style="font-weight:600;margin-bottom:6px;">{{ k.name }}</div>
              <el-checkbox-group v-model="selected[k.id]">
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
      <el-form-item label="键名"><el-input v-model="keyForm.key" /></el-form-item>
      <el-form-item label="类型">
        <el-select v-model="keyForm.type" style="width: 200px">
          <el-option label="TEXT" value="TEXT" />
          <el-option label="COLOR" value="COLOR" />
          <el-option label="IMAGE" value="IMAGE" />
        </el-select>
      </el-form-item>
      <el-form-item label="必选"><el-switch v-model="keyForm.required" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="keyVisible=false">取消</el-button>
      <el-button type="primary" @click="saveKey">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog :title="valForm.id ? '编辑属性值' : '新增属性值'" v-model="valVisible" width="40%" append-to-body>
    <el-form :model="valForm" label-width="90px">
      <el-form-item label="值"><el-input v-model="valForm.value" /></el-form-item>
      <el-form-item label="值ID"><el-input v-model="valForm.value_id" /></el-form-item>
      <el-form-item label="颜色"><el-input v-model="valForm.color_hex" placeholder="#000000" /></el-form-item>
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
import { useRoute } from 'vue-router'
import type { ProductSpu } from '@/api/product/spu.d'
import { getSpuById } from '@/api/product/spu'
import type { ProductSku, UpdateProductSkuDto } from '@/api/product/sku.d'
import { getSkuList, updateSku, deleteSku, generateSkus, createSku } from '@/api/product/sku'
import { getAttributeKeys, createAttributeKey, updateAttributeKey, deleteAttributeKey, createAttributeValue, updateAttributeValue, deleteAttributeValue } from '@/api/product/attribute'
import type { ProductAttributeKey } from '@/api/product/attribute.d'

const route = useRoute()
const spuId = (route.query.spuId as string) || ''
const spu = ref<ProductSpu>()
const skuList = ref<ProductSku[]>([])
const genVisible = ref(false)
const genForm = ref<{ price: string; stock: number }>({ price: '0', stock: 0 })
const attrKeys = ref<ProductAttributeKey[]>([])
const selected = ref<Record<string, string[]>>({})
const preview = ref<any[]>([])

onMounted(async () => {
  if (spuId) {
    const res: any = await getSpuById(spuId)
    if (res?.code === 0) spu.value = res.data
    await fetchSku()
    const ar: any = await getAttributeKeys(spuId)
    attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
    selected.value = Object.fromEntries(attrKeys.value.map(k => [k.id, []]))
  }
})

async function fetchSku() {
  const res: any = await getSkuList({ filters: { spu_id: { eq: spuId } } })
  skuList.value = (res?.code === 0 ? res.data?.items : []) || []
}

async function saveRow(row: ProductSku) {
  const payload: UpdateProductSkuDto = {
    price: row.price,
    stock: row.stock,
    status: row.status,
    sku_name: row.sku_name,
  }
  await updateSku(row.id, payload)
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
  if (!spuId) return
  if (!preview.value.length) previewCombos()
  const items = preview.value.map((combo: string[]) => {
    // 用已选 value_id 组合编码与名称
    const sku_code = combo.join('-')
    const sku_name = combo.join(' ')
    return { sku_code, sku_name, price: genForm.value.price, stock: genForm.value.stock, attribute_value_ids: combo }
  })
  await generateSkus(spuId, items)
  genVisible.value = false
  genForm.value = { price: '0', stock: 0 }
  await fetchSku()
}

// 属性键/值管理
const keyVisible = ref(false)
const keyForm = ref<{ id?: string; name: string; key: string; type: 'TEXT'|'COLOR'|'IMAGE'; required: boolean }>({ name: '', key: '', type: 'TEXT', required: false })
function openKeyDialog(k?: ProductAttributeKey) {
  keyForm.value = k ? { id: k.id, name: k.name, key: k.key, type: k.type as any, required: k.required } : { name: '', key: '', type: 'TEXT', required: false }
  keyVisible.value = true
}
async function saveKey() {
  if (!spuId) return
  if (keyForm.value.id) await updateAttributeKey(keyForm.value.id, { name: keyForm.value.name, key: keyForm.value.key, type: keyForm.value.type, required: keyForm.value.required })
  else await createAttributeKey({ spu_id: spuId, name: keyForm.value.name, key: keyForm.value.key, type: keyForm.value.type, required: keyForm.value.required })
  keyVisible.value = false
  const ar: any = await getAttributeKeys(spuId)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
  selected.value = Object.fromEntries(attrKeys.value.map(k => [k.id, []]))
}
async function removeKey(id: string) {
  await deleteAttributeKey(id)
  const ar: any = await getAttributeKeys(spuId)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
  selected.value = Object.fromEntries(attrKeys.value.map(k => [k.id, []]))
}

const valVisible = ref(false)
const valForm = ref<{ id?: string; attribute_key_id: string; value: string; value_id: string; color_hex?: string }>({ attribute_key_id: '', value: '', value_id: '' })
function openValueDialog(attribute_key_id: string, v?: any) {
  valForm.value = v ? { id: v.id, attribute_key_id, value: v.value, value_id: v.value_id, color_hex: v.color_hex } : { attribute_key_id, value: '', value_id: '' }
  valVisible.value = true
}
async function saveValue() {
  if (valForm.value.id) await updateAttributeValue(valForm.value.id, { value: valForm.value.value, value_id: valForm.value.value_id, color_hex: valForm.value.color_hex })
  else await createAttributeValue({ attribute_key_id: valForm.value.attribute_key_id, value: valForm.value.value, value_id: valForm.value.value_id, color_hex: valForm.value.color_hex })
  valVisible.value = false
  const ar: any = await getAttributeKeys(spuId)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
}
async function removeValue(id: string) {
  await deleteAttributeValue(id)
  const ar: any = await getAttributeKeys(spuId)
  attrKeys.value = (ar?.code === 0 ? ar.data : []) || []
}
</script>

<style scoped>
.root { padding: 12px; }
.header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; }
.title { font-weight: 600; font-size: 18px; }
.group-card { margin-bottom: 12px; }
.card-header { font-weight: 600; }
.attr-card { margin-bottom: 10px; }
.ellipsis { display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom; }
.w-140 { max-width: 140px; }
</style>


