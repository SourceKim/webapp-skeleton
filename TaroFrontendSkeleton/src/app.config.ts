export default defineAppConfig({
  pages: [
    'pages/general/index',
    'pages/resource/index',
    'pages/mall/index',
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
        text: '通用',
        iconPath: 'assets/icons/general.png',
        selectedIconPath: 'assets/icons/general-active.png'
      },
      {
        pagePath: 'pages/resource/index',
        text: '资源',
        iconPath: 'assets/icons/resource.png',
        selectedIconPath: 'assets/icons/resource-active.png'
      },
      {
        pagePath: 'pages/mall/index',
        text: '商城',
        iconPath: 'assets/icons/mall.png',
        selectedIconPath: 'assets/icons/mall-active.png'
      },
      // {
      //   pagePath: 'pages/profile/index',
      //   text: '我的',
      //   iconPath: 'assets/icons/profile.png',
      //   selectedIconPath: 'assets/icons/profile-active.png'
      // }
    ]
  }
})
