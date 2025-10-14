export const uploadFile = (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('https://www.baidu.com')
    }, 1000)
  })
}


export const queryFileList = (params: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('https://www.baidu.com')
    }, 1000)
  })
}