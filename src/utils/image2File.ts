export function imageToFileByCanvas(image: HTMLImageElement, fileName: string = "image.jpg"): Promise<File> {
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height

    const ctx = canvas.getContext("2d")!
    ctx.drawImage(image, 0, 0)

    return new Promise(resolve => canvas.toBlob(blob => resolve(new File([blob!], fileName))))
}

export function imageToFileByBlob(image: HTMLImageElement, fileName: string = "image.jpg") {
    const binStr = atob(image.src.split(",")[1])
    const len = binStr.length
    const arr = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i)
    }

    const blob = new Blob([arr], { type: "image/png" })
    return new File([blob], fileName)
}

