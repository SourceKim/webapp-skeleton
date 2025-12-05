import Taro from '@tarojs/taro'

// API基础URL
export const BASE_URL = process.env.TARO_APP_API_URL

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

// 避免多次重定向
let isRedirecting = false

const handleUnauthorized = () => {
  if (isRedirecting) return
  isRedirecting = true
  try { Taro.removeStorageSync('token') } catch {}
  Taro.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 1500 })
  setTimeout(() => {
    Taro.redirectTo({ url: '/pages/login/index' })
    isRedirecting = false
  }, 800)
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

  if (response.code === 401) {
    handleUnauthorized()
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
    if (response.statusCode === 401) {
      // 只有在非登录/注册页面才跳转登录，或者是 token 过期的情况
      const pages = Taro.getCurrentPages()
      const currentPage = pages[pages.length - 1]?.route
      const isAuthPage = currentPage?.includes('login/index')
      
      // 如果已经在登录页，且是登录接口报错，不要重定向，直接返回错误信息给业务层处理
      if (isAuthPage && interceptedOptions.url.includes('/auth/login')) {
         return response.data as ApiResponse<T>
      }

      handleUnauthorized()
      return { code: 401, message: '未授权', data: null as any }
    }
    
    // 如果是业务错误（如 400 参数错误，403 禁止，404 不存在等），直接返回后端响应体给业务层处理
    // 前提是后端返回了标准的 { code, message, data } 结构
    if (response.statusCode >= 400 && response.data && (response.data as any).code !== undefined) {
       return response.data as ApiResponse<T>
    }

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