import { BurstoneAlgo } from "./BurstonePoints"
import { Points_Names } from "../constants/common"
import { getPureMeasureProject } from "./utils"
import { getLine2LineIntersection, point2LineDistance, point2PointDistance } from "@/features"
import points from "@/constants/algosTableData/Tweed.json"

import type { IPoint } from "@/types"

class TweedAlgo extends BurstoneAlgo {
    name = "Tweed"

    constructor() {
        super()
        this.algorithm = {
            // ...this.algorithm,
            ...getPureMeasureProject(points, this.algorithm),
            "FMA&deg": ["Go1", "Me", ...Points_Names.FH],
            "AFH&mm": ["Me", "PNS", "ANS"],
            "PFH&mm": ["Ar", "Go2", "Go1", "Me"],
            "PFH/AFH&rate": ["Me", "PNS", "ANS", "Ar", "Go2", "Go1", "Me"],
            "OP-FH&deg": [...Points_Names.OP, ...Points_Names.FH],
            "L1-MP&deg": [...Points_Names.L1Line, "Go1", "Me"],
            "Wits&mm": ["A", "B", ...Points_Names.OP],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "FMA&deg", "L1-MP&deg"],
            opAngle: ["OP-FH&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            normal3: [...this.distanceAlgo.normal3, "AFH&mm"],
            PFH: ["PFH&mm"],
            Wits: ["Wits&mm"],
        }

        this.rateAlgo = {
            ...this.rateAlgo,
            "PFH/AFH&Rate": ["PFH/AFH&rate"],
        }
    }

    handleDistance(points: IPoint[], key: string) {
        const data = super.handleDistance(points, key)
        if (data) return data
        switch (key) {
            case "PFH":
                return this.#handlePFH(points)
        }
    }

    handleRate(points: IPoint[], key: string) {
        const data = super.handleRate(points, key)
        if (data) return data
        switch (key) {
            case "rateNormal":
                return this.#handleRateNormal(points)
            case "PFH/AFH&Rate":
                return this.#handleRatePFHAFH(points)
            default:
                return
        }
    }

    #handleRateNormal(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4] = xyPoints
        const dis1 = point2PointDistance(p1, p2)
        const dis2 = point2PointDistance(p3, p4)
        return dis1 * 100 / dis2
    }

    #handlePFH(xyPoints: IPoint[]) {
        const [Ar, Go2, Go1, Me] = xyPoints
        const Pi = getLine2LineIntersection(Ar, Go2, Go1, Me)
        return point2PointDistance(Ar, Pi)
    }

    #handleRatePFHAFH(xyPoints: IPoint[]) {
        const [dync, f1, f2, ...params] = xyPoints
        const denominator = point2LineDistance(dync, f1, f2)
        const numerator = this.#handlePFH(params)
        return numerator * 100 / denominator
    }

}

export default new TweedAlgo
