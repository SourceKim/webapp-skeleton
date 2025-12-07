<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div class="avatar">
      <el-avatar shape="circle" :size="26" fit="cover" :src="avatar" />
      <div class="username">{{ authStore.user?.name }}</div>
      <el-drawer
        style="min-width: min(90vw, 500px)"
        append-to-body
        v-model="drawerVisible"
        :title="$t('system.user.role')"
        direction="rtl"
      >
        <div v-for="(item, i) in authStore.orgRoles" :key="i" class="role-item">
          <el-text> {{ item.orgName }} -- {{ item.roleName }}</el-text>
          <div>
            <el-tag v-if="item.active" class="ml-2" type="success">{{ $t('layout.activeRole') }}</el-tag>
            <el-link v-else type="primary" @click="switchRole(item)">{{ $t('common.switch') }}</el-link>
          </div>
        </div>
      </el-drawer>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="user" icon="User">{{ $t('layout.personalCenter') }}</el-dropdown-item>
        <el-dropdown-item command="switchRole" icon="Switch">{{ $t('layout.switchRole') }}</el-dropdown-item>
        <el-dropdown-item command="logout" icon="SwitchButton">
          <span style="color: red">{{ $t('layout.logout') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import { logout } from '@/api/auth'
import defaultAvatar from '@/assets/image/avatar-default.png'
import { computed, ref } from 'vue'
import { getUploadFileUrl } from '@/utils/file'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ENV } from '@/utils/env'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const avatar = computed(() => {
  if (authStore.user?.avatar)
    return getUploadFileUrl(authStore.user?.avatar)
  return defaultAvatar
})

const drawerVisible = ref(false)

function handleCommand(key) {
  if (key === 'user') {
    router.push(`/${ENV.LAYOUT_ROUTE_NAME}/personal-center`)
  }
  if (key === 'switchRole') {
    drawerVisible.value = true
  }
  if (key === 'logout') {
    logout({
      showSuccessMsg: true,
      successMsg: t('system.login.logoutSuccess')
    }).then(() => {
      console.log('退出登录')
      setTimeout(authStore.logout, 1000)
    })
  }
}

//角色切换
function switchRole(orgRole) {
  authStore.switchRole(orgRole).then(() => {
    drawerVisible.value = false
  })
}
</script>
<style scoped lang="scss">
.avatar {
  height: 100%;
  display: flex;
  align-items: center;

  .username {
    font-size: 14px;
    margin-left: 10px;
  }
}

.role-item {
  display: flex;
  justify-content: space-between;
  padding: 5px;
}
</style>
