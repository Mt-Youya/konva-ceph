import { McNamaraAlgo } from "./McNamaraPoints"
import { Points_Names } from "../constants/common"
import { getPureMeasureProject } from "./utils"
import points from "@/constants/algosTableData/Steiner.json"

class SteinerAlgo extends McNamaraAlgo {
    name = "Steiner"

    constructor() {
        super()
        this.algorithm = {
            // ...this.algorithm,
            ...getPureMeasureProject(points, this.algorithm),
            "SND&deg": [...Points_Names.NS, ...Points_Names.ND],
            "GoGn-SN&deg": ["Go", "Gn", ...Points_Names.SN],
            "SE&mm": ["Pcd", "S", ...Points_Names.NS],
            "SL&mm": ["S", "Pog", ...Points_Names.NS],
            "Po-NB&mm": ["Pog", "N", "B"],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "SND&deg", "GoGn-SN&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            rotatedVerticalNormal: [...this.distanceAlgo.rotatedVerticalNormal, "SE&mm", "SL&mm"],
            normal3: [...this.distanceAlgo.normal3, "Po-NB&mm"],
        }
    }
}

export default new SteinerAlgo
