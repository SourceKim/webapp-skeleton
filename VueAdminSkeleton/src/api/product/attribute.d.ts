export interface ProductAttributeValue {
  id: string
  attribute_key_id: string
  value: string
  value_id: string
  image_id?: string
}

export interface ProductAttributeKey {
  id: string
  spu_id: string
  name: string
  key: string
  required: boolean
  values?: ProductAttributeValue[]
}


