import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { productService, cartService, Product, AddToCartParams } from '../../services'
import './index.scss'

export default function Mall() {
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<{[key: string]: number}>({})
  const [loading, setLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  
  useLoad(() => {
    console.log('Mall page loaded.')
    fetchCategories()
    fetchCart()
  })

  // 获取商品分类
  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories()
      if (response.code === 0 && response.data) {
        setCategories(response.data)
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0])
          fetchProducts(response.data[0])
        }
      }
    } catch (error) {
      console.error('获取分类错误:', error)
      Taro.showToast({
        title: '获取分类失败',
        icon: 'none'
      })
    }
  }

  // 获取商品列表
  const fetchProducts = async (category: string) => {
    setLoading(true)
    try {
      const response = await productService.getProducts({ category })
      if (response.code === 0 && response.data) {
        setProducts(response.data.data)
      }
    } catch (error) {
      console.error('获取商品错误:', error)
      Taro.showToast({
        title: '获取商品失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 获取购物车
  const fetchCart = async () => {
    try {
      const response = await cartService.getCart()
      if (response.code === 0 && response.data) {
        const cartMap: {[key: string]: number} = {}
        response.data.forEach(item => {
          cartMap[item.productId] = item.quantity
        })
        setCart(cartMap)
      }
    } catch (error) {
      console.error('获取购物车错误:', error)
    }
  }
  
  // 计算购物车中的商品总数
  const cartItemCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    fetchProducts(category)
  }
  
  const handleAddToCart = async (product: Product) => {
    setCartLoading(true)
    
    try {
      const params: AddToCartParams = {
        productId: product.id,
        quantity: 1
      }
      
      const response = await cartService.addToCart(params)
      
      if (response.code === 0 && response.data) {
        setCart(prev => ({
          ...prev,
          [product.id]: (prev[product.id] || 0) + 1
        }))
        
        Taro.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1500
        })
      } else {
        Taro.showToast({
          title: response.message || '加入购物车失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加入购物车错误:', error)
      Taro.showToast({
        title: '加入购物车失败',
        icon: 'none'
      })
    } finally {
      setCartLoading(false)
    }
  }
  
  const handleViewCart = () => {
    if (cartItemCount === 0) {
      Taro.showToast({
        title: '购物车为空',
        icon: 'none'
      })
      return
    }
    
    // 这里可以跳转到购物车页面
    Taro.showToast({
      title: '查看购物车功能开发中',
      icon: 'none'
    })
  }

  return (
    <View className='mall-container'>
      <View className='mall-header'>
        <Text className='mall-title'>商城</Text>
        <View className='mall-cart' onClick={handleViewCart}>
          <Text className='mall-cart-text'>购物车</Text>
          {cartItemCount > 0 && (
            <View className='mall-cart-badge'>{cartItemCount}</View>
          )}
        </View>
      </View>
      
      <ScrollView scrollX className='category-scroll'>
        <View className='category-list'>
          {categories.map(category => (
            <View 
              key={category}
              className={`category-item ${selectedCategory === category ? 'category-item-active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <Text className='category-name'>{category}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View className='product-list'>
        {loading ? (
          <View className='loading-products'>
            <Text>加载中...</Text>
          </View>
        ) : products.length === 0 ? (
          <View className='empty-products'>
            <Text>暂无商品</Text>
          </View>
        ) : (
          products.map(product => (
            <Card
              key={product.id}
              title={product.name}
              image={product.image}
              description={product.description}
              price={product.price}
              extra={
                <Button 
                  text='加入购物车' 
                  size='small'
                  type='primary'
                  loading={cartLoading}
                  onClick={() => handleAddToCart(product)}
                />
              }
            />
          ))
        )}
      </View>
    </View>
  )
} 