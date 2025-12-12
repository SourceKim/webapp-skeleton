
<template>
  <ElForm
  ref="formRef"
  v-bind="{...attrs, ...props}"
  :disabled="props.handleType == 'detail'"
  >
  <template #default>
    <template v-for="item in formItemParams" :key="item.column.prop || item.column.type">
      <el-col v-if="!item.hidden && item.column.type === 'separator'" :span="24" class="separator">
        <div class="form-item-label">
          <div>{{ item.column.label }}</div>
        </div>
      </el-col>
      <el-col v-else-if="!item.hidden && item.column.slotName">
        <slot :name="item.column.slotName"></slot>
      </el-col>
      <el-col v-else-if="!item.hidden" :span="getColSpan(item)">
        <el-form-item class="form-item" v-bind="item.formItemParams" >
          <template #default>
            <component class="form-input" :is="item.renderArgs?.component" v-bind="getFormItemParams(item)">
              <!-- 渲染 slots, 比如 el-select 的 options -->
              <template v-for="slotFunc, slotName in item.renderArgs?.slots" #[slotName]="scope">
                <component 
                  :is="child" 
                  v-for="(child, idx) in slotFunc(scope)" 
                  :key="idx"
                />
              </template>
            </component>
          </template>
          <template #label>
            <div class="form-item-label">
              <div>{{ item.column.label }}</div>
            </div>
          </template>
        </el-form-item>
      </el-col>
    </template>
  </template>

  </ElForm>
</template>
<script lang="ts" setup generic="T extends Record<string, any> = Record<string, any>">
import { provide, ref, shallowRef, useAttrs, watchEffect } from 'vue'
import { generateDynamicColumn, generateFormRules, generatePlaceholder, vModelValue } from '@/components/mutils'
import { useElementSize } from '@vueuse/core'
import type { UploadCtx } from '@/components/upload/Upload.vue'
import { type CommonFormColumn, mFormEmits } from '@/components/interface/form'
import { useLayoutStore } from '@/stores/layout'
import { ElForm, ElFormItem, ElCol } from 'element-plus'

defineOptions({
  name: 'MForm',
  inheritAttrs: false,
})

interface Props {
  model: T
  columns?: CommonFormColumn<T>[]
  handleType?: string
  colspan?: number
  labelWidth?: string | number
  labelPosition?: 'top' | 'left' | 'right'
  scrollToError?: boolean
  scrollIntoViewOptions?: Record<string, any>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  handleType: 'add',
  columns: () => [],
  scrollToError: true,
  scrollIntoViewOptions: () => ({ behavior: 'smooth', block: 'center', inline: 'center' }),
  loading: false
})

const emit = defineEmits({
  ...mFormEmits,
})

defineExpose({
  clearValidate: function (...args: any) {
        return formRef.value.clearValidate(...args)
  },
  scrollToField: function (...args: any) {
        return formRef.value.scrollToField(...args)
  },
  resetFields: function (...args: any) {
        return formRef.value.resetFields(...args)
  },
  validateField: function (...args: any) {
    return formRef.value.validateField(...args)
  },
  validate: function (...args: any) {
    return formRef.value.validate(...args)
  },
  submit
})

const attrs = useAttrs()
const slots = defineSlots()

const layoutStore = useLayoutStore()
const formRef = ref()

const formSize = ref(useElementSize(formRef))
const cols = ref(0)
// 扩展的表单项类型，包含渲染参数
interface FormItemParam<T extends Record<string, any>> {
  column: CommonFormColumn<T>
  hidden?: boolean
  formItemParams: {
    key: string
    prop?: string
    label?: string
    labelWidth?: string | number
    required?: boolean
    rules?: any
  }
  renderArgs?: {
    component: any
    param: any
    slots: any
  }
}

const formItemParams = shallowRef<FormItemParam<T>[]>([])
const uploadInstances = ref<UploadCtx[]>([])

watchEffect(() => {
  let sizeWidth = 300
  if (props.labelPosition === 'top') sizeWidth -= 60
  if (layoutStore.size === 'small') sizeWidth -= 50
  cols.value = Number(Math.floor(formSize.value.width / sizeWidth)) || 1
})
watchEffect(initFormItemParams)

provide('uploadInstances', uploadInstances.value)

// 表单提交，表单验证，通过后统一上传文件
async function submit(): Promise<T> {
  if (props.loading) return Promise.reject('loading...')
  await formRef.value.validate()
  return props.model
}

function getFormItemParams(item: FormItemParam<T>) {
  const vModelParams = item.column.prop ? {
    type: item.column.type,
    prop: item.column.prop as keyof T,
    ...(item.column.prop2 && { prop2: item.column.prop2 as keyof T }),
    single: item.column.single
  } : null

  const param = {
    ...item.renderArgs?.param,
    ...(vModelParams ? vModelValue<T>(vModelParams, props.model) : {})
  }
  return param
}

function initFormItemParams() {
  formItemParams.value = props.columns?.map((i: CommonFormColumn<T>) => {
    // 隐藏的直接返回
    if (i.hidden) {
      return {
        column: i,
        hidden: true,
        formItemParams: {
          key: i.prop || i.type || ''
        }
      }
    }
    const formItemObj: FormItemParam<T> = {
      column: i,
      formItemParams: {
        key: i.prop || i.type || '',
        prop: i.prop,
        label: i.label,
        labelWidth: i.labelWidth,
        required: i.required,
        rules: generateFormRules(i, props.model)
      },
      renderArgs: generateDynamicColumn(i)
    }
    generatePlaceholder(formItemObj.renderArgs?.param)
    return formItemObj
  }) || []
}

function getColSpan(column: CommonFormColumn<T>) {
  const colspan = 24 / cols.value
  let span = column.colspan || props.colspan || colspan
  if (span < colspan) span = colspan
  if (!column.colspan && column.cols) span = Number(column.cols) * span
  span = [2, 3, 4, 6, 8, 12, 24].find((i) => i >= span) ?? 24
  return span
}
</script>
<style scoped lang="scss">
.form-item-label {
  display: inline-flex;
  align-items: center;
}

.el-col {
  padding: 0 5px;
}

.separator {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--el-text-color-regular);
  margin: 0.5em 0;
  border-bottom: var(--el-border);

  > div {
    margin-bottom: 0.5em;
  }
}
</style>
