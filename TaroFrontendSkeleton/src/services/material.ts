import api from './api'
import Taro from '@tarojs/taro'

// 素材类型
export type MaterialType = 'image' | 'audio' | 'video' | 'document' | 'text' | 'other'

// 素材接口
export interface Material {
  id: string
  filename?: string
  originalname?: string
  path?: string
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
  url?: string
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
  // 获取素材列表
  getMaterials: (params?: GetMaterialsQueryParams) => {
    return api.get<PaginatedMaterialsResponse>('/materials', params)
  },

  // 获取素材详情
  getMaterial: (id: string) => {
    return api.get<Material>(`/materials/${id}`)
  },

  // 获取相关素材
  getRelatedMaterials: (id: string) => {
    return api.get<Material[]>(`/materials/${id}/related`)
  },

  // 获取素材版本
  getMaterialVersions: (id: string) => {
    return api.get<Material[]>(`/materials/${id}/versions`)
  },

  // 上传素材
  uploadMaterial: async (filePath: string, params?: CreateMaterialParams) => {
    const token = Taro.getStorageSync('token')
    
    return new Promise<Material>((resolve, reject) => {
      Taro.uploadFile({
        url: 'http://localhost:3000/api/v1/materials',
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

  // 批量上传素材
  uploadMaterialsBatch: async (filePaths: string[], params?: CreateMaterialParams) => {
    const token = Taro.getStorageSync('token')
    const promises = filePaths.map(filePath => {
      return new Promise<Material>((resolve, reject) => {
        Taro.uploadFile({
          url: 'http://localhost:3000/api/v1/materials/upload/batch',
          filePath,
          name: 'files',
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

  // 创建文本素材
  createTextMaterial: (params: CreateTextMaterialParams) => {
    return api.post<Material>('/materials/text', params)
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