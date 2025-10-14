import { useState, useEffect } from 'react'
import { View, Text, Image, Input, Form } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import Table, { TableColumn } from '../../components/Table'
import Button from '../../components/Button'
import { authService, orderService, UserInfo, Order } from '../../services'
import api from '../../services/api'
import './index.scss'

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [isWeb, setIsWeb] = useState(false)
  
  useLoad(() => {
    console.log('Profile page loaded.')
    // 获取当前环境
    const currentEnv = Taro.getEnv()
    setIsWeb(currentEnv === Taro.ENV_TYPE.WEB)
    console.log('当前环境:', currentEnv, '是否Web:', currentEnv === Taro.ENV_TYPE.WEB)
    
    // 检查是否已登录
    checkLoginStatus()
  })
  
  // 检查登录状态
  const checkLoginStatus = () => {
    // 检查是否有token
    const token = Taro.getStorageSync('token')
    console.log('检查登录状态, token:', token ? '存在' : '不存在')
    if (token) {
      setLoading(true)
      // 获取用户信息
      authService.getCurrentUser()
        .then(response => {
          console.log('获取用户信息响应:', response)
          if (response.code === 0 && response.data) {
            setIsLoggedIn(true)
            setUserInfo(response.data)
            // 获取订单列表
            fetchOrders()
          } else {
            console.warn('获取用户信息失败:', response)
            handleLogout()
          }
        })
        .catch(error => {
          console.error('获取用户信息错误:', error)
          handleLogout()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setIsLoggedIn(false)
      setUserInfo(null)
      setOrders([])
    }
  }
  
  // 获取订单列表
  const fetchOrders = () => {
    setOrderLoading(true)
    orderService.getOrders()
      .then(response => {
        console.log('获取订单列表响应:', response)
        if (response.code === 0 && response.data) {
          setOrders(response.data)
        } else {
          console.warn('获取订单列表失败:', response)
        }
      })
      .catch(error => {
        console.error('获取订单列表错误:', error)
      })
      .finally(() => {
        setOrderLoading(false)
      })
  }
  
  // H5登录
  const handleH5Login = () => {
    if (!username || !password) {
      Taro.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      })
      return
    }
    
    console.log('H5登录, 用户名:', username)
    setLoginLoading(true)
    Taro.showLoading({ title: '登录中...' })
    
    authService.login({ username, password })
      .then(response => {
        console.log('H5登录响应:', response)
        if (response.code === 0 && response.data) {
          // token已在authService.login中保存
          
          // 更新状态
          setIsLoggedIn(true)
          setUserInfo(response.data.user)
          
          // 获取订单列表
          fetchOrders()
          
          Taro.showToast({
            title: '登录成功',
            icon: 'success'
          })
        } else {
          console.warn('H5登录失败:', response)
          Taro.showToast({
            title: response.message || '登录失败',
            icon: 'none'
          })
        }
      })
      .catch(error => {
        console.error('登录错误:', error)
        Taro.showToast({
          title: '登录失败',
          icon: 'none'
        })
      })
      .finally(() => {
        Taro.hideLoading()
        setLoginLoading(false)
      })
  }
  
  // 小程序登录
  const handleMiniProgramLogin = () => {
    console.log('开始小程序登录')
    setLoginLoading(true)
    Taro.showLoading({ title: '登录中...' })
    
    Taro.login({
      success: function (res) {
        if (res.code) {
          // 发送 res.code 到后端换取 openId, sessionKey, unionId
          console.log('微信登录成功，code:', res.code)
          
          // 调用后端API，使用code获取用户信息和token
          authService.wxLogin(res.code)
            .then(response => {
              console.log('微信登录API响应:', response)
              if (response.code === 0 && response.data) {
                // token已在authService.wxLogin中保存
                
                // 更新状态
                setIsLoggedIn(true)
                setUserInfo(response.data.user)
                
                // 获取订单列表
                fetchOrders()
                
                Taro.showToast({
                  title: '登录成功',
                  icon: 'success'
                })
              } else {
                console.warn('微信登录API失败:', response)
                Taro.showToast({
                  title: response.message || '微信登录失败',
                  icon: 'none'
                })
              }
            })
            .catch(error => {
              console.error('微信登录API调用失败:', error)
              Taro.showToast({
                title: '微信登录失败',
                icon: 'none'
              })
            })
            .finally(() => {
              Taro.hideLoading()
              setLoginLoading(false)
            })
        } else {
          console.error('微信登录失败:', res)
          Taro.showToast({
            title: '微信登录失败',
            icon: 'none'
          })
          Taro.hideLoading()
          setLoginLoading(false)
        }
      },
      fail: function (err) {
        console.error('微信登录调用失败:', err)
        Taro.showToast({
          title: '微信登录调用失败',
          icon: 'none'
        })
        Taro.hideLoading()
        setLoginLoading(false)
      }
    })
  }
  
  // 登录
  const handleLogin = () => {
    if (isWeb) {
      handleH5Login()
    } else {
      handleMiniProgramLogin()
    }
  }
  
  // 退出登录
  const handleLogout = () => {
    console.log('开始退出登录')
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          authService.logout()
            .then(() => {
              console.log('退出登录成功')
              // 更新状态
              setIsLoggedIn(false)
              setUserInfo(null)
              setOrders([])
              
              Taro.showToast({
                title: '已退出登录',
                icon: 'success'
              })
            })
            .catch(error => {
              console.error('退出登录错误:', error)
              // 即使API调用失败，也清除本地token
              Taro.removeStorageSync('token')
              setIsLoggedIn(false)
              setUserInfo(null)
              setOrders([])
            })
        }
      }
    })
  }
  
  // 查看订单详情
  const handleViewOrder = (order: Order) => {
    Taro.showToast({
      title: `查看订单: ${order.orderNo}`,
      icon: 'none'
    })
  }
  
  // 管理项目列表
  const managementItems = [
    { id: 1, name: '我的订单', icon: '📦', action: () => Taro.showToast({ title: '查看我的订单', icon: 'none' }) },
    { id: 2, name: '账号设置', icon: '⚙️', action: () => Taro.showToast({ title: '账号设置', icon: 'none' }) },
    { id: 3, name: '系统设置', icon: '🔧', action: () => Taro.showToast({ title: '系统设置', icon: 'none' }) },
    { id: 4, name: '退出登录', icon: '🚪', action: handleLogout },
  ]
  
  // 订单列表列定义
  const orderColumns: TableColumn[] = [
    {
      title: '订单号',
      key: 'orderNo',
    },
    {
      title: '金额',
      key: 'totalAmount',
      render: (value) => <Text>¥{value.toFixed(2)}</Text>
    },
    {
      title: '状态',
      key: 'status',
      render: (value) => {
        let color = '#333'
        if (value === 'completed') color = '#52c41a'
        if (value === 'pending') color = '#faad14'
        if (value === 'paid') color = '#1677ff'
        if (value === 'shipped') color = '#1677ff'
        if (value === 'cancelled') color = '#ff4d4f'
        
        const statusMap: {[key: string]: string} = {
          pending: '待付款',
          paid: '已付款',
          shipped: '已发货',
          completed: '已完成',
          cancelled: '已取消'
        }
        
        return <Text style={{ color }}>{statusMap[value] || value}</Text>
      }
    },
    {
      title: '下单时间',
      key: 'created_at',
      render: (value) => <Text>{new Date(value).toLocaleString()}</Text>
    }
  ]
  
  // 登录页面
  if (!isLoggedIn) {
    return (
      <View className='login-container'>
        <View className='login-card'>
          <View className='login-header'>
            <Text className='login-title'>用户登录</Text>
            <Text className='login-subtitle'>登录后查看个人信息</Text>
          </View>
          
          {isWeb ? (
            // H5登录表单
            <View className='login-form'>
              <View className='form-item'>
                <Text className='form-label'>用户名</Text>
                <Input 
                  className='form-input'
                  placeholder='请输入用户名'
                  value={username}
                  onInput={e => setUsername(e.detail.value)}
                />
              </View>
              <View className='form-item'>
                <Text className='form-label'>密码</Text>
                <Input 
                  className='form-input'
                  password
                  placeholder='请输入密码'
                  value={password}
                  onInput={e => setPassword(e.detail.value)}
                />
              </View>
              <Button 
                text='登录' 
                type='primary' 
                block 
                loading={loginLoading}
                onClick={handleH5Login}
              />
            </View>
          ) : (
            // 小程序登录按钮
            <Button 
              text='微信一键登录' 
              type='primary' 
              block 
              loading={loginLoading}
              onClick={handleMiniProgramLogin}
            />
          )}
        </View>
      </View>
    )
  }
  
  // 个人信息页面
  return (
    <View className='profile-container'>
      {loading ? (
        <View className='profile-loading'>
          <Text>加载中...</Text>
        </View>
      ) : (
        <>
          {/* 用户信息卡片 */}
          <View className='user-card'>
            <Image className='user-avatar' src={userInfo?.avatar || 'https://picsum.photos/100/100'} />
            <View className='user-info'>
              <Text className='user-nickname'>{userInfo?.nickname || userInfo?.username}</Text>
              <Text className='user-username'>@{userInfo?.username}</Text>
            </View>
          </View>
          
          {/* 管理项目 */}
          <View className='management-section'>
            <Text className='section-title'>账号管理</Text>
            <View className='management-list'>
              {managementItems.map(item => (
                <View key={item.id} className='management-item' onClick={item.action}>
                  <View className='management-item-icon'>{item.icon}</View>
                  <Text className='management-item-name'>{item.name}</Text>
                  <View className='management-item-arrow'>›</View>
                </View>
              ))}
            </View>
          </View>
          
          {/* 订单列表 */}
          <View className='orders-section'>
            <Text className='section-title'>最近订单</Text>
            <Table 
              columns={orderColumns} 
              dataSource={orders} 
              onRowClick={handleViewOrder}
              loading={orderLoading}
            />
          </View>
        </>
      )}
    </View>
  )
} 