# 介绍

使用 taro 实现的前端骨架工程，以小程序为主，用以测试业务 api

- 前端 Typescript
- 打包 vite
- 前端框架 Vue
- 样式 scss
- 布局 flexbox

# 相关文档

![taro 文档](https://docs.taro.zone/docs/)
![taro api](https://docs.taro.zone/docs/apis/about/desc)
![swagger 业务 api 文档](http://localhost:3000/api-docs.json)

# 功能

一共 4 个功能，分别位于 4 个 tab:

1. 通用: 提供通用的功能测试或者接口测试，以 table 的形式的形式展示，左侧是功能名，右侧是测试结果，点击某行按需进行测试，如有需要会弹出测试参数 popup
2. 资源: 提供上传功能，以及一个我的资源的 table, 对已上传资源的显示, 删除
3. 商城: 商城界面，提供一个商品分类选择器，以及对应分类的商品列表 card，包含图片，介绍，价格，加入购物车按钮
4. 我的: 个人信息管理页面，如果未登录跳转到登录页面，已登录用户展示用户信息，以及一个 table 用以管理用户信息，包含订单信息，账号设置，系统设置，退出登录等

# 调试

1. 安装依赖 `yarn install`
2. 运行 h5 `yarn dev:h5`
