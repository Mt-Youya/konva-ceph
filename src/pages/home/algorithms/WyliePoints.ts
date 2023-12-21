import { BurstoneAlgo } from "./BurstonePoints"
import { Points_Names } from "../constants/common"
import { getRotatedPointByAngle } from "@/features"

import type { IPoint } from "@/types"

export class WylieAlgo extends BurstoneAlgo {
    name = "Wylie"
    distanceRate = ["N-ANS/N-Me&rate"]

    constructor() {
        super()

        this.algorithm = {
            ...this.algorithm,
            "Co-S&mm": ["Co", "S"],
            "S-Ptm&mm": ["S", "Ptm", ...Points_Names.FH],
            "ANS-Ptm&mm": ["ANS", "Ptm", ...Points_Names.FH],
            "Co-Pog&mm": ["Co", "Pog"],
            "N-ANS/N-Me&rate": ["N", "ANS", ...Points_Names.NME, ...Points_Names.FH],
            "N-Me&mm": ["N", "Me"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            rotatedHorizontalNormal: ["S-Ptm&mm", "ANS-Ptm&mm"],
            normal2: [...this.distanceAlgo.normal2, "Co-S&mm", "Co-Pog&mm", "N-Me&mm"],
        }

        this.rateAlgo = {
            ...this.rateAlgo,
            rotatedHorizontalNormalByFH: ["N-ANS/N-Me&rate"],
        }
    }

    public handleDistance(points: IPoint[], key: string): any | undefined {
        const data = super.handleDistance(points, key)
        if (data) return data
        switch (key) {
            case "rotatedHorizontalNormal":
                return this.#handleRotatedHorizontalNormal(points)
            default:
                return
        }
    }

    public handleRate(points: IPoint[], key: string): number | undefined {
        const data = super.handleRate(points, key)
        if (data) return data
        switch (key) {
            case "rotatedHorizontalNormalByFH":
                return this.#handleRotatedHorizontalNormalByFH(points)
            default:
                return
        }
    }

    #handleRotatedHorizontalNormal(xyPoints: IPoint[]) {
        const [dync1, dync2, f1, f2] = xyPoints
        const rP1 = getRotatedPointByAngle(dync1, f1, f2)
        const rP2 = getRotatedPointByAngle(dync2, f1, f2)
        return Math.abs(rP2.x - rP1.x)
    }

    #handleRotatedHorizontalNormalByFH(xyPoints: IPoint[]) {
        const [N, ANS, _, Me, Po, Or] = xyPoints

        const rN = getRotatedPointByAngle(N, Po, Or)
        const rANS = getRotatedPointByAngle(ANS, Po, Or)
        const rMe = getRotatedPointByAngle(Me, Po, Or)

        return Math.abs(rANS.y - rN.y) / Math.abs(rMe.y - rN.y)
    }
}

export default new WylieAlgo
