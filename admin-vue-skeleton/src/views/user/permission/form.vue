<template>
    <div class="permission-form">
      <el-scrollbar class="m-form-scroll">
        <m-form
          ref="formRef"
          :colspan="12"
          :columns="formColumns"
          :model="formData"
          :handleType="handleType"
          :loading="formLoading"
        />
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
  
  import { computed, ref, type PropType } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { createPermission, updatePermission } from '@/api/user/permission'
  import type { CreateAndUpdatePermissionQueryDto } from '@/api/user/permission.d'
  import type { CommonFormColumn } from '@/components/interface/form'
  import { formColumnTypes } from '@/components/utils/form-helpers'
  import mForm from '@/components/form/index.vue'
  import type { PermissionTableRow, FormHandleType } from '../types'
  
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
      type: Object as PropType<PermissionTableRow | null>
    }
  })

  const formColumns = computed<CommonFormColumn<CreateAndUpdatePermissionQueryDto>[]>(() => [
    formColumnTypes.input<CreateAndUpdatePermissionQueryDto>({
      prop: 'name',
      label: '名称',
      rules: { required: true }
    }),
    formColumnTypes.input<CreateAndUpdatePermissionQueryDto>({
      prop: 'resource',
      label: '资源',
      rules: { required: true }
    }),
    formColumnTypes.input<CreateAndUpdatePermissionQueryDto>({
      prop: 'action',
      label: '操作',
      rules: { required: true }
    }),
    formColumnTypes.textarea<CreateAndUpdatePermissionQueryDto>({
      prop: 'description',
      label: '描述'
    })
  ])
  
  const formData = ref<CreateAndUpdatePermissionQueryDto>({
    name: '',
    resource: '',
    action: '',
    description: ''
  }) // 表单数据
  const formLoading = ref(false) // 表单加载状态
  const saveLoading = ref(false) // 保存加载状态
  const formRef = ref()

  // 将外部传入的 modelValue 赋值给 formData
  if (props.modelValue) {
    formData.value = {
      name: props.modelValue.name,
      resource: props.modelValue.resource,
      action: props.modelValue.action,
      description: props.modelValue.description || ''
    }
  }
  
  function close(needRefresh: boolean) {
    emit('close', needRefresh)
  }
  
  function save() {
    console.log('save', props.handleType)
    if (props.handleType === 'add') {
      formRef.value.submit().then((res: CreateAndUpdatePermissionQueryDto) => {
        createPermission(res, {
          loadingRef: saveLoading,
          showSuccessMsg: true,
          successMsg: t('common.saveSuccess')
        }).then(() => {
          close(true)
        })
      })
    } else if (props.handleType === 'edit') {
      formRef.value.submit().then((res: CreateAndUpdatePermissionQueryDto) => {
        if (props.modelValue?.id) {
          updatePermission(props.modelValue.id, res, {
            loadingRef: saveLoading,
            showSuccessMsg: true,
            successMsg: t('common.saveSuccess')
          }).then(() => {
            close(true)
          })
        }
      })
    }
  }
  
  </script>
  
  <style scoped lang="scss">
  .permission-form {
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
  