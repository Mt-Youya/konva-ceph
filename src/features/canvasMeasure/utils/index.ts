import randomUUID from "@/utils/randomUUID"

import type { IPoint } from "@/types"
import type { TReturnI2VPos } from "@/pages/home/algorithms/common"

const { ceil, sqrt, cos, sin, acos, abs, PI } = Math

export function createLabelStyle(leftX: number, topY: number, color = "#83ECCB", bgColor = "#32393F") {
    return {
        left: ceil(leftX) + 10 + "px",
        top: ceil(topY) + "px",
        color,
        backgroundColor: bgColor,
        borderRadius: "2px",
        padding: "6px",
        border: "1px solid #414141",
        transform: "none",
        zIndex: 99999999999999,
    }
}

/**
 * 通过计算夹角余弦值利用反余弦得到角度,向量方向为 P(2n) - P(2n-1)
 * @param p1 {IPoint} 向量a的起点
 * @param p2 {IPoint} 向量a的终点
 * @param p3 {IPoint} 向量b的起点
 * @param p4 {IPoint} 向量b的终点
 * @return angle 角度
 * @example measureAngle(p1,p2,p3,p4)
 */
export function measureAngle(p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint) {
    const Va = { x: p2.x - p1.x, y: p2.y - p1.y }
    const Vb = { x: p4.x - p3.x, y: p4.y - p3.y }
    const dotProduct = Va.x * Vb.x + Va.y * Vb.y
    const magnitudeV1 = sqrt(Va.x * Va.x + Va.y * Va.y)
    const magnitudeV2 = sqrt(Vb.x * Vb.x + Vb.y * Vb.y)
    const cosAngle = dotProduct / (magnitudeV1 * magnitudeV2)
    // const angle = atan2(Va.y, Va.x) - atan2(Vb.y, Vb.x) // 待验证 atan2
    return acos(cosAngle) * (180 / PI)
}

/**
 * 点到直线的距离
 * @param P  {IPoint} 点
 * @param Pa {IPoint} 直线上的点a
 * @param Pb {IPoint} 直线上的点b
 * @return distance 距离
 */
export function point2LineDistance(P: IPoint, Pa: IPoint, Pb: IPoint) {
    const { x: x0, y: y0 } = P
    const { x: x1, y: y1 } = Pa
    const { x: x2, y: y2 } = Pb
    if (x1 === x2 && y1 === y2) {
        return sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0))
    }

    const numerator = abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1)
    const denominator = sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
    return numerator / denominator
}

/**
 * 计算点到直线的垂足交点坐标
 * @param P  {IPoint} 点
 * @param Pa {IPoint} 直线上的一点
 * @param Pb {IPoint} 直线上的另点
 * @return Pi 垂足坐标
 */
export function point2LineIntersection(P: IPoint, Pa: IPoint, Pb: IPoint) {
    const { x: x0, y: y0 } = P
    const { A, B, C } = calculateLineEquation(Pa, Pb)

    const Dx = (B * B * x0 - A * B * y0 - A * C) / (A * A + B * B)
    const Dy = (-A * B * x0 + A * A * y0 - B * C) / (A * A + B * B)

    return { x: Dx, y: Dy }
}

/**
 * 计算两点的距离
 * @param Pa {IPoint} 点a
 * @param Pb {IPoint} 点b
 * @return distance 距离
 */
export function point2PointDistance(Pa: IPoint, Pb: IPoint) {
    const { x: x1, y: y1 } = Pa
    const { x: x2, y: y2 } = Pb

    const dx = x2 - x1
    const dy = y2 - y1
    return sqrt(dx ** 2 + dy ** 2)
}

/**
 * 获取旋转后的坐标系与原坐标系的夹角
 * @param Pa {IPoint} 旋转后的坐标系x'轴上的一点
 * @param Pb {IPoint} 旋转后的坐标系x'轴上的一点
 * @return angle 夹角
 */
export function getOriginPointIncludeAngle(Pa: IPoint, Pb: IPoint) {
    const x1 = { x: 1, y: 0 }
    const origin = { x: 0, y: 0 }
    return measureAngle(x1, origin, Pa, Pb)
}

export const pointInVectorSymbol = Symbol("pointInVector" + randomUUID())

/**
 * 根据叉乘获取点在向量的位置
 * @param P  {IPoint} 点
 * @param Pa {IPoint} 向量的起点
 * @param Pb {IPoint} 向量的终点
 * @return position 左侧/右侧/向量内部
 */
export function getPoint2VectorPosition(P: IPoint, Pa: IPoint, Pb: IPoint) {
    const { x: x0, y: y0 } = P
    const { x: x1, y: y1 } = Pa
    const { x: x2, y: y2 } = Pb

    const crossProduct = (x2 - x0) * (y1 - y0) - (y2 - y0) * (x1 - x0)

    if (crossProduct > 0) return "left"
    if (crossProduct < 0) return "right"
    return pointInVectorSymbol
}

/**
 * 获取斜率
 * @param Pa {IPoint} 直线上的一点
 * @param Pb {IPoint} 直线上的另一点
 * @return k 斜率 返回 null: 斜率不存在
 */
