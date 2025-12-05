 
 
export async function switchLocale(_data: any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 200,
                message: '切换语言成功',
                data: {}
            })
        }, 1000)
    })
}