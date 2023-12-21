import { getPureMeasureProject } from "./utils"
import points from "@/constants/algosTableData/Ricketts.json"
import CommonAlgo from "./common"

class RickettsAlgo extends CommonAlgo {
    name = "Ricketts"

    constructor() {
        super()
        this.algorithm = {
            // ...this.algorithm,
            ...getPureMeasureProject(points, this.algorithm),
            "FH-NPo&deg": ["Or", "Po", "N", "Pog"],
            "MP-NPog&deg": ["Me", "Go1", "Pog", "N"],
            "A-NPog&mm": ["A", "N", "Pog"],
            "L1-APog&mm":["L1","A","Pog"],
            "L1-APog&deg": ["L1A", "L1", "Pog", "A"],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "FH-NPo&deg", "MP-NPog&deg", "L1-APog&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            normal3: [...this.distanceAlgo.normal3, "L1-APog&mm","A-NPog&mm"],
        }
    }
}

export default new RickettsAlgo
