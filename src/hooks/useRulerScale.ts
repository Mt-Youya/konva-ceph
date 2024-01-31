import type { IPointItem } from "@/stores/home/useDataPoints"

export function useRulerScale(pointList: IPointItem[], unitLength: number) {
    const [r1, r2] = pointList.filter(item => item.name === "ruler1" || item.name === "ruler2")
    const rulerScale = Math.abs(r2.gps[1] - r1.gps[1])
    const unit = unitLength * 10
    return unit / rulerScale
}
