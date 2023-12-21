export function dataURLtoBlob(dataUrl: string) {
    const arr = dataUrl.split(",")! //分割为数组，分割到第一个逗号
    const mime = arr[0].match(/:(.*?);/)?.[1] //获取分割后的base64前缀中的类型
    const bstr = window.atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })//文件类型格式
}
