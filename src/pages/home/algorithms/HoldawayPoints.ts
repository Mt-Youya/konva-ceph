import { WylieAlgo } from "./WyliePoints"
import { Points_Names } from "../constants/common"

class HoldawayAlgo extends WylieAlgo {
    name = "Holdaway"

    constructor() {
        super()
        this.algorithm = {
            ...this.algorithm,
            "A-Npog&mm": ["A", "N", "Pog"],
            "FH-N'Pog'-Holdaway&deg": ["ULprime", "Pogprime", ...Points_Names.HF],
            "Prn-Sn&mm": ["Prn", "Sn", ...Points_Names.HF],
            "Ss-Ls&mm": ["Aprime", "ULprime", ...Points_Names.HF],
            "Sn-H&mm": ["Sn", "ULprime", "Pogprime"],
            "U1-Ls&mm": ["ULprime", "Pogprime", "Nprime"],
            "H-N'Pm'&deg": ["Pogprime", "ULprime", "Pogprime", "Nprime"],
            "Si-H&mm": ["Si", "ULprime", "Pogprime"],
            "Li-H&mm": ["Li", "Pogprime", "ULprime"],
            "Pm-Pm'&mm": ["Pog", "Pogprime"],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "FH-NPo&deg", "MP-NPog&deg", "FH-N'Pog'-Holdaway&deg"],
            reverse: [...this.angleAlgo.reverse, "H-N'Pm'&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            distanceLeftSideMinus: [...this.distanceAlgo.distanceLeftSideMinus, "Sn-H&mm", "Si-H&mm", "Li-H&mm"],
            normal2: [...this.distanceAlgo.normal2, "Pm-Pm'&mm"],
            normal3: [...this.distanceAlgo.normal3, "U1-Ls&mm", "A-Npog&mm"],
            rotatedVerticalNormal: [...this.distanceAlgo.rotatedVerticalNormal, "Prn-Sn&mm", "Ss-Ls&mm"],
        }
    }
}

export default new HoldawayAlgo
