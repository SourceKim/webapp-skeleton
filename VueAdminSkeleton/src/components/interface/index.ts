import type { VNode, Ref } from 'vue'

export type SlotRender = (scope: Record<string, string | number | boolean | null | undefined | VNode | Record<string, string | number | boolean | null | undefined> | (string | number | boolean | null | undefined)[]>) => VNode | VNode[]

export type SlotsObj = {
  [slotName: string]: SlotRender
}

/**
 * 列类型
 */
export declare type CommonColumnType =
  | ''
  | 'input'
  | 'text'
  | 'textarea'
  | 'password'
  | 'number'
  | 'year'
  | 'month'
  | 'date'
  | 'dates'
  | 'datetime'
  | 'week'
  | 'datetimerange'
  | 'daterange'
  | 'monthrange'
  | 'icon'
  | 'cascader'
  | 'checkbox'
  | 'checkbox-button'
  | 'checkbox-group'
  | 'color-picker'
  | 'date-picker'
  | 'input-number'
  | 'radio'
  | 'radio-button'
  | 'radio-group'
  | 'rate'
  | 'select'
  | 'select-v2'
  | 'slider'
  | 'switch'
  | 'time-picker'
  | 'time-select'
  | 'upload'
  | 'upload-file'
  | 'upload-img'
  | 'icon-select'
  | 'autocomplete'
  | 'span'
  | 'div'
  | 'p'
  | 'a'
  | 'i'
  | 'blank'

/**
 * itemList 类型
 */
export declare type CommonItemList =
  | Ref<CommonItemData[]>
  | CommonItemData[]
  | Promise<CommonItemData[]>
  | (() => CommonItemData[] | Promise<CommonItemData[]>)

/**
 * 选项数据类型
 */
export interface CommonItemData {
  // 选项的值
  value?: number | boolean | string
  // 选项的名称
  label?: string

  [prop: string]: string | number | boolean | null | undefined | VNode | Record<string, string | number | boolean | null | undefined> | (string | number | boolean | null | undefined)[]
}

/**
 * 双向绑定参数
 */
export interface CommonModelParam {
  start?: number | string
  end?: number | string
  modelValue?: string | number | boolean | null | undefined | Date | [string | number | Date, string | number | Date] | (string | number | boolean | null | undefined)[]
  'onUpdate:modelValue'?: (val: string | number | boolean | null | undefined | Date | [string | number | Date, string | number | Date] | (string | number | boolean | null | undefined)[]) => void
  'onUpdate:start'?: (val: string | number | Date | null | undefined) => void
  'onUpdate:end'?: (val: string | number | Date | null | undefined) => void
}

/**
 * 字典枚举的列
 */
export interface ItemListColumn {
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
}
