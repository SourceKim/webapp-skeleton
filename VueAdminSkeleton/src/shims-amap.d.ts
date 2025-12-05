/**
 * @amap/amap-jsapi-loader 类型声明
 */
declare module '@amap/amap-jsapi-loader' {
  interface AMapLoaderOptions {
    key: string
    version: string
    plugins?: string[]
  }

  interface AMapLoader {
    load(options: AMapLoaderOptions): Promise<any>
  }

  const AMapLoader: AMapLoader
  export default AMapLoader
}
