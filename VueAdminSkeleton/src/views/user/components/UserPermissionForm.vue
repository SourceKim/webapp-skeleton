<template>
  <div class="user-permission-form">
    <el-form-item :label="t('view.user.roles')">
      <el-select 
        v-model="localRoles" 
        multiple 
        placeholder="请选择用户角色" 
        style="width: 100%"
        @change="handleRoleChange"
      >
        <el-option
          v-for="role in availableRoles"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRoles } from '@/api/user/role'

const props = defineProps<{
  modelValue: string[]
  handleType: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const { t } = useI18n()
const localRoles = ref<string[]>([])
const availableRoles = ref<any[]>([])

// 获取可用角色列表
onMounted(async () => {
  try {
    const rolesResponse = await getRoles({})
    availableRoles.value = rolesResponse.data?.items || []
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
})

// 监听外部传入的值
watch(() => props.modelValue, (newVal) => {
  localRoles.value = newVal || []
}, { immediate: true })

// 处理角色变化
function handleRoleChange(value: string[]) {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.user-permission-form {
  width: 100%;
}
</style> 