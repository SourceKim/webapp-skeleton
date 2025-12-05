export type AttributeType = 'TEXT' | 'COLOR' | 'IMAGE'

export interface ProductAttributeValue {
  id: string
  attribute_key_id: string
  value: string
  value_id: string
  image_id?: string
  color_hex?: string
}

export interface ProductAttributeKey {
  id: string
  spu_id: string
  name: string
  key: string
  type: AttributeType
  required: boolean
  values?: ProductAttributeValue[]
}


