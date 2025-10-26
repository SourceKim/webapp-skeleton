<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <!-- 表单 -->
      <m-form
        ref="formRef"
        :colspan="handleType === 'detail' ? 12 : 24"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      >
        <!-- 插槽 -->
        <template #user-permission-form>
          <UserPermissionForm v-model="userRoleIds" :handle-type="handleType" />
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType)"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ $t('common.save') }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, watchEffect, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUser, updateUser, createUser } from '@/api/user/user'
import { register } from '@/api/auth'
import type { User, CreateUserDto, RegisterDto, AdminUpdateUserDto } from '@/api/types/user'
import type { CommonFormColumn, FormHandleType } from '@/components/interface/form'
import mForm from '@/components/form/index.vue'
import UserPermissionForm from './components/UserPermissionForm.vue'

const props = defineProps({
  // 处理类型，增、改、查
  handleType: {
    type: String as PropType<FormHandleType>,
    default: 'add'
  },
  // 表单数据，主要是用到 id
  modelValue: {
    type: Object as PropType<{ id: string }>
  }
})

const { t } = useI18n()

const emit = defineEmits<{
  //恢复默认
  (e: 'close', type: 'refresh' | string): void
}>()

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref<User>({
  id: '',
  username: '',
  email: '',
  phone: '',
  nickname: '',
  avatar: '',
  bio: '',
  status: 'active',
  created_at: '',
  updated_at: '',
  roles: []
})

const userRoleIds = ref<string[]>([])



// 如果不是添加用户，则请求一次用户信息
if (props.handleType !== 'add') {
  // 查询明细
  formLoading.value = true
  getUser(props.modelValue!.id!).then(res => {
    formData.value = { ...formData.value, ...res.data! }
    // 回显保留字符串，由 Upload.vue 负责将字符串转成可预览的图片 URL
    userRoleIds.value = (res.data as any)?.roles?.map((role: any) => role.id) || []
    formLoading.value = false
  })
}

// 表单列定义
const columns = ref<CommonFormColumn<any>[]>([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'id',
      label: t('common.id'),
      rules: [{ required: true }],
      hidden: props.handleType === 'add'
    },
    { prop: 'username', label: t('view.user.username'), rules: { required: true } },
    { prop: 'email', label: t('view.user.email'), rules: { type: 'email' } },
    { prop: 'phone', label: t('view.user.phone'), rules: { type: 'phone' } },
    { prop: 'nickname', label: t('view.user.nickname'), rules: { required: true } },
    // 详情使用图片展示，新增/编辑使用上传组件
    props.handleType === 'detail'
      ? { prop: 'avatar', label: t('view.user.avatar'), type: 'image' }
      : { prop: 'avatar', label: t('view.user.avatar'), type: 'upload-img', single: 'object' },
    { prop: 'bio', label: t('view.user.bio') },
    { prop: 'status', label: t('common.status'), type: 'select', itemList: [{ label: 'active', value: 'active' }, { label: 'inactive', value: 'inactive' }] },
    {
      prop: 'password',
      label: t('view.user.password'),
      autocomplete: 'new-password',
      hidden: props.handleType !== 'add',
      rules: [{ required: true }]
    },
    { type: 'separator', label: t('view.user.permission'), hidden: false },
    { slotName: 'user-permission-form', hidden: false },
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then((formResult: any) => {
    if (props.handleType === 'add') {
      // 新增模式：调用注册接口
      const registerData: RegisterDto = {
        username: formResult.username,
        password: formResult.password,
        email: formResult.email,
        phone: formResult.phone,
        nickname: formResult.nickname,
        avatar: formResult.avatar,
        bio: formResult.bio
      }
      
      register(registerData, {
        loadingRef: saveLoading,
        showSuccessMsg: true,
        successMsg: t('view.user.registerSuccess')
      }).then((response) => {
        // 注册成功后，如果需要为用户分配角色，调用角色分配接口
        if (userRoleIds.value.length > 0 && response.data?.id) {
          import('@/api/user/user').then(({ assignRolesToUser }) => {
            assignRolesToUser(response.data!.id, userRoleIds.value, {
              showSuccessMsg: true,
              successMsg: t('view.user.assignRolesSuccess')
            }).then(() => close('refresh'))
          })
        } else {
          close('refresh')
        }
      })
    } else {
      // 编辑模式：调用更新接口
      const submitData = { ...formResult, roles: userRoleIds.value }
      updateUser(formData.value.id, submitData as AdminUpdateUserDto, {
        loadingRef: saveLoading,
        showSuccessMsg: true,
        successMsg: t('common.saveSuccess')
      }).then(() => close('refresh'))
    }
  })
}

function close(type?: any) {
  emit('close', type)
}
</script>
<style lang="scss" scoped>
.form-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;
  }

  .user-roles {
    width: 100%;
  }
}
</style>
