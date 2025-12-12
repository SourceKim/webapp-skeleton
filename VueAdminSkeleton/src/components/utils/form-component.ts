import type { Ref } from 'vue'
import { createVNode, isRef, ref, toRaw } from 'vue'
import {
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElUpload
} from 'element-plus'
import SingleDatePicker from '@/components/form/SingleDatePicker.vue'
import IconSelect from '@/components/form/IconSelect.vue'
import MUpload from '@/components/upload/Upload.vue'
import MNative from '@/components/form/Native.vue'
import type { CommonItemData, ItemListColumn } from '@/components/interface'
import type { CommonFormColumn } from '@/components/interface/form'

/**
 * 构造表单动态组件参数
 * @param column 表单列配置
 * @returns 组件配置对象
 */
export function generateDynamicColumn<T extends object>(column: CommonFormColumn<T>) {
  if (!column.prop) return
  
  const param: CommonFormColumn<T> = {
    clearable: true,
    ariaLabel: column.label,
    ...column
  }
  
  if (!['switch', 'radio', 'checkbox'].includes(param.type ?? '')) {
    param.style = 'width: 100%;' + (param.style ?? '')
  }
  
  const slots = { ...column.slots }

  // 没有默认插槽，给select，radio-group，checkbox-group初始化子选项
  if (!slots.default) {
    const itemParam = { ...param.itemParam }
    
    if (param.type === 'select') {
      const itemArr = getItemListRef(param)
      slots.default = () => {
        return itemArr.value.map((i) => createVNode(ElOption, { ...itemParam, ...i }))
      }
    }
    
    if (param.type === 'radio-group') {
      itemParam.border ??= true
      const itemArr = getItemListRef(param)
      slots.default = () => {
        return itemArr.value.map((i) => {
          const optionParam = { ...itemParam, ...i }
          return createVNode(ElRadio, optionParam)
        })
      }
    }
    
    if (param.type === 'checkbox-group') {
      itemParam.border ??= true
      const itemArr = getItemListRef(param)
      slots.default = () => {
        return itemArr.value.map((i) => {
          const optionParam = { ...itemParam, ...i }
          return createVNode(ElCheckbox, optionParam)
        })
      }
    }
  }

  let type: string = column.type ?? 'input'
  
  // 处理不同类型的组件映射
  if (['text', 'textarea', 'password', 'number'].includes(type)) {
    type = 'el-input'
  } else if (
    ['year', 'month', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange'].includes(type)
  ) {
    // 设置默认的格式化
    if (!param.valueFormat) {
      if (['year'].includes(type)) param.valueFormat = 'YYYY'
      if (['date', 'daterange'].includes(type)) param.valueFormat = 'YYYY-MM-DD'
      if (['datetime', 'datetimerange'].includes(type)) param.valueFormat = 'YYYY-MM-DD HH:mm:ss'
      if (['month', 'monthrange'].includes(type)) param.valueFormat = 'YYYY-MM'
    }
    type = 'el-date-picker'
  } else if (type === 'icon-select') {
    type = 'm-icon-select'
  } else if (['upload-img', 'upload-file'].includes(type)) {
    type = 'm-upload'
  } else if (!['span', 'div', 'p', 'a', 'i', 'blank'].includes(type)) {
    type = 'el-' + type
  }

  // 删除label使用ariaLabel，否则控制台会告警
  delete param.label

  // 日期区间需要单独处理
  if (['daterange', 'datetimerange', 'monthrange'].includes(param.type ?? '')) {
    if (!param.prop2) throw Error('prop2属性缺失')
    if (param.single) {
      type = 'm-single-date-picker'
    }
  }
  
  const component = getFormComponentByName(type)
  return { component, param, slots }
}

/**
 * 通过名称获取组件对象
 * @param compName 组件名称
 * @returns 组件对象
 */
function getFormComponentByName(compName: string) {
  const componentMap: Record<string, any> = {
    'el-input': ElInput,
    'el-autocomplete': ElAutocomplete,
    'el-cascader': ElCascader,
    'el-checkbox': ElCheckbox,
    'el-checkbox-button': ElCheckboxButton,
    'el-color-picker': ElColorPicker,
    'el-date-picker': ElDatePicker,
    'el-input-number': ElInputNumber,
    'el-radio': ElRadio,
    'el-radio-button': ElRadioButton,
    'el-rate': ElRate,
    'el-select': ElSelect,
    'el-select-v2': ElSelectV2,
    'el-slider': ElSlider,
    'el-switch': ElSwitch,
    'el-time-picker': ElTimePicker,
    'el-time-select': ElTimeSelect,
    'el-upload': ElUpload,
    'el-radio-group': ElRadioGroup,
    'el-checkbox-group': ElCheckboxGroup,
    'm-single-date-picker': SingleDatePicker,
    'm-icon-select': IconSelect,
    'm-upload': MUpload
  }
  
  return componentMap[compName] || MNative
}

/**
 * 生成itemListRef数据
 * @param column 包含itemList的列配置
 * @returns 响应式的选项数据
 */
export function getItemListRef(column: ItemListColumn): Ref<CommonItemData[]> {
  // 生成方法
  const generateItemList = (data: CommonItemData[]) => {
    return data.map((i) => {
      let label = i.label
      let value = i.value
      
      if (column.labelKey) {
        label = column.labelKey instanceof Function ? column.labelKey(i) : i[column.labelKey]
      }
      if (column.valueKey) {
        value = column.valueKey instanceof Function ? column.valueKey(i) : i[column.valueKey]
      }
      
      return { label, value }
    })
  }
  
  let itemList = toRaw(column.itemList ?? [])
  if (isRef(itemList)) return itemList
  
  if (itemList instanceof Function) {
    itemList = itemList()
  }
  
  const itemArr: Ref<CommonItemData[]> = ref([])
  
  if (itemList instanceof Promise) {
    itemList.then((res) => (itemArr.value = generateItemList(res)))
  } else {
    itemArr.value = generateItemList(itemList as CommonItemData[])
  }
  
  return itemArr
} 