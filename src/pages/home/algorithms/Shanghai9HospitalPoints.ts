import { WylieAlgo } from "./WyliePoints"
import { Points_Names } from "../constants/common"
import { getRotatedPointByAngle, point2LineIntersection } from "@/features"
import { getPureMeasureProject } from "./utils"
import points from "@/constants/algosTableData/Shanghai9hospital.json"

import type { IPoint } from "@/types"

class Shanghai9HospitalAlgo extends WylieAlgo {
    name = "Shanghai9Hospital"
    distanceRate = ["S-Go/N-Me&rate", "SN/GoMe&rate", "ANS-Me/N-Me&rate", "ALFH/PLFH&rate"]

    constructor() {
        super()
        this.algorithm = {
            // ...this.algorithm,
            ...getPureMeasureProject(points, this.algorithm),
            "FH-NA&deg": ["N", "A", ...Points_Names.HF],
            "Co-Go&mm": ["Co", "Go"],
            "S-Co&mm": ["S", "Co", ...Points_Names.FH],
            "Ar-Go-Me&deg": ["Ar", "Go", "Go", "Me"],
            "S-N&mm": ["S", "N"],
            // "ALFH/PLFH&rate": ["Aprime", "Bprime", "Jprime", "Ptmprime"],
            "SN/GoMe&rate": ["S", "N", "Go", "Me"],
            "SN/GoMe&mm": ["Go", "Me", "S", "N"],
            "Overjet&mm": Points_Names.OP,
            "Overbite&mm": Points_Names.OP,
            "ULL&mm": ["Sn", "Stms", "Pogprime"],
            "N'-Sn&mm": ["Nprime", "Sn", ...Points_Names.FH],
            "N'-Pog'&mm": ["Nprime", "Pogprime", ...Points_Names.FH],
            "FH-NPo&deg": [...Points_Names.HF, "N", "Pog"],
            "NA-APo&deg": ["A", "N", "Pog", "A"],
            "FH-MP&deg": [...Points_Names.FH, "Go", "Me"],
            "Po-NB&mm": ["Pog", "N", "B"],
            "Wits&mm": ["A", "B", ...Points_Names.OP],
            "L1-MP&deg": ["Go1", "Me", ...Points_Names.FH],
            "OP-FH&deg": [...Points_Names.OP, ...Points_Names.FH],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "Ar-Go-Me&deg", "FH-NA&deg", "FH-NPo&deg", "NA-APo&deg", "FH-MP&deg", "L1-MP&deg"],
            opAngle: ["OP-FH&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            normal2: [...this.distanceAlgo.normal2, "Ar-S&mm", "Ar-Go'&mm", "Go'-Me&mm", "N-Me&mm", "S-Go'&mm", "S-N&mm", "Co-Go&mm"],
            normal3: [...this.distanceAlgo.normal3, "Po-NB&mm"],
            rotatedHorizontalNormal: [...this.distanceAlgo.rotatedHorizontalNormal, "SN/GoMe&mm", "S-Co&mm"],
            rotatedVerticalLeftMinus: [...this.distanceAlgo.rotatedVerticalLeftMinus, "N'-Pog'&mm", "N'-Sn&mm"],
            Overjet: ["Overjet&mm"],
            Overbite: ["Overbite&mm"],
            ULL: ["ULL&mm"],
            Wits: ["Wits&mm"],
        }

        this.rateAlgo = {
            ...this.rateAlgo,
            rateNormal: [...this.rateAlgo.rateNormal, "S-Go/N-Me&rate", "SN/GoMe&rate"],
        }
    }

    public handleDistance(points: IPoint[], key: string) {
        const data = super.handleDistance(points, key)
        if (data) return data
        switch (key) {
            case "Overjet":
                return this.#handleOverjet(points)
            case "Overbite":
                return this.#handleOverbite(points)
            case "ULL":
                return this.#handleULL(points)
            default:
                return
        }
    }

    #handleOver(xyPoints: IPoint[]) {
        const [U6, L6, U1, L1] = xyPoints

        const c1 = { x: (U6.x + L6.x) / 2, y: (U6.y + L6.y) / 2 }
        const c2 = { x: (U1.x + L1.x) / 2, y: (U1.y + L1.y) / 2 }

        const rU1 = getRotatedPointByAngle(U1, c1, c2)
        const rL1 = getRotatedPointByAngle(L1, c1, c2)

        // console.log("rU1:", rU1, "rL1:", rL1)
        // console.log("c1:", c1, "c2:", c2)
        return { rU1, rL1 }
    }

    #handleOverjet(xyPoints: IPoint[]) {
        const { rU1, rL1 } = this.#handleOver(xyPoints)
        return rU1.x - rL1.x
    }

    #handleOverbite(xyPoints: IPoint[]) {
        const { rU1, rL1 } = this.#handleOver(xyPoints)
        return rU1.y - rL1.y
    }

    #handleULL(xyPoints: IPoint[]) {
        const [Sn, Stms, Pogprime] = xyPoints
        const Pi = point2LineIntersection(Stms, Sn, Pogprime)
        return Math.sqrt((Pi.x - Sn.x) ** 2 + (Pi.y - Sn.y) ** 2)
    }
}

export default new Shanghai9HospitalAlgo
