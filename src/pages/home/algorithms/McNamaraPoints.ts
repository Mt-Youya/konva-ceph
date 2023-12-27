import { Points_Names } from "../constants/common"
import { getRotatedPointByAngle } from "@/features"
import CommonAlgo from "./common"

import type { IPoint } from "@/types"

export class McNamaraAlgo extends CommonAlgo {
    name = "McNamara"

    constructor() {
        super()
        this.algorithm = {
            ...this.algorithm,
            "A-Np&mm": ["N", "A", ...Points_Names.FH],
            "U1-A&mm": ["A", "U1", ...Points_Names.FH],
            "Pog-Np&mm": ["N", "Pog", ...Points_Names.FH],
            "Co-A&mm": ["Co", "A"],
            "Co-Gn&mm": ["Co", "Gn"],
            "ANS-Me&mm": ["ANS", "Me"],
            "L1-APog&mm": ["L1", "A", "Pog"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            normal2: ["Co-A&mm", "Co-Gn&mm", "ANS-Me&mm"],
            normal3: [...this.distanceAlgo.normal3, "L1-APog&mm"],
            distanceLeftSideMinus: [...this.distanceAlgo.distanceLeftSideMinus],
            rotatedVerticalLeftMinus: ["A-Np&mm", "U1-A&mm", "Pog-Np&mm"],
        }
    }

    handleDistance(points: IPoint[], key: string): any | undefined {
        const data = super.handleDistance(points, key)
        if (data) return data
        switch (key) {
            case "normal2":
                return this.#handleNormal2(points)
            case "rotatedVerticalLeftMinus":
                return this.#handleRotatedVerticalLeftMinus(points)
            default:
                return
        }
    }

    #handleNormal2(xyPoints: IPoint[]) {
        const [p1, p2] = xyPoints
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    }

    #handleRotatedVerticalLeftMinus(xyPoints: IPoint[]) {
        const [p1, p2, f1, f2] = xyPoints
        const rP1 = getRotatedPointByAngle(p1, f1, f2)
        const rP2 = getRotatedPointByAngle(p2, f1, f2)
        // console.log("rP1", rP1, "rP2", rP2)
        return rP1.x - rP2.x
    }
}

export default new McNamaraAlgo
