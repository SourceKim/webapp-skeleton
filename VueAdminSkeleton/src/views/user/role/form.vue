<template>
    <div class="role-form">
      <el-scrollbar class="m-form-scroll">
        <m-form
          ref="formRef"
          :colspan="12"
          :columns="formColumns"
          :model="formData"
          :handleType="handleType"
          :loading="formLoading"
        >
          <!-- 权限选择插槽 -->
          <template #role-permissions-form>
            <RolePermissionForm 
              v-model="rolePermissionIds" 
              :handle-type="handleType"
              :role-id="props.modelValue?.id"
            />
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
  
  import { computed, ref, type PropType, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'
  import { createRole, updateRole, assignPermissionsToRole } from '@/api/user/role'
  import type { CreateAndUpdateRoleQueryDto } from '@/api/user/role.d'
  import type { CommonFormColumn } from '@/components/interface/form'
  import { formColumnTypes } from '@/components/utils/form-helpers'
  import mForm from '@/components/form/index.vue'
  import RolePermissionForm from '../components/RolePermissionForm.vue'
  import type { RoleTableRow, FormHandleType } from '../types'
  
  const { t } = useI18n()
  const emit = defineEmits<{
    close: [needRefresh: boolean]
  }>()
  
  // 外部传入的参数
  const props = defineProps({
    // 1. 处理类型，增、改、查
    handleType: {
      type: String as PropType<FormHandleType>,
      default: 'add' as FormHandleType
    },
    // 表单数据，主要是用到 id
    modelValue: {
      type: Object as PropType<RoleTableRow | null>
    }
  })

  const formColumns = computed<CommonFormColumn<CreateAndUpdateRoleQueryDto>[]>(() => [
    formColumnTypes.input<CreateAndUpdateRoleQueryDto>({
      prop: 'name',
      label: '名称',
      rules: { required: true }
    }),
    formColumnTypes.textarea<CreateAndUpdateRoleQueryDto>({
      prop: 'description',
      label: '描述'
    }),
    // 添加分隔符和权限选择
    {
      type: 'separator',
      label: t('view.role.permissions'),
      hidden: false
    },
    {
      slotName: 'role-permissions-form',
      hidden: false
    }
  ])
  
  const formData = ref<CreateAndUpdateRoleQueryDto>({
    name: '',
    description: ''
  }) // 表单数据
  const formLoading = ref(false) // 表单加载状态
  const saveLoading = ref(false) // 保存加载状态
  const formRef = ref()
  const rolePermissionIds = ref<string[]>([]) // 角色权限ID列表

  // 将外部传入的 modelValue 赋值给 formData
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      formData.value = {
        name: newValue.name,
        description: newValue.description || ''
      }
    }
  }, { immediate: true })
  
  function close(needRefresh: boolean) {
    emit('close', needRefresh)
  }
  
  async function save() {
    console.log('save', props.handleType)
    try {
      const formResult = await formRef.value.submit() as CreateAndUpdateRoleQueryDto
      
      if (props.handleType === 'add') {
        // 创建角色
        const roleResponse = await createRole(formResult, {
          loadingRef: saveLoading,
          showSuccessMsg: false
        })
        
        // 如果有权限需要分配，则分配权限
        if (rolePermissionIds.value.length > 0 && roleResponse.data) {
          await assignPermissionsToRole(roleResponse.data.id, rolePermissionIds.value, {
            showSuccessMsg: false
          })
        }
        
        // 显示成功消息
        ElMessage.success(t('common.saveSuccess'))
        close(true)
        
      } else if (props.handleType === 'edit' && props.modelValue?.id) {
        // 更新角色基本信息
        await updateRole(props.modelValue.id, formResult, {
          loadingRef: saveLoading,
          showSuccessMsg: false
        })
        
        // 分配权限（这里简化处理，直接重新分配所有权限）
        await assignPermissionsToRole(props.modelValue.id, rolePermissionIds.value, {
          showSuccessMsg: false
        })
        
        // 显示成功消息
        ElMessage.success(t('common.saveSuccess'))
        close(true)
      }
      
    } catch (error) {
      console.error('保存角色失败:', error)
      ElMessage.error(t('common.saveFailed'))
    }
  }
  
  </script>
  
  <style scoped lang="scss">
  .role-form {
    height: 100%;
    display: flex;
    flex-direction: column;
  
    .m-form-scroll {
      flex-grow: 1;
      padding-right: 10px;
      margin-right: -10px;
    }
  }
  </style>
  