export async function dataURLtoBlob(dataUrl: string) {
    const base64 = await convertImgToBase64(dataUrl)
    const arr = base64.split(",")
    const mime = arr[0].match(/:(.*?);/)![1]
    const binaryData = atob(arr[1])
    const arrayBuffer = new ArrayBuffer(binaryData.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i)
    }
    return new Blob([uint8Array], { type: mime })
}

function convertImgToBase64(src: string): Promise<string> {
    const img = new Image
    img.src = src
    return new Promise((resolve) => {
        img.onload = function() {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")!
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const base64URL = canvas.toDataURL("image/png")
            resolve(base64URL)
        }
    })
}
