import type { TCtx2D } from "@/types/canvasCtx"

const gridSize = 20 // 网格大小
const gridColor = "#ccc" // 网格线条颜色
const lineWidth = 1 // 网格线条宽度

export function drawHorizontalGrid(ctx: TCtx2D, canvas: HTMLCanvasElement) {
    ctx.beginPath()
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
    }
    ctx.strokeStyle = gridColor
    ctx.lineWidth = lineWidth
    ctx.stroke()
}

// 绘制垂直网格线
export function drawVerticalGrid(ctx: TCtx2D, canvas: HTMLCanvasElement) {
    ctx.beginPath()
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
    }
    ctx.strokeStyle = gridColor
    ctx.lineWidth = lineWidth
    ctx.stroke()
}
