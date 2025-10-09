<template>
    <div class="material-tags-form">
      <el-scrollbar class="m-form-scroll">
        <m-form
          ref="formRef"
          :colspan="12"
          :columns="handleType === 'add' ? formColumns : formColumns"
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
  
  import MForm from '@/components/form/index.vue'
  import { computed, ref, type PropType } from 'vue'
  import { createMaterialTag, updateMaterialTag } from '@/api/material/material-tags'
  import type { CreateUpdateMaterialTagQueryDto } from '@/api/material/material-tags.d'
  
  const emit = defineEmits<{
    (e: 'close', needRefresh: boolean): void
  }>()
  
  // 外部传入的参数
  const props = defineProps({
    // 1. 处理类型，增、改、查
    handleType: {
      type: String,
      default: 'add'
    },
      // 表单数据，主要是用到 id
    modelValue: {
      type: Object as PropType<any>
    }
  })

  const formColumns = computed(() => [
    { prop: 'name', label: '名称', type: 'input' },
    { prop: 'description', label: '描述', type: 'textarea' },
  ])
  
  const formData = ref({}) // 表单数据
  const formLoading = ref(false) // 表单加载状态
  const saveLoading = ref(false) // 保存加载状态
  const formRef = ref()

  // 将外部传入的 modelValue 赋值给 formData
  formData.value = props.modelValue
  
  function close(needRefresh: boolean) {
    emit('close', needRefresh)
  }
  
  function save() {
    console.log('save', props.handleType)
    if (props.handleType === 'add') {
      formRef.value.submit().then((res: CreateUpdateMaterialTagQueryDto) => {
        createMaterialTag(res).then((response) => {
          close(true)
        })
      })
    } else if (props.handleType === 'edit') {
      formRef.value.submit().then((res: CreateUpdateMaterialTagQueryDto) => {
        updateMaterialTag(props.modelValue.id, res).then((response) => {
            close(true)
        })
      })
    }
  }
  
  </script>
  
  <style scoped lang="scss">
  .material-tags-form {
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
  