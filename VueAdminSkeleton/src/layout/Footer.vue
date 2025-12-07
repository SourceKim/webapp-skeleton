<template>
  <div class="footer-view">
    <div class="footer">
      <el-text>Released under the Apache License 2.0</el-text>
      <el-text v-if="copyrightText">{{ copyrightText }}</el-text>
      <el-text v-if="icpCode" class="hover-view" @click="windowOpen('https://beian.miit.gov.cn/')">{{ icpCode }}</el-text>
      <el-text
        v-if="psbCode"
        class="hover-view"
        @click="windowOpen(`https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${psbCode}`)"
      >
        <img src="@/assets/image/jinghui.png" style="width: 1.2em; margin-right: 5px" alt="" />
        {{ icpCode ? icpCode.substring(0, 1) : '' }}公网安备{{ psbCode }}号
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ENV } from '@/utils/env'

defineOptions({
  name: 'LayoutFooter'
})

// ICP备案号 - 从环境变量读取
const icpCode = ENV.ICP_CODE || ''
// 公安备案号 - 从环境变量读取
const psbCode = ENV.PSB_CODE || ''
// 版权信息 - 从环境变量读取
const copyrightYear = ENV.COPYRIGHT_YEAR || ''
const copyrightOwner = ENV.COPYRIGHT_OWNER || ''
const copyrightText = copyrightYear && copyrightOwner 
  ? `Copyright © ${copyrightYear}-present ${copyrightOwner}`
  : ''

function windowOpen(url: string) {
  globalThis.open(url)
}
</script>

<style scoped lang="scss">
:deep(.el-text) {
  font-size: 12px;
}

.footer-view {
  text-align: center;
  font-size: 12px;

  .footer {
    border-radius: 3px;
    margin: 0 10px;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    grid-column-gap: 15px;
    grid-row-gap: 5px;
  }
}

.hover-view {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
