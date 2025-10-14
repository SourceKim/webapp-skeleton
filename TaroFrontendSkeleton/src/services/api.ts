import Taro from '@tarojs/taro'

// API基础URL
export const BASE_URL = 'http://localhost:3000/api/v1'

// 请求方法类型
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求配置接口
interface RequestOptions {
  url: string
  method?: Method
  data?: any
  headers?: Record<string, string>
}

// 响应接口
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  error?: any
}

// 获取token
const getToken = (): string => {
  return Taro.getStorageSync('token') || ''
}

// 请求拦截器
const requestInterceptor = (options: RequestOptions): RequestOptions => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return {
    ...options,
    headers,
  }
}

// 响应拦截器
const responseInterceptor = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  // 检查响应是否有效
  if (!response || typeof response !== 'object') {
    console.error('无效的响应格式:', response)
    return {
      code: -1,
      message: '无效的响应格式',
      data: null as any
    }
  }

  if (response.code !== 0) {
    console.error('API响应错误:', response)
    Taro.showToast({
      title: response.message || '请求失败',
      icon: 'none',
      duration: 2000
    })
  }
  return response
}

// 通用请求方法
const request = async <T = any>(options: RequestOptions): Promise<ApiResponse<T>> => {
  const interceptedOptions = requestInterceptor(options)
  
  try {
    console.log('发送请求:', `${BASE_URL}${interceptedOptions.url}`, interceptedOptions)
    const response = await Taro.request({
      url: `${BASE_URL}${interceptedOptions.url}`,
      method: interceptedOptions.method || 'GET',
      data: interceptedOptions.data,
      header: interceptedOptions.headers,
    })

    console.log('收到响应:', response)
    
    // 检查响应状态码
    if (response.statusCode !== 200) {
      console.error('HTTP错误:', response.statusCode)
      return {
        code: response.statusCode,
        message: `HTTP错误: ${response.statusCode}`,
        data: null as any
      }
    }

    return responseInterceptor<T>(response.data as ApiResponse<T>)
  } catch (error) {
    console.error('API请求错误:', error)
    Taro.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
      duration: 2000
    })
    return {
      code: -1,
      data: null as any,
      message: '网络错误，请稍后重试'
    }
  }
}

// 导出请求方法
export const api = {
  get: <T = any>(url: string, params?: any) => 
    request<T>({ url, method: 'GET', data: params }),
  
  post: <T = any>(url: string, data?: any) => 
    request<T>({ url, method: 'POST', data }),
  
  put: <T = any>(url: string, data?: any) => 
    request<T>({ url, method: 'PUT', data }),
  
  delete: <T = any>(url: string, data?: any) => 
    request<T>({ url, method: 'DELETE', data }),

  patch: <T = any>(url: string, data?: any) => 
    request<T>({ url, method: 'PATCH', data }),
}

export default api 