<template>
  <div class="location-picker">
    <div class="search-box">
      <el-input
        id="amap-search-input"
        v-model="searchKeyword"
        placeholder="搜索地点"
        clearable
      />
    </div>
    <div id="amap-container" class="map-container"></div>
    <div class="info-panel" v-if="selectedLocation">
      <p><strong>地址：</strong>{{ selectedLocation.address }}</p>
      <p><strong>经度：</strong>{{ selectedLocation.lng }}</p>
      <p><strong>纬度：</strong>{{ selectedLocation.lat }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lng: 0, lat: 0, address: '' })
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const searchKeyword = ref('')
const selectedLocation = ref<{ lng: number; lat: number; address: string } | null>(null)

let map: any = null
let marker: any = null
let placeSearch: any = null
let autoComplete: any = null

// 请替换为您的高德地图 Key 和 SecurityJsCode
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY 
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE 

// 设置安全密钥
;(window as any)._AMapSecurityConfig = {
  securityJsCode: AMAP_SECURITY_CODE,
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.destroy()
  }
})

// 监听 modelValue 变化，更新地图上的标记
watch(() => props.modelValue, (val) => {
  if (val && val.lng && val.lat) {
    selectedLocation.value = {
      lng: Number(val.lng),
      lat: Number(val.lat),
      address: val.address || ''
    }
    // 使用 requestAnimationFrame 确保在地图实例可能被创建后执行
    requestAnimationFrame(() => {
        if (map) {
            if((window as any).AMap) {
                const position = new (window as any).AMap.LngLat(val.lng, val.lat)
                if (marker) {
                    marker.setPosition(position)
                } else {
                    createMarker(position)
                }
                map.setCenter(position)
            }
        }
    })
  }
}, { deep: true })

function initMap() {
  AMapLoader.load({
    key: AMAP_KEY, 
    version: '2.0', 
    plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.Geocoder'], 
  })
    .then((AMap) => {
      const center = props.modelValue && props.modelValue.lng && props.modelValue.lat 
            ? [props.modelValue.lng, props.modelValue.lat] 
            : [116.397428, 39.90923]; // 默认北京天安门

      // 检查系统是否为暗黑模式
      const isDark = document.documentElement.classList.contains('dark')
      
      map = new AMap.Map('amap-container', {
        viewMode: '3D', 
        zoom: 13, 
        center: center, 
        mapStyle: isDark ? 'amap://styles/dark' : 'amap://styles/normal' // 适配地图暗黑模式
      })

      // 点击地图事件
      map.on('click', (e: any) => {
        const lng = e.lnglat.getLng()
        const lat = e.lnglat.getLat()
        updateLocation(lng, lat)
      })

      // 搜索提示
      autoComplete = new AMap.AutoComplete({
        input: 'amap-search-input'
      })

      placeSearch = new AMap.PlaceSearch({
        map: map
      })

      autoComplete.on('select', (e: any) => {
        placeSearch.setCity(e.poi.adcode)
        placeSearch.search(e.poi.name, (status: string, result: any) => {
            if (status === 'complete' && result.poiList.pois && result.poiList.pois.length > 0) {
                const poi = result.poiList.pois[0]
                updateLocation(poi.location.lng, poi.location.lat, poi.address || poi.name)
            }
        })
      })
      
      // 初始化标记
      if (props.modelValue && props.modelValue.lng && props.modelValue.lat) {
          createMarker(new AMap.LngLat(props.modelValue.lng, props.modelValue.lat))
      }

    })
    .catch((e) => {
      console.error(e)
      ElMessage.error('地图加载失败，请检查 Key 配置')
    })
}

function createMarker(position: any) {
    if (!map) return
    if (marker) {
        marker.setPosition(position)
    } else {
        marker = new (window as any).AMap.Marker({
            position: position,
            map: map
        })
    }
}

function updateLocation(lng: number, lat: number, address?: string) {
  const AMap = (window as any).AMap
  if (!AMap) return

  const position = new AMap.LngLat(lng, lat)
  createMarker(position)
  map.setCenter(position)

  if (address) {
      selectedLocation.value = { lng, lat, address }
      emitUpdate()
  } else {
    // 逆地理编码
    const geocoder = new AMap.Geocoder()
    geocoder.getAddress(position, (status: string, result: any) => {
      if (status === 'complete' && result.regeocode) {
        const addr = result.regeocode.formattedAddress
        selectedLocation.value = { lng, lat, address: addr }
        emitUpdate()
      }
    })
  }
}

function emitUpdate() {
  if (selectedLocation.value) {
    emit('update:modelValue', selectedLocation.value)
    emit('change', selectedLocation.value)
  }
}
</script>

<style scoped>
.location-picker {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-box {
  width: 100%;
}

.map-container {
  flex: 1;
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.info-panel {
  padding: 10px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}
</style>

<style>
/* 高德地图搜索下拉框暗黑模式适配 */
html.dark .amap-sug-result {
  background-color: var(--el-bg-color-overlay) !important;
  border: 1px solid var(--el-border-color-light) !important;
  color: var(--el-text-color-primary) !important;
}

html.dark .auto-item {
  background-color: transparent !important;
  color: var(--el-text-color-primary) !important;
}

html.dark .auto-item:hover,
html.dark .auto-item.active {
  background-color: var(--el-fill-color-light) !important;
}

html.dark .auto-item-span {
  color: var(--el-text-color-secondary) !important;
}

/* 适配高德地图 Logo/版权文字在暗色底图下的显示（可选） */
html.dark .amap-copyright,
html.dark .amap-logo {
  filter: invert(1) opacity(0.8);
}
</style>
