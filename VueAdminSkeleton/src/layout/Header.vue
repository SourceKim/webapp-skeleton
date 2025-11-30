<template>
    <div
      class="header-view"
      :class="{
        'width-shrink-layout': layoutStore.widthShrink,
        'height-shrink-layout': layoutStore.heightShrink
      }"
    >
      <div class="header-top">
        <div class="header-left">
          <div class="nav-view">
            <ToggleMenu class="collapse-icon" />
            <NavTabs
              v-if="layoutStore.heightShrink && !layoutStore.widthShrink"
              key="nav-tabs"
            />
            <Breadcrumb v-if="!layoutStore.widthShrink" class="breadcrumb" />
          </div>
        </div>
        <el-link v-if="!layoutStore.widthShrink && isDev" style="margin-right: 10px" @click="cp">
          {{ route.meta.component }}
        </el-link>
        <Action class="action" />
      </div>
      <NavTabs v-if="!layoutStore.heightShrink" key="nav-tabs"/>
    </div>
  </template>
  <script setup lang="ts">

import { useLayoutStore } from '@/stores/layout'

  import Action from '@/layout/Action/index.vue'
  import NavTabs from '@/layout/NavTabs/index.vue'
  import Breadcrumb from '@/layout/Breadcrumb.vue'
  import { useRoute } from 'vue-router'
  import { useClipboard, usePermission } from '@vueuse/core'
  import { ElMessage } from 'element-plus'
  import ToggleMenu from '@/layout/ToggleMenu.vue'
  

  defineOptions({
    name: 'DefaultHeader'
  })
  const { copy } = useClipboard()
  usePermission('clipboard-write')
  
  function cp() {
    copy(route.meta.component as string).then(() => {
      console.info('恭喜你！你发现了这个贴心的小功能~👻🏀🐔')
      ElMessage({
        type: 'success',
        message: '已复制到剪切板'
      })
    })
  }
  
  const isDev = import.meta.env.DEV
  const layoutStore = useLayoutStore()
  const route = useRoute()
  </script>
  <style scoped lang="scss">
  .header-view {
    .header-top {
      padding: 5px 10px;
      display: flex;
      align-items: center;
  
      .collapse-icon {
        margin-right: 15px;
        cursor: pointer;
        z-index: 2;
        flex-shrink: 0;
        color: var(--el-text-color-primary);
        font-size: 18px; /* 增大图标使其更易点击 */
      }

      .header-left {
        flex-grow: 1;
        min-width: 0; /* 修复 width: 0 可能导致的问题 */

        .nav-view {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
  
      .action {
        flex-shrink: 0;
        box-shadow: none;
      }
    }
  
    .nav-tabs {
      margin-top: 5px;
      width: 100%;
    }
  }
  
.width-shrink-layout {
  .header-top {
    padding: 5px;
    
    .collapse-icon {
      margin-right: 5px;
    }
  }
}

.width-shrink-layout,
.height-shrink-layout {
    .nav-tabs {
      font-size: 12px;
    }
  }
  </style>
  