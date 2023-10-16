import type { TCtx2D } from "@/types/canvasCtx"

export function drawCircle(x: number, y: number, ctx: TCtx2D) {
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()
}

export function drawLine(startX: number, startY: number, endX: number, endY: number, ctx: TCtx2D) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = "blue"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()
}

export function addText(text: string, x: number, y: number, ctx: TCtx2D) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "black"
    ctx.fillText(text, x, y)
}
