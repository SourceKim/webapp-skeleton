import api, { BASE_URL } from './api'
import Taro from '@tarojs/taro'

// 素材类型
export type MaterialType = 'image' | 'audio' | 'video' | 'document' | 'text' | 'other'

// 素材接口
export interface Material {
  id: string
  filename?: string
  originalname?: string
  file_path?: string
  mimetype?: string
  size?: number
  type: MaterialType
  category?: string
  description?: string
  is_public: boolean
  upload_dir?: string
  user?: {
    id: string
    username: string
  }
  tags?: string[]
  metadata?: any
  parent_id?: string
  created_at: string
  updated_at: string
}

// 创建素材请求参数
export interface CreateMaterialParams {
  category?: string
  description?: string
  is_public?: boolean
  tags?: string[]
  metadata?: any
  parent_id?: string
}

// 创建文本素材请求参数
export interface CreateTextMaterialParams extends CreateMaterialParams {
  content: string
}

// 更新素材请求参数
export interface UpdateMaterialParams {
  filename?: string
  originalname?: string
  description?: string
  category?: string
  is_public?: boolean
  tags?: string[]
  metadata?: any
}

// 获取素材列表查询参数
export interface GetMaterialsQueryParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  type?: MaterialType
  category?: string
  keyword?: string
  is_public?: boolean
  tags?: string[]
  parent_id?: string
  min_size?: number
  max_size?: number
}

// 分页素材列表响应
export interface PaginatedMaterialsResponse {
  items: Material[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
    sort_by?: string
    sort_order?: 'ASC' | 'DESC'
  }
}

// 批量删除素材请求参数
export interface BatchDeleteMaterialsParams {
  ids: string[]
}

// 素材服务
const materialService = {
  // 获取素材列表（管理员）
  getMaterials: (params?: GetMaterialsQueryParams) => {
    return api.get<PaginatedMaterialsResponse>('/materials/admin/', params)
  },

  // 获取素材详情（管理员）
  getMaterial: (id: string) => {
    return api.get<Material>(`/materials/admin/${id}`)
  },

  // 获取相关素材（后端暂未实现，占位）
  getRelatedMaterials: async (id: string) => {
    Taro.showToast({ title: '相关素材未实现', icon: 'none' })
    return { code: -1, message: '未实现', data: [] as Material[] }
  },

  // 获取素材版本（后端暂未实现，占位）
  getMaterialVersions: async (id: string) => {
    Taro.showToast({ title: '素材版本未实现', icon: 'none' })
    return { code: -1, message: '未实现', data: [] as Material[] }
  },

  // 上传素材
  uploadMaterial: async (filePath: string, params?: CreateMaterialParams) => {
    const token = Taro.getStorageSync('token')
    
    return new Promise<Material>((resolve, reject) => {
      Taro.uploadFile({
        url: `${BASE_URL}/materials/admin/upload`,
        filePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${token}`
        },
        formData: params as any,
        success: (res) => {
          console.log('上传素材响应:', res)
          try {
            const data = JSON.parse(res.data)
            console.log('解析后的响应数据:', data)
            if (data.code === 0 && data.data) {
              resolve(data.data)
            } else {
              reject(data.message || '上传失败')
            }
          } catch (error) {
            console.error('解析响应失败:', error, res.data)
            reject('解析响应失败')
          }
        },
        fail: (err) => {
          console.error('上传素材失败:', err)
          reject(err)
        }
      })
    })
  },

  // 以普通用户身份上传素材（用于个人头像等）
  uploadMaterialAsUser: async (filePath: string, params?: CreateMaterialParams) => {
    const token = Taro.getStorageSync('token')
    return new Promise<Material>((resolve, reject) => {
      Taro.uploadFile({
        url: `${BASE_URL}/materials/upload`,
        filePath,
        name: 'file',
        header: { 'Authorization': `Bearer ${token}` },
        formData: params as any,
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 0 && data.data) {
              resolve(data.data)
            } else {
              reject(data.message || '上传失败')
            }
          } catch (error) {
            reject('解析响应失败')
          }
        },
        fail: (err) => reject(err)
      })
    })
  },

  // 批量上传素材
  uploadMaterialsBatch: async (filePaths: string[], params?: CreateMaterialParams) => {
    const token = Taro.getStorageSync('token')
    const promises = filePaths.map(filePath => {
      return new Promise<Material>((resolve, reject) => {
        Taro.uploadFile({
          url: `${BASE_URL}/materials/admin/upload`,
          filePath,
          name: 'file',
          header: {
            'Authorization': `Bearer ${token}`
          },
          formData: params as any,
          success: (res) => {
            console.log('批量上传素材响应:', res)
            try {
              const data = JSON.parse(res.data)
              console.log('解析后的批量上传响应数据:', data)
              if (data.code === 0 && data.data) {
                resolve(data.data)
              } else {
                reject(data.message || '上传失败')
              }
            } catch (error) {
              console.error('解析批量上传响应失败:', error, res.data)
              reject('解析响应失败')
            }
          },
          fail: (err) => {
            console.error('批量上传素材失败:', err)
            reject(err)
          }
        })
      })
    })
    
    return Promise.all(promises)
  },

  // 创建文本素材（后端暂未实现，占位）
  createTextMaterial: async (params: CreateTextMaterialParams) => {
    Taro.showToast({ title: '文本素材未实现', icon: 'none' })
    return { code: -1, message: '未实现', data: null as any }
  },

  // 更新素材（管理员）
  updateMaterial: (id: string, params: UpdateMaterialParams) => {
    return api.put<Material>(`/materials/admin/${id}`, params)
  },

  // 删除素材（管理员）
  deleteMaterial: (id: string) => {
    return api.delete(`/materials/admin/${id}`)
  },

  // 批量删除素材（管理员）
  batchDeleteMaterials: (params: BatchDeleteMaterialsParams) => {
    return api.post('/materials/admin/batch/delete', params)
  }
}

export default materialService 