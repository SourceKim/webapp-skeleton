export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/general/index',
    'pages/resource/index',
    'pages/mall/index',
    'pages/mall/detail',
    'pages/mall/order-detail/index',
    'pages/mall/order-list/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro应用',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1677ff',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/general/index',
        text: '首页'
      },
      {
        pagePath: 'pages/resource/index',
        text: '资源'
      },
      {
        pagePath: 'pages/mall/index',
        text: '商城'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