export function getSlope(Pa: IPoint, Pb: IPoint) {
    const { x: x1, y: y1 } = Pa
    const { x: x2, y: y2 } = Pb

    const xi = x2 - x1
    if (xi === 0) return null

    const yi = y2 - y1
    if (yi === 0) return 0

    return yi / xi
}

/**
 * 已知一点P,求经过旋转θ°后的坐标
 * @param x {number} P点x坐标
 * @param y {number} P点y坐标
 * @param theta {number} 旋转角度 θ
 * @return rotatedPoint 旋转后的坐标
 */
export function getRotatedPoint(x: number, y: number, theta: number) {
    const rad = (theta * PI) / 180
    const slope = x * y
    if (slope > 0) {
        const Px = x * cos(rad) + y * sin(rad)
        const Py = y * cos(rad) - x * sin(rad)
        return { x: Px, y: Py }
    }
    if (slope < 0) {
        const Px = x * cos(rad) - y * sin(rad)
        const Py = y * cos(rad) + x * sin(rad)
        return { x: Px, y: Py }
    }
    return { x, y }
}

export const parallelSymbol = Symbol("parallel" + randomUUID())

/**
 * 获取向量所在直线的点相对于向量的位置
 * @param P  {IPoint} 交点
 * @param Pa {IPoint} 向量的起点
 * @param Pb {IPoint} 向量的终点
 * @return position 位置: 前方/后方/向量内部
 */
export function getIntersection2VectorPosition(P: IPoint, Pa: IPoint, Pb: IPoint) {
    const { x: x0, y: y0 } = P
    const { x: x1, y: y1 } = Pa
    const { x: x2, y: y2 } = Pb
    if (x1 === x2 && y1 === y2) {
        throw Error("Two Points Coincide!")
    }
    if (x1 === x2) {
        if (y2 > y1) {
            if (y0 > y2) return "front"
            if (y0 < y1) return "back"
            return parallelSymbol
        } else {
            if (y0 < y2) return "front"
            if (y0 > y1) return "back"
            return parallelSymbol
        }
    }
    if (x2 > x1) {
        if (x0 < x1) return "back"
        if (x0 > x2) return "front"
        return parallelSymbol
    } else {
        if (x0 > x1) return "back"
        if (x0 < x2) return "front"
        return parallelSymbol
    }
}

/**
 * 获取直线一般式方程
 * @param Pa {IPoint} 直线上的一点
 * @param Pb {IPoint} 直线上的另一点
 */
export function calculateLineEquation(Pa: IPoint, Pb: IPoint) {
    const { x: x1, y: y1 } = Pa
    const { x: x2, y: y2 } = Pb
    const A = y2 - y1
    const B = x1 - x2
    // const C = x1 * y2 - x2 * y1
    const C = x2 * y1 - x1 * y2
    return { A, B, C }
}

/**
 * 获取两条直线的交点坐标
 * @param p1 {IPoint} 直线l1上的一点
 * @param p2 {IPoint} 直线l1上的另一点
 * @param p3 {IPoint} 直线l2上的一点
 * @param p4 {IPoint} 直线l2上的另一点
 * @return Pi 交点坐标
 */
export function getLine2LineIntersection(p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint) {
    const l1 = calculateLineEquation(p1, p2)
    const l2 = calculateLineEquation(p3, p4)

    if (l1.A === l2.A && l1.B === l2.B) {
        throw Error("Two Lines Parallel!")
    }

    const x = (l1.C * l2.B - l2.C * l1.B) / (l1.A * l2.B - l2.A * l1.B)
    const y = (l1.A * l2.C - l2.A * l1.C) / (l1.A * l2.B - l2.A * l1.B)

    return {
        x,
        y,
    }
}

// 根据Pa Pb 与水平线的夹角获取 P 经过旋转 夹角度数 后的坐标
export function getRotatedPointByAngle(P: IPoint, Pa: IPoint, Pb: IPoint) {
    const includeAngle = getOriginPointIncludeAngle(Pa, Pb)
    return getRotatedPoint(P.x, P.y, includeAngle)
}

// 以 Po为原点旋转theta 角度后的坐标
export function getRotatedPointByPoint(P: IPoint, Po: IPoint, theta: number) {
    const { x: x0, y: y0 } = Po
    const { x: x1, y: y1 } = P
    const x = x1 - x0
    const y = y1 - y0
    const { x: rx, y: ry } = getRotatedPoint(x, y, theta)
    return { x: rx + x0, y: ry + y0 }
}

// 以 Po为原点旋转theta 角度后的直线一般式方程
export function getRotatedEquationByTheta(Pa: IPoint, Pb: IPoint, theta: number, Po: IPoint) {
    const deltaX = Pb.x - Po.x
    const deltaY = Pb.y - Po.y

    const rotatedX = Po.x + deltaX * cos(theta) - deltaY * sin(theta)
    const rotatedY = Po.y + deltaX * sin(theta) + deltaY * cos(theta)

    const A = rotatedY - Pa.y
    const B = Pa.x - rotatedX
    const C = Pa.x * rotatedY - rotatedX * Pa.y

    return { A, B, C }
}

export function judgeMinusAngle(Pa: TReturnI2VPos, Pb: TReturnI2VPos) {
    if (Pa === "front" && Pb !== "back") {
        return -1
    }
    if (Pa === parallelSymbol && Pb === "front") {
        return -1
    }
    return 1
}
