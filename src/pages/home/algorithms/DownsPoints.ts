import { PerkingUniversityAlgo } from "./PerkingUniversityPoints"
import { Points_Names } from "../constants/common"
import { measureAngle } from "@/features"

import type { IPoint } from "@/types"

class DownsAlgo extends PerkingUniversityAlgo {
    name = "Downs"

    constructor() {
        super()
        this.algorithm = {
            ...this.algorithm,
            "AB-NPo&deg": [...Points_Names.BA, ...Points_Names.PoN],
            "OP-FH&deg": [...Points_Names.OP, ...Points_Names.FH],
            "L1-OP&deg": [...Points_Names.L1Line, ...Points_Names.OP],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleLeftSideMinus: [...this.angleAlgo.angleLeftSideMinus, "AB-NPo&deg"],
            normalCenter: ["L1-OP&deg"],
            opAngle: ["OP-FH&deg"],
        }
    }

    handleAngle(points: IPoint[], key: string) {
        const data = super.handleAngle(points, key)
        if (data) return data
        switch (key) {
            case "normalCenter":
                return this.#handleNormalCenter(points)
            default:
                return
        }
    }

    #handleNormalCenter(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4, p5, p6] = xyPoints
        const c1 = { x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 }
        const c2 = { x: (p5.x + p6.x) / 2, y: (p5.y + p6.y) / 2 }
        return measureAngle(c1, c2, p1, p2)
    }
}

export default new DownsAlgo
