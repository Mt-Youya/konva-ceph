import { Points_Names } from "@/pages/home/constants/common"
import { getPureMeasureProject } from "./utils"
import CommonAlgo from "./common"
import points from "@/constants/algosTableData/DoctorLee.json"

class DoctorLeeAlgo extends CommonAlgo {
    name = "DoctorLee"

    constructor() {
        super()
        this.algorithm = {
            // ...this.algorithm,
            ...getPureMeasureProject(points, this.algorithm),
            "N-FH&mm": ["N", ...Points_Names.FH],
            "ANS-FH&mm": ["ANS", ...Points_Names.FH],
            "A-FH&mm": ["A", ...Points_Names.FH],
            "B-N&mm": ["N", "B", ...Points_Names.FH],
            "SN-FH&deg": ["S", "N", ...Points_Names.FH],
            "A-N&mm": ["N", "A", ...Points_Names.FH],
            "B-FH&mm": ["B", ...Points_Names.FH],
            "Me-FH&mm": ["Me", ...Points_Names.FH],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            reverse: ["SN-FH&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            normal3: ["N-FH&mm", "ANS-FH&mm", "A-FH&mm", "B-FH&mm", "Me-FH&mm"],
            rotatedVerticalNormal: ["B-N&mm", "A-N&mm"],
        }
    }
}

export default new DoctorLeeAlgo
