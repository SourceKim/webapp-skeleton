<template>
  <MallContent
    :brandId="brandId"
    :enableBack="true"
    title="商城"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '@tarojs/taro'
import MallContent from '../components/MallContent.vue'

const router = useRouter()
const brandId = ref<string>('')

onMounted(() => {
  brandId.value = (router?.params?.brand_id as string) || ''
})
</script>
