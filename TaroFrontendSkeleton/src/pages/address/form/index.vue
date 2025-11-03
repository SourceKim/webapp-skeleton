<template>
  <view class="address-form-page">
    <nut-navbar :title="isEdit ? '编辑地址' : '新增地址'" safe-area-inset-top left-show @click-back="goBack" />

    <nut-form :model-value="form" label-width="80">
      <nut-form-item label="收货人">
        <nut-input v-model="form.name" placeholder="请输入姓名" />
      </nut-form-item>
      <nut-form-item label="手机号">
        <nut-input v-model="form.phone" placeholder="请输入手机号" />
      </nut-form-item>
      <nut-form-item label="省市区">
        <nut-cell title="选择地址" :desc="text" is-link @click="showAddress" />
        <nut-address
          v-model:visible="showPopup"
          :province="address.provinces"
          :city="address.cities"
          :country="address.countries"
          :town="address.towns"
          @change="onChange"
          @close="close"
          custom-address-title="请选择所在地区"
        />
      </nut-form-item>
      <nut-form-item label="详细地址">
        <nut-input v-model="form.detail" placeholder="详细地址" />
      </nut-form-item>
      <nut-form-item label="邮编">
        <nut-input v-model="form.postal_code" placeholder="选填" />
      </nut-form-item>
      <nut-form-item label="设为默认">
        <nut-switch v-model="form.is_default" />
      </nut-form-item>
      <nut-form-item label="标签">
        <nut-radio-group v-model="form.tag" direction="horizontal">
          <nut-radio :label="''">无</nut-radio>
          <nut-radio label="HOME">家</nut-radio>
          <nut-radio label="COMPANY">公司</nut-radio>
          <nut-radio label="SCHOOL">学校</nut-radio>
          <nut-radio label="OTHER">其他</nut-radio>
        </nut-radio-group>
      </nut-form-item>
    </nut-form>

    <view class="btns">
      <nut-button block type="primary" @click="submit">保存</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed, ref } from 'vue'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import addressService from '@/services/address'
import { getCityList, getCountryList, getPronvinceList, getTownList } from '@/utils/region-loader'

const form = reactive({
  name: '', phone: '', province: '', city: '', country: '', town: '', detail: '', postal_code: '', is_default: false,
  tag: '' as '' | 'HOME' | 'COMPANY' | 'SCHOOL' | 'OTHER'
})

// 地区选择（NutUI Address）
const showPopup = ref(false)
const text = ref('选择地址')
// 地区列表容器（运行时加载自 wecatch/china_regions）
const address = reactive({ provinces: [] , cities: [{}] as any[], countries: [{}] as any[], towns: [{}] as any[] })
const showAddress = () => { showPopup.value = true }
const onChange = async (cal: { custom: string, value: { id: string, name: string } , next: string}) => {
  if (cal.custom === 'province') {
    form.province = cal.value.name
    address.cities = getCityList(cal.value.id)
  } else if (cal.custom === 'city') {
    form.city = cal.value.name
    address.countries = getCountryList(cal.value.id)
  } else if (cal.custom === 'country') {
    form.country = cal.value.name
    address.towns = getTownList(cal.value.id)
  } else if (cal.custom === 'town') {
    form.town = cal.value.name
  }
}

/*
{
    "data": {
        "addressIdStr": "bj_gl_qx_0",
        "addressStr": "北京桂林青秀区",
        "province": {
            "id": "bj",
            "name": "北京"
        },
        "city": {
            "id": "gl",
            "name": "桂林"
        },
        "country": {
            "id": "qx",
            "name": "青秀区"
        },
        "town": {}
    },
    "type": "custom"
}
 */
const close = (val: any) => {
  const data = val?.data || {}
  if (val?.type === 'custom' && data) {
    if (data.province?.name) form.province = data.province.name
    if (data.city?.name) form.city = data.city.name
    if (data.country?.name) form.country = data.country.name
    if (data.town?.name) form.town = data.town.name
  }
  const pieces = [form.province, form.city, form.country, form.town].filter(Boolean)
  text.value = data.addressStr || pieces.join(' ')
  showPopup.value = false
}

const router = getCurrentInstance()
const id = computed(() => router?.router?.params?.id || '')
const isEdit = computed(() => !!id.value)

onMounted(async () => {
  if (isEdit.value) {
    const res = await addressService.detail(id.value)
    if (res.code === 0 && res.data) {
      const d: any = res.data
      form.name = d.name || ''
      form.phone = d.phone || ''
      form.province = d.province || ''
      form.city = d.city || ''
      form.country = d.country || ''
      form.town = d.town || ''
      form.detail = d.detail || ''
      form.postal_code = d.postal_code || ''
      form.is_default = Boolean(d.is_default)
      form.tag = (d.tag || '') as any
      text.value = d.province + d.city + d.country + d.town
    }
  }
  address.provinces = getPronvinceList()
})

const validate = (): string | null => {
  if (!form.name) return '请输入收货人'
  if (!form.phone) return '请输入手机号'
  if (!form.province || !form.city || !form.country) return '请输入省市区'
  if (!form.detail) return '请输入详细地址'
  return null
}

const submit = async () => {
  const msg = validate()
  if (msg) { Taro.showToast({ title: msg, icon: 'none' }); return }
  const payload: any = { ...form }
  if (payload.tag === '') delete payload.tag
  const res = isEdit.value
    ? await addressService.update(id.value, payload)
    : await addressService.create(payload)
  if (res.code === 0) {
    Taro.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 300)
  }
}

const goBack = () => {
  Taro.navigateBack()
}
</script>

<style lang="scss">
.address-form-page { padding: 12px; }
.btns { margin: 16px 0; }
.row { display: flex; gap: 8px; }
</style>


