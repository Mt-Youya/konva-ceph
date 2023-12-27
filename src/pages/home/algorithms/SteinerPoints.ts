import { McNamaraAlgo } from "./McNamaraPoints"
import { Points_Names } from "../constants/common"
import { getPureMeasureProject } from "./utils"
import { getRotatedPointByAngle } from "@/features"
import points from "@/constants/algosTableData/Steiner.json"

import type { IPoint } from "@/types"

class SteinerAlgo extends McNamaraAlgo {
    name = "Steiner"

    constructor() {
        super()
        this.algorithm = {
            // ...this.algorithm,
            ...getPureMeasureProject(points, this.algorithm),
            "SND&deg": [...Points_Names.NS, ...Points_Names.ND],
            "GoGn-SN&deg": ["Go", "Gn", ...Points_Names.SN],
            "SE&mm": ["Pcd", "S", ...Points_Names.SN],
            "SL&mm": ["S", "Pog", ...Points_Names.SN],
            "Po-NB&mm": ["Pog", "N", "B"],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "SND&deg", "GoGn-SN&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            handleRotatedHorizontalNormal: ["SE&mm", "SL&mm"],
            normal3: [...this.distanceAlgo.normal3, "Po-NB&mm"],
        }
    }

    handleDistance(points: IPoint[], key: string) {
        const data = super.handleDistance(points, key)
        if (data) return data

        switch (key) {
            case "handleRotatedHorizontalNormal":
                return this.#handleRotatedHorizontalIntersection(points)
            default:
                return
        }
    }

    #handleRotatedHorizontalIntersection(xyPoints: IPoint[]) {
        const [dync1, dync2, S, N] = xyPoints
        const rP1 = getRotatedPointByAngle(dync1, S, N)
        const rP2 = getRotatedPointByAngle(dync2, S, N)
        return Math.abs(rP2.x - rP1.x)
    }

}

export default new SteinerAlgo
