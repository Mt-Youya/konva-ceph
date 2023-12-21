import { BurstoneAlgo } from "./BurstonePoints"
import { Points_Names } from "../constants/common"
import { getPureMeasureProject } from "./utils"
import { point2LineDistance, point2PointDistance } from "@/features"
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
            "AFH&mm": ["PNS", "ANS", "Me"],
            "PFH&mm": ["Ar", "Go"],
            "PFH/AFH&rate": ["PNS", "ANS", "Me", "Ar", "Go"],
            "OP-FH&deg": [...Points_Names.OP, ...Points_Names.FH],
            "L1-MP&deg": ["Go1", "Me", ...Points_Names.FH],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "FMA&deg", "L1-MP&deg"],
            opAngle: ["OP-FH&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            normal3: [...this.distanceAlgo.normal3, "AFH&mm"],
            normal2: [...this.distanceAlgo.normal2, "PFH&mm"],
            Wits: ["Wits&mm"],
        }

        this.rateAlgo = {
            ...this.rateAlgo,
            "PFH/AFH&Rate": ["PFH/AFH&rate"],
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

    #handleRatePFHAFH(xyPoints: IPoint[]) {
        const [PNS, ANS, Me, Ar, Go] = xyPoints
        const numerator = point2LineDistance(Me, PNS, ANS)
        const denominator = point2PointDistance(Go, Ar)
        return numerator * 100 / denominator
    }
}

export default new TweedAlgo
