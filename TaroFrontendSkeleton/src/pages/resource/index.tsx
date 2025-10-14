import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import Table, { TableColumn } from '../../components/Table'
import Button from '../../components/Button'
import { materialService, Material } from '../../services'
import './index.scss'

export default function Resource() {
  const [resources, setResources] = useState<Material[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)

  useLoad(() => {
    console.log('Resource page loaded.')
    fetchResources()
  })

  // 获取资源列表
  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await materialService.getMaterials({
        page,
        limit,
        sort_order: 'DESC',
        sort_by: 'created_at'
      })
      
      if (response.code === 0 && response.data) {
        setResources(response.data.items)
        setTotal(response.data.meta.total)
      } else {
        Taro.showToast({
          title: '获取资源列表失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('获取资源列表错误:', error)
      Taro.showToast({
        title: '获取资源列表失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: TableColumn[] = [
    {
      title: '资源名称',
      key: 'filename',
      render: (value, record) => <Text>{value || record.originalname || '未命名'}</Text>
    },
    {
      title: '类型',
      key: 'type',
    },
    {
      title: '大小',
      key: 'size',
      render: (value) => <Text>{formatFileSize(value)}</Text>
    },
    {
      title: '上传时间',
      key: 'created_at',
      render: (value) => <Text>{formatDate(value)}</Text>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <View className='resource-actions'>
          <Text 
            className='resource-action resource-action-view'
            onClick={(e) => {
              e.stopPropagation()
              handleViewResource(record)
            }}
          >
            查看
          </Text>
          <Text 
            className='resource-action resource-action-delete'
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteResource(record)
            }}
          >
            删除
          </Text>
        </View>
      )
    }
  ]

  // 格式化文件大小
  const formatFileSize = (size?: number): string => {
    if (!size) return '未知'
    
    if (size < 1024) {
      return size + 'B'
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }
  }

  // 格式化日期
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '未知'
    
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  const handleUpload = () => {
    setUploading(true)
    
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePath = res.tempFilePaths[0]
        
        // 上传文件
        materialService.uploadMaterial(tempFilePath, {
          is_public: true,
          category: '图片'
        }).then(material => {
          setResources(prev => [material, ...prev])
          Taro.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.error('上传错误:', err)
          Taro.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }).finally(() => {
          setUploading(false)
        })
      },
      fail: function() {
        setUploading(false)
      }
    })
  }

  const handleViewResource = (resource: Material) => {
    // 根据资源类型执行不同的预览操作
    if (resource.type === 'image' && resource.url) {
      Taro.previewImage({
        urls: [resource.url],
        current: resource.url
      })
    } else {
      Taro.showToast({
        title: '暂不支持此类型预览',
        icon: 'none'
      })
    }
  }

  const handleDeleteResource = (resource: Material) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除 ${resource.filename || resource.originalname || '此资源'} 吗？`,
      success: function (res) {
        if (res.confirm) {
          materialService.deleteMaterial(resource.id)
            .then(() => {
              setResources(prev => prev.filter(item => item.id !== resource.id))
              Taro.showToast({
                title: '删除成功',
                icon: 'success'
              })
            })
            .catch(err => {
              console.error('删除错误:', err)
              Taro.showToast({
                title: '删除失败',
                icon: 'none'
              })
            })
        }
      }
    })
  }

  return (
    <View className='resource-container'>
      <View className='resource-header'>
        <Text className='resource-title'>我的资源</Text>
        <Button 
          text='上传资源' 
          type='primary'
          loading={uploading}
          onClick={handleUpload}
        />
      </View>
      
      <Table 
        columns={columns} 
        dataSource={resources} 
        onRowClick={handleViewResource}
        loading={loading}
      />
      
      {total > 0 && (
        <View className='resource-pagination'>
          <Text className='resource-total'>共 {total} 条</Text>
        </View>
      )}
    </View>
  )
} 