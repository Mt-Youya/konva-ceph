import { anglePointMap, distancePointMap, POINTS_CONSTANTS, ratePointMap } from "../constants/common"
import {
    getIntersection2VectorPosition, getLine2LineIntersection, getPoint2VectorPosition,
    measureAngle, point2LineDistance, point2LineIntersection, point2PointDistance,
    pointInVectorSymbol, getRotatedPointByAngle, judgeMinusAngle,
} from "@/features"

import type { IPoint } from "@/types"

export type TReturnI2VPos = ReturnType<typeof getIntersection2VectorPosition>

class CommonAlgo {
    name = "Common"
    algorithm
    angleAlgo
    distanceAlgo
    rateAlgo

    constructor() {
        this.algorithm = POINTS_CONSTANTS
        this.angleAlgo = anglePointMap
        this.distanceAlgo = distancePointMap
        this.rateAlgo = ratePointMap
    }

    handleAngle(points: IPoint[], key: string) {
        switch (key) {
            case "angleNormal":
                return this.#handleAngleNormal(points)
            case "center":
                return this.#handleCenter(points)
            case "reverse":
                return this.#handleReverse(points)
            case "rightThan":
                return this.#handleRightThan(points)
            case "opAngle":
                return this.#handleOPAngle(points)
            default:
                return
        }
    }

    handleDistance(points: IPoint[], key: string) {
        switch (key) {
            case "distanceLeftSideMinus":
                return this.#handleDistanceLeftSideMinus(points)
            case "rotatedIntersections4":
                return this.#handleRotatedIntersections4(points)
            case "normal3":
                return this.#handleNormal3(points)
            case "normal4":
                return this.#handleNormal4(points)
            case "rotatedVerticalNormal":
                return this.#handleRotatedVerticalNormal(points)
            default:
                return
        }
    }

    handleRate(points: IPoint[], key: string) {
        switch (key) {
            case "baseNormalVertical":
                return this.#handleRateMMBaseNormal(points)
            default:
                return
        }
    }

    #handleAngleNormal(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4] = xyPoints
        return measureAngle(p1, p2, p3, p4)
    }

    #handleCenter(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4, p5, p6] = xyPoints
        const c1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
        const c2 = { x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 }
        const angle = measureAngle(c1, c2, p5, p6)
        return this.#handleShouldJudgePositions([c1, c2, p5, p6], angle)
    }

    #handleOPAngle(xyPoints: IPoint[]) {
        const [U6, L6, U1, L1, Po, Or] = xyPoints
        const c1 = { x: (U6.x + L6.x) / 2, y: (U6.y + L6.y) / 2 }
        const c2 = { x: (U1.x + L1.x) / 2, y: (U1.y + L1.y) / 2 }
        return measureAngle(c1, c2, Po, Or)
    }

    #handleRightThan(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4, p5] = xyPoints
        const Pa = point2LineIntersection(p1, p4, p5)
        const Pb = point2LineIntersection(p3, p4, p5)
        return Pa.x > Pb.x ? measureAngle(p1, p2, p4, p5) : measureAngle(p3, p2, p4, p5)
    }

    #handleReverse(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4] = xyPoints
        const angle = measureAngle(p1, p2, p3, p4)
        return this.#handleShouldJudgePositions(xyPoints, angle)
    }

    #handleShouldJudgePositions(points: IPoint[], angle: number) {
        const [p1, p2, p3, p4] = points
        try {
            const Pi = getLine2LineIntersection(p1, p2, p3, p4)!
            const Pa = getIntersection2VectorPosition(Pi, p1, p2)
            const Pb = getIntersection2VectorPosition(Pi, p3, p4)
            return angle * judgeMinusAngle(Pa, Pb)
        } catch (err) {
            console.error(err)
            return ""
        }
    }

    #handleDistanceLeftSideMinus(xyPoints: IPoint[]) {
        const [dync1, f1, f2] = xyPoints

        const distance = f1.y < f2.y ? point2LineDistance(dync1, f1, f2) : point2LineDistance(dync1, f2, f1)
        const position = getPoint2VectorPosition(dync1, f1, f2)

        if (position === pointInVectorSymbol) {
            return 0
        } else if (position === "left") {
            return -distance
        }
        return distance
    }

    #handleRotatedIntersections4(xyPoints: IPoint[]) {
        const [dync1, dync2, f1, f2] = xyPoints
        const foot1 = point2LineIntersection(dync1, f1, f2)
        const foot2 = point2LineIntersection(dync2, f1, f2)
        const distance = point2PointDistance(foot1, foot2)
        const position = getPoint2VectorPosition(dync2, dync1, foot1)
        if (position === pointInVectorSymbol) {
            return 0
        }
        if (position === "left") {
            return -distance
        }
        return distance
    }

    #handleNormal3(xyPoints: IPoint[]) {
        const [dync1, f1, f2] = xyPoints
        return f1.y < f2.y ? point2LineDistance(dync1, f1, f2) : point2LineDistance(dync1, f2, f1)
    }

    #handleNormal4(xyPoints: IPoint[]) {
        const [dync1, dync2, f1, f2] = xyPoints
        const foot1 = point2LineIntersection(dync1, f1, f2)
        const foot2 = point2LineIntersection(dync2, f1, f2)
        return point2PointDistance(foot1, foot2)
    }

    #handleRotatedVerticalNormal(xyPoints: IPoint[]) {
        const [dync1, dync2, f1, f2] = xyPoints
        const rP1 = getRotatedPointByAngle(dync1, f1, f2)
        const rP2 = getRotatedPointByAngle(dync2, f1, f2)
        // console.log("rP1, rP2",rP1, rP2,Math.abs(rP2.y - rP1.y))
        return Math.abs(rP2.y - rP1.y)
    }

    #handleRateMMBaseNormal(xyPoints: IPoint[]) {
        const [dync1, dync2, dync3, dync4, f1, f2] = xyPoints

        const rP1 = getRotatedPointByAngle(dync1, f1, f2)
        const rP2 = getRotatedPointByAngle(dync2, f1, f2)
        const rP3 = getRotatedPointByAngle(dync3, f1, f2)
        const rP4 = getRotatedPointByAngle(dync4, f1, f2)

        const numerator = Math.abs(rP2.y - rP1.y)
        const denominator = Math.abs(rP4.y - rP3.y)
        return (100 * numerator) / denominator
    }
}

export default CommonAlgo
