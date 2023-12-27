import { Points_Names } from "../constants/common"
import { getSlope, measureAngle } from "@/features"
import CommonAlgo from "./common"

import type { IPoint } from "@/types"

export class PerkingUniversityAlgo extends CommonAlgo {
    name = "PerkingUniversity"
    constructor() {
        super()
        this.algorithm = {
            ...this.algorithm,
            "FH-NPo&deg": [...Points_Names.HF, ...Points_Names.NPo],
            "NA-APo&deg": [...Points_Names.AN, ...Points_Names.Apo],
            "Po-NB&mm": ["Pog", ...Points_Names.BN],
            "L1-MP&deg": [...Points_Names.L1Line, "Go1", "Me"],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleLeftSideMinus: ["NA-APo&deg"],
            angleNormal: [...this.angleAlgo.angleNormal, "FH-NPo&deg", "L1-MP&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            distanceLeftSideMinus: [...this.distanceAlgo.distanceLeftSideMinus, "Po-NB&mm"],
        }
    }

    handleAngle(points: IPoint[], key: string) {
        const data = super.handleAngle(points, key)
        if (data) return data
        switch (key) {
            case "angleLeftSideMinus":
                return this.#handleAngleLeftSideMinus(points)
            default:
                return
        }
    }

    #handleAngleLeftSideMinus(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4] = xyPoints
        const angle = measureAngle(p1, p2, p3, p4)
        const slop1 = getSlope(p1, p2)!
        const slop2 = getSlope(p3, p4)!
        if (slop1 < slop2) {
            return -angle
        }
        return angle
    }
}

export default new PerkingUniversityAlgo
