<template>
  <div class="role-permission-form">
    <el-form-item :label="t('view.role.permissions')">
      <!-- 权限搜索框 -->
      <div class="permission-search mb-3">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('view.role.searchPermissions')"
          prefix-icon="search"
          clearable
          @input="handleSearch"
        />
      </div>
      
      <!-- 权限选择区域 -->
      <div class="permission-selection">
        <el-row :gutter="20">
          <!-- 可用权限列表 -->
          <el-col :span="11">
            <div class="permission-list">
              <div class="list-header">
                <span>{{ t('view.role.availablePermissions') }}</span>
                <el-button 
                  size="small" 
                  type="primary" 
                  :disabled="selectedAvailable.length === 0"
                  @click="assignSelected"
                >
                  {{ t('view.role.assign') }} →
                </el-button>
              </div>
              <div class="list-content">
                <el-checkbox-group v-model="selectedAvailable">
                  <div
                    v-for="permission in filteredAvailablePermissions"
                    :key="permission.id"
                    class="permission-item"
                  >
                    <el-checkbox :label="permission.id">
                      <div class="permission-info">
                        <div class="permission-name">{{ permission.name }}</div>
                        <div class="permission-desc">{{ permission.resource }}:{{ permission.action }}</div>
                      </div>
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </el-col>
          
          <!-- 中间操作按钮 -->
          <el-col :span="2" class="text-center">
            <div class="operation-buttons">
              <el-button
                size="small"
                type="success"
                :disabled="availablePermissions.length === 0"
                @click="assignAll"
              >
                {{ t('view.role.assignAll') }} →
              </el-button>
              <el-button
                size="small"
                type="warning"
                :disabled="assignedPermissions.length === 0"
                @click="removeAll"
              >
                ← {{ t('view.role.removeAll') }}
              </el-button>
            </div>
          </el-col>
          
          <!-- 已分配权限列表 -->
          <el-col :span="11">
            <div class="permission-list">
              <div class="list-header">
                <el-button 
                  size="small" 
                  type="danger" 
                  :disabled="selectedAssigned.length === 0"
                  @click="removeSelected"
                >
                  ← {{ t('view.role.remove') }}
                </el-button>
                <span>{{ t('view.role.assignedPermissions') }}</span>
              </div>
              <div class="list-content">
                <el-checkbox-group v-model="selectedAssigned">
                  <div
                    v-for="permission in assignedPermissions"
                    :key="permission.id"
                    class="permission-item"
                  >
                    <el-checkbox :label="permission.id">
                      <div class="permission-info">
                        <div class="permission-name">{{ permission.name }}</div>
                        <div class="permission-desc">{{ permission.resource }}:{{ permission.action }}</div>
                      </div>
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPermissions } from '@/api/user/permission'
import { getRoleDetail } from '@/api/user/role'
import type { Permission } from '@/api/user/permission.d'
import type { RolePermissionFormProps } from '../types'

const props = defineProps<RolePermissionFormProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const { t } = useI18n()

// 响应式数据
const allPermissions = ref<Permission[]>([])
const assignedPermissions = ref<Permission[]>([])
const selectedAvailable = ref<string[]>([])
const selectedAssigned = ref<string[]>([])
const searchKeyword = ref('')
const loading = ref(false)

// 计算属性
const availablePermissions = computed(() => {
  const assignedIds = new Set(assignedPermissions.value.map(p => p.id))
  return allPermissions.value.filter(p => !assignedIds.has(p.id))
})

const filteredAvailablePermissions = computed(() => {
  if (!searchKeyword.value) return availablePermissions.value
  const keyword = searchKeyword.value.toLowerCase()
  return availablePermissions.value.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.resource.toLowerCase().includes(keyword) ||
    p.action.toLowerCase().includes(keyword) ||
    (p.description && p.description.toLowerCase().includes(keyword))
  )
})

// 方法
async function loadAllPermissions() {
  try {
    loading.value = true
    const response = await getPermissions()
    allPermissions.value = response.data?.items || []
  } catch (error) {
    console.error('获取权限列表失败:', error)
  } finally {
    loading.value = false
  }
}

async function loadRolePermissions() {
  if (!props.roleId || props.handleType === 'add') return
  
  try {
    const response = await getRoleDetail(props.roleId)
    assignedPermissions.value = response.data?.permissions || []
    updateModelValue()
  } catch (error) {
    console.error('获取角色权限失败:', error)
  }
}

function updateModelValue() {
  const permissionIds = assignedPermissions.value.map(p => p.id)
  emit('update:modelValue', permissionIds)
}

function assignSelected() {
  const toAssign = allPermissions.value.filter(p => selectedAvailable.value.includes(p.id))
  assignedPermissions.value.push(...toAssign)
  selectedAvailable.value = []
  updateModelValue()
}

function removeSelected() {
  assignedPermissions.value = assignedPermissions.value.filter(p => !selectedAssigned.value.includes(p.id))
  selectedAssigned.value = []
  updateModelValue()
}

function assignAll() {
  assignedPermissions.value = [...allPermissions.value]
  updateModelValue()
}

function removeAll() {
  assignedPermissions.value = []
  updateModelValue()
}

function handleSearch() {
  // 搜索逻辑在 computed 中处理
}

// 监听器
watch(() => props.roleId, (newRoleId) => {
  if (newRoleId) {
    loadRolePermissions()
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  loadAllPermissions()
})
</script>

<style scoped lang="scss">
.role-permission-form {
  .permission-search {
    margin-bottom: 16px;
  }

  .permission-selection {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 16px;
    background-color: #fafafa;

    .permission-list {
      height: 400px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background-color: white;

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background-color: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        font-weight: 500;
      }

      .list-content {
        height: calc(100% - 45px);
        overflow-y: auto;
        padding: 8px;

        .permission-item {
          padding: 6px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .permission-info {
            margin-left: 8px;

            .permission-name {
              font-weight: 500;
              color: #303133;
            }

            .permission-desc {
              font-size: 12px;
              color: #909399;
              margin-top: 2px;
            }
          }
        }
      }
    }

    .operation-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      justify-content: center;
      height: 400px;
    }
  }
}

.text-center {
  text-align: center;
}

.mb-3 {
  margin-bottom: 12px;
}
</style> 