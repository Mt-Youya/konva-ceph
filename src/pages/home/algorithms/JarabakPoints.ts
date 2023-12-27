import { BurstoneAlgo } from "./BurstonePoints"
import { measureAngle } from "@/features"
import { getPureMeasureProject } from "./utils"
import points from "@/constants/algosTableData/Jarabak.json"

import type { IPoint } from "@/types"

class JarabakAlgo extends BurstoneAlgo {
    name = "Jarabak"
    distanceRate = ["S-Ar/Ar-Go'&rate", "S-N/Go'-Me&rate", "S-Go'/N-Me&rate"]

    constructor() {
        super()
        this.algorithm = {
            // ...this.algorithm,
            ...getPureMeasureProject(points, this.algorithm),
            "N-S-Ar&deg": ["S", "N", "S", "Ar"],
            "S-Ar-Go'&deg": ["Ar", "S", "Ar", "Go2"],
            "Ar-Go'-Me&deg": ["Go2", "Ar", "Go1", "Me"],
            "Ar-Go'-N&deg": ["Go2", "Ar", "Go", "N"],
            "N-Go'-Me&deg": ["Go", "N", "Go1", "Me"],
            "S-Ar-Go&deg": ["N", "S", "Ar", "Go2", "Go1", "Me"],
            "Ar-S&mm": ["Ar", "S"],
            "Ar-Go'&mm": ["Ar", "Go2"],
            "Go'-Me&mm": ["Go1", "Me"],
            "N-Me&mm": ["N", "Me"],
            "S-Go'&mm": ["S", "Go"],
            "S-Ar/Ar-Go'&rate": ["S", "Ar", "Ar", "Go2"],
            "S-N/Go'-Me&rate": ["S", "N", "Go1", "Me"],
            "S-Go'/N-Me&rate": ["S", "Go", "N", "Me"],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "N-S-Ar&deg", "S-Ar-Go'&deg", "Ar-Go'-Me&deg", "Ar-Go'-N&deg", "N-Go'-Me&deg"],
            ringSummation: ["S-Ar-Go&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            normal2: [...this.distanceAlgo.normal2, "Ar-S&mm", "Ar-Go'&mm", "Go'-Me&mm", "N-Me&mm", "S-Go'&mm"],
        }

        this.rateAlgo = {
            ...this.rateAlgo,
            rateNormal: ["S-Ar/Ar-Go'&rate", "S-N/Go'-Me&rate", "S-Go'/N-Me&rate"],
        }
    }

    handleAngle(points: IPoint[], key: string) {
        const data = super.handleAngle(points, key)
        if (data) return data
        switch (key) {
            case "ringSummation":
                return this.#handleRateRingSummation(points)
            default:
                return
        }
    }

    #handleRateRingSummation(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4, p5, p6] = xyPoints

        const angle1 = measureAngle(p5, p6, p4, p3)
        const angle2 = measureAngle(p3, p4, p3, p2)
        const angle3 = measureAngle(p2, p3, p2, p1)

        return angle1 + angle2 + angle3
    }
}

export default new JarabakAlgo
