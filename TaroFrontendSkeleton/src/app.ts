import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // 应用初始化逻辑
    console.log('App mounted')
    
    // 检查网络状态
    Taro.getNetworkType({
      success: function (res) {
        console.log('当前网络类型：', res.networkType)
      }
    })
  }

  componentDidShow() {
    console.log('App showed')
  }

  componentDidHide() {
    console.log('App hidden')
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return this.props.children
  }
}

export default App
