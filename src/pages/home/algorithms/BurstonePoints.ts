import { McNamaraAlgo } from "./McNamaraPoints"
import {
    getOriginPointIncludeAngle,
    getRotatedPoint,
    getRotatedPointByAngle,
    getRotatedPointByPoint,
    measureAngle, point2PointDistance,
} from "@/features"
import { Points_Names } from "@/pages/home/constants/common"

import type { IPoint } from "@/types"

export class BurstoneAlgo extends McNamaraAlgo {
    name = "Burstone"
    distanceRate = ["Sn-Stms/Stmi-Me'&rate", "Sn-Gn'/C-Gn'&rate", "G-Sn/Sn-Me'&rate"]

    constructor() {
        super()
        this.algorithm = {
            ...this.algorithm,
            "G-Sn-Pg'&deg": ["G", "Sn", "Sn", "Pogprime", ...Points_Names.FH],
            "G-Sn&mm": ["G", "Sn", "S", "N"],
            "G-Pg'&mm": ["G", "Pogprime", "S", "N"],
            "Sn-Gn'-C&deg": ["Meprime", "C", "Pogprime", "Sn"],
            "G-Sn/Sn-Me'&rate": ["G", "Sn", "Sn", "Meprime", "S", "N", ...Points_Names.FH],
            "Sn-Gn'/C-Gn'&rate": ["Me", "C", "Pogprime", "Sn", ...Points_Names.FH],
            "Cm-Sn-Ls&deg": ["Sn", "Cm", "Sn", "ULprime"],
            "Ls-SnPg'&mm": ["ULprime", "Sn", "Pogprime"],
            "Li-SnPg'&mm": ["LLprime", "Sn", "Pogprime"],
            "Si-LiPg'&mm": ["Si", "LLprime", "Pogprime"],
            "Sn-Stms/Stmi-Me'&rate": ["Sn", "Stms", "Stmi", "Meprime"],
            "Stms-Stmi&mm": ["Stms", "Stmi"],
            "Stms-U1&mm": ["Stms", "U1"],
        }

        this.angleAlgo = {
            ...this.angleAlgo,
            angleNormal: [...this.angleAlgo.angleNormal, "MP-NPog&deg", "Sn-Gn'-C&deg", "Cm-Sn-Ls&deg"],
            reverse: [...this.angleAlgo.reverse, "H-N'Pm'&deg"],
            rightSidePoint2Point: ["G-Sn-Pg'&deg"],
        }

        this.distanceAlgo = {
            ...this.distanceAlgo,
            distanceLeftSideMinus: [...this.distanceAlgo.distanceLeftSideMinus, "Sn-H&mm", "Si-H&mm", "Li-H&mm"],
            normal2: [...this.distanceAlgo.normal2, "Pm-Pm'&mm", "Stms-Stmi&mm", "Stms-U1&mm"],
            normal3: [...this.distanceAlgo.normal3, "UL-SnPog'&mm", "LL-SnPog'&mm", "Ls-SnPg'&mm", "Li-SnPg'&mm", "Si-LiPg'&mm"],
            hpNormal3VerticalLeftMinus: ["G-Sn&mm", "G-Pg'&mm"],
        }

        this.rateAlgo = {
            ...this.rateAlgo,
            rateNormal: ["Sn-Stms/Stmi-Me'&rate"],
            baseNormalVertical: [...this.rateAlgo.baseNormalVertical, "G-Sn/Sn-Me'&rate"],
            hpVertical: ["Sn-Gn'/C-Gn'&rate"],
        }
    }

    handleAngle(points: IPoint[], key: string): number | undefined {
        const data = super.handleAngle(points, key)
        if (data) return data
        switch (key) {
            case "rightSidePoint2Point":
                return this.#handleRightSidePoint2Point(points)
        }
    }

    handleDistance(points: IPoint[], key: string): any {
        const data = super.handleDistance(points, key)
        if (data) return data

        switch (key) {
            case "hpNormal3VerticalLeftMinus":
                return this.#handleRateNormal3VerticalLeftMinusByHp(points)
            case "Wits":
                return this.#handleWits(points)
            default:
                return
        }
    }

    public handleRate(points: IPoint[], key: string): number | undefined {
        const data = super.handleRate(points, key)
        if (data) return data

        switch (key) {
            case "hpVertical":
                return this.#handleRateVerticalByHp(points)
            case "rateNormal":
                return this.#handleRateNormal(points)
            default:
                return
        }
    }

    #handleWits(xyPoints: IPoint[]) {
        const [A, B, U6, L6, U1, L1] = xyPoints

        const c1 = { x: (U6.x + L6.x) / 2, y: (U6.y + L6.y) / 2 }
        const c2 = { x: (U1.x + L1.x) / 2, y: (U1.y + L1.y) / 2 }
        const rA = getRotatedPointByAngle(A, c1, c2)
        const rB = getRotatedPointByAngle(B, c1, c2)

        return rB.x - rA.x
    }

    #handleRightSidePoint2Point(xyPoints: IPoint[]) {
        const [G, Sn, _, Pogprime, Po, Or] = xyPoints
        const rG = getRotatedPointByAngle(G, Po, Or)
        const rSn = getRotatedPointByAngle(Sn, Po, Or)
        const angle = measureAngle(Sn, Pogprime, G, Sn)
        return rSn.x - rG.x > 0 ? -angle : angle
    }

    #handleRateVerticalByHp(xyPoints: IPoint[]) {
        const [Pa, Pb, Pc, Pd, S, N] = xyPoints
        const rS = getRotatedPointByPoint(S, N)
        const includeAngle = getOriginPointIncludeAngle(rS, N)

        const rPa = getRotatedPoint(Pa.x, Pa.y, includeAngle)
        const rPb = getRotatedPoint(Pb.x, Pb.y, includeAngle)
        const rPc = getRotatedPoint(Pc.x, Pc.y, includeAngle)
        const rPd = getRotatedPoint(Pd.x, Pd.y, includeAngle)

        return Math.abs(rPb.y - rPa.y) / Math.abs(rPd.y - rPc.y)
    }

    #handleRateNormal3VerticalLeftMinusByHp(xyPoints: IPoint[]) {
        const [Pa, Pb, S, N] = xyPoints
        const rS = getRotatedPointByPoint(S, N)
        const includeAngle = getOriginPointIncludeAngle(rS, N)

        const rPa = getRotatedPoint(Pa.x, Pa.y, includeAngle)
        const rPb = getRotatedPoint(Pb.x, Pb.y, includeAngle)

        return Math.abs(rPb.x - rPa.x)
    }

    #handleRateNormal(xyPoints: IPoint[]) {
        const [p1, p2, p3, p4] = xyPoints
        const numerator = point2PointDistance(p1, p2)
        const denominator = point2PointDistance(p3, p4)
        return numerator * 100 / denominator
    }
}

export default new BurstoneAlgo
