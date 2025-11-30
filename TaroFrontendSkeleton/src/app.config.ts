export default defineAppConfig({
  pages: [
    'pages/general/index',
    'pages/login/index',
    'pages/store-intro/index',
    'pages/mall/index',
    'pages/mall/sub/index',
    'pages/mall/detail',
    'pages/mall/order-confirm/index',
    'pages/mall/order-list/index',
    'pages/mall/order-detail/index',
    'pages/profile/index',
    'pages/profile/detail/index',
    'pages/address/index',
    'pages/address/form/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro应用',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#8c8c8c',
    selectedColor: '#fa2c19',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/general/index',
        text: '首页'
      },
      {
        pagePath: 'pages/store-intro/index',
        text: '店铺'
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
