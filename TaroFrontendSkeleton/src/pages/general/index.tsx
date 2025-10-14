import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import Table, { TableColumn } from '../../components/Table'
import Popup from '../../components/Popup'
import Button from '../../components/Button'
import { authService, productService, cartService, orderService, materialService } from '../../services'
import './index.scss'

interface Feature {
  id: number
  name: string
  result: string
  api: () => Promise<any>
  params?: any
}

export default function General() {
  const [features, setFeatures] = useState<Feature[]>([
    { 
      id: 1, 
      name: '用户登录', 
      result: '未测试',
      api: () => authService.login({ username: 'testuser', password: 'password123' })
    },
    { 
      id: 2, 
      name: '获取用户信息', 
      result: '未测试',
      api: () => authService.getCurrentUser()
    },
    { 
      id: 3, 
      name: '获取产品列表', 
      result: '未测试',
      api: () => productService.getProducts()
    },
    { 
      id: 4, 
      name: '获取产品分类', 
      result: '未测试',
      api: () => productService.getCategories()
    },
    { 
      id: 5, 
      name: '获取购物车', 
      result: '未测试',
      api: () => cartService.getCart()
    },
    { 
      id: 6, 
      name: '获取订单列表', 
      result: '未测试',
      api: () => orderService.getOrders()
    },
    { 
      id: 7, 
      name: '获取素材列表', 
      result: '未测试',
      api: () => materialService.getMaterials()
    }
  ])
  const [loading, setLoading] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null)
  const [testResult, setTestResult] = useState('')
  const [responseData, setResponseData] = useState<any>(null)

  useLoad(() => {
    console.log('General page loaded.')
  })

  const columns: TableColumn[] = [
    {
      title: '功能名称',
      key: 'name',
    },
    {
      title: '测试结果',
      key: 'result',
      render: (value) => {
        let color = '#999'
        if (value === '成功') color = '#52c41a'
        if (value === '失败') color = '#ff4d4f'
        
        return <Text style={{ color }}>{value}</Text>
      }
    }
  ]

  const handleRowClick = (record: Feature) => {
    setCurrentFeature(record)
    setPopupVisible(true)
    setResponseData(null)
    setTestResult('')
  }

  const handleTest = async () => {
    if (!currentFeature) return
    
    setLoading(true)
    setTestResult('测试中...')
    setResponseData(null)
    
    try {
      const response = await currentFeature.api()
      console.log('API响应:', response)
      
      // 更新测试结果
      setFeatures(prev => 
        prev.map(item => 
          item.id === currentFeature.id 
            ? { ...item, result: '成功' } 
            : item
        )
      )
      
      setTestResult('测试成功！接口返回正常。')
      setResponseData(response.data)
    } catch (error) {
      console.error('API错误:', error)
      
      // 更新测试结果
      setFeatures(prev => 
        prev.map(item => 
          item.id === currentFeature.id 
            ? { ...item, result: '失败' } 
            : item
        )
      )
      
      setTestResult(`测试失败！${error.message || '接口返回错误。'}`)
    } finally {
      setLoading(false)
    }
  }

  const closePopup = () => {
    setPopupVisible(false)
    setCurrentFeature(null)
    setTestResult('')
    setResponseData(null)
  }

  return (
    <View className='general-container'>
      <View className='general-header'>
        <Text className='general-title'>通用功能测试</Text>
        <Text className='general-subtitle'>点击功能项进行测试</Text>
      </View>
      
      <Table 
        columns={columns} 
        dataSource={features} 
        onRowClick={handleRowClick}
      />
      
      <Popup
        visible={popupVisible}
        title={`测试功能: ${currentFeature?.name}`}
        onClose={closePopup}
      >
        <View className='test-popup'>
          <Text className='test-description'>
            点击下方按钮开始测试 "{currentFeature?.name}" 功能
          </Text>
          
          {testResult && (
            <View className='test-result'>
              <Text>{testResult}</Text>
            </View>
          )}
          
          {responseData && (
            <View className='response-data'>
              <Text className='response-title'>响应数据:</Text>
              <View className='response-content'>
                <Text>{JSON.stringify(responseData, null, 2)}</Text>
              </View>
            </View>
          )}
          
          <View className='test-actions'>
            <Button 
              text='开始测试' 
              type='primary' 
              loading={loading}
              onClick={handleTest}
            />
            <Button 
              text='取消' 
              onClick={closePopup}
            />
          </View>
        </View>
      </Popup>
    </View>
  )
} 