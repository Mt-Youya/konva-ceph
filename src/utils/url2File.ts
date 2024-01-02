// 将Blob转为File对象
export function blobToFile(blob: Blob, name: string) {
    return new File([blob], name, { type: blob.type })
}

async function getArrayBuffer(url: string) {
    const res = await fetch(url)
    return res.arrayBuffer()
}

export async function urlToFile(url: string, filename: string) {
    const buffer = await getArrayBuffer(url)
    const blob = new Blob([buffer])
    return blobToFile(blob, filename)
}
