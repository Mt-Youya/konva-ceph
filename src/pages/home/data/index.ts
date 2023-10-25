import { getOriginPointIncludeAngle } from "@/features/canvasMeasure/utils"

import type { IGpsPointItem } from "@/apis/getList"

const Names = {
    FH: ["Po", "Or"],
    HF: ["Or", "Po"],
    OP: ["U6", "L6", "U1", "L1"],
    MP: ["Go1", "Me"],
    U1Line: ["U1", "U1A"],
    L1Line: ["L1", "L1A"],
    PP: ["PNS", "ANS"],
    EP: ["Pogprime", "Prn"],
    Apo: ["Pog", "A"],
    NME: ["N", "Me"],
    NB: ["N", "B"],
    BN: ["B", "N"],
    NS: ["N", "S"],
    NA: ["N", "A"],
    AN: ["A", "N"],
    SN: ["S", "N"],
    ArGo2: ["Ar", "Go2"],
}

interface IPointObj {
    [key: string]: readonly string[]
}

export const POINTS_CONSTANTS: IPointObj = {
    "SNA&deg": [...Names.NS, ...Names.NA],
    "SNB&deg": [...Names.NS, ...Names.NB],
    "ANB&deg": [...Names.NB, ...Names.NA],
    "Ptm-A&mm": ["Ptm", "A", ...Names.FH],
    "PP-FH&deg": [...Names.PP, ...Names.FH],
    "PP-GoGn&deg": ["Go", "Gn", ...Names.PP],
    "OP-SN&deg": [...Names.OP, ...Names.SN],
    "Go-Pog&mm": ["Go", "Pog", ...Names.MP],
    "Go-Co&mm": ["Go", "Co", ...Names.ArGo2],
    "MP-SN&deg": [...Names.SN, ...Names.MP],
    "FH-MP&deg": [...Names.FH, ...Names.MP],
    "SGn-FH&deg": ["S", "Gn", ...Names.FH],
    "NBa-PtGn&deg": ["N", "Ba", "Pt", "Gn"],
    "N-ANS&mm": ["N", "ANS", ...Names.FH],
    "S-Go&mm": ["S", "Go", ...Names.FH],
    "S-Go/N-Me&rate": ["S", "Go", ...Names.NME, ...Names.FH],
    "ANS-Me/N-Me&rate": ["ANS", "Me", ...Names.NME, ...Names.FH],
    "U1-L1&deg": [...Names.U1Line, ...Names.L1Line],
    "U1-SN&deg": ["U1A", "U1", ...Names.NS],
    "U1-NA&mm": ["U1", ...Names.NA],
    "U1-NA&deg": [...Names.AN, ...Names.U1Line],
    "L1-NB&mm": ["L1", ...Names.BN],
    "L1-NB&deg": [...Names.L1Line, ...Names.NB],
    "L1-FH&deg": [...Names.L1Line, ...Names.HF],
    "U1-Apo&mm": ["U1", ...Names.Apo],
    "L1-Apo&mm": ["L1", ...Names.Apo],
    "U6-PP&mm": ["U6", ...Names.PP],
    "L1-MP&mm": ["L1", ...Names.MP],
    "U1-PP&mm": ["U1", ...Names.PP],
    "L6-MP&mm": ["L6", ...Names.MP],
    "U6-MP&mm": ["U6", ...Names.MP],
    "Ptm-U6&mm": ["Ptm", "U6", ...Names.FH],
    "UL-EP&mm": ["ULprime", ...Names.EP],
    "LL-EP&mm": ["LLprime", ...Names.EP],
    "Z-Angle&deg": ["LLprime", "Pogprime", "ULprime", ...Names.HF],
    "FH-N'Pog'&deg": ["Nprime", "Pogprime", ...Names.HF],
    "N'-Sn-Pog'&deg": ["Sn", "Nprime", "Sn", "Pogprime"],
} as const

export const shouldJudgePositions = ["U1-NA&mm", "L1-NB&mm", "U1-Apo&mm", "L1-Apo&mm", "UL-EP&mm", "LL-EP&mm", "Ptm-U6&mm"]
export const shouldJudgeAngles = ["OP-SN&deg", "PP-GoGn&deg", "PP-FH&deg"]

interface IAnyStringKey {
    [key: string]: any
}

export const anglePointMap: IAnyStringKey = {
    normal: ["SNA&deg", "SNB&deg", "MP-SN&deg", "FH-MP&deg", "SGn-FH&deg", "NBa-PtGn&deg", "U1-L1&deg", "U1-SN&deg", "L1-FH&deg", "FH-N'Pog'&deg", "N'-Sn-Pog'&deg", "U1-NA&deg", "L1-NB&deg"],
    lOrR: ["ANB&deg"],
    center: ["OP-SN&deg"],
    reverse: ["PP-GoGn&deg", "PP-FH&deg"],
    rightThan: ["Z-Angle&deg"],
}

export const distancePointMap: IAnyStringKey = {
    intersections3: ["U1-NA&mm", "L1-NB&mm", "U1-Apo&mm", "L1-Apo&mm", "UL-EP&mm", "LL-EP&mm"],
    intersections4: ["Ptm-U6&mm"],
    normal3: ["U6-PP&mm", "L1-MP&mm", "U1-PP&mm", "L6-MP&mm", "U6-MP&mm"],
    normal4: ["Ptm-A&mm", "Go-Pog&mm", "Go-Co&mm"],
    side2: ["N-ANS&mm", "S-Go&mm"],
    side1: ["N-ANS&mm", "S-Go&mm"],
}

export const ratePointMap: IAnyStringKey = {
    mmNormal: ["S-Go/N-Me&rate", "ANS-Me/N-Me&rate"],
}

export function getAllPointMethodMap(measurePoints: IPointObj) {
    const allPointMethodsMap: IAnyStringKey = {}
    for (const key in measurePoints) {
        if (key.includes("&deg")) {
            // allPointMethodsMap[key] =
            for (const angleKey in anglePointMap) {
                if (anglePointMap[angleKey].includes(key)) {
                    allPointMethodsMap[key] = angleKey
                }
            }
        } else if (key.includes("&mm")) {
            for (const distanceKey in distancePointMap) {
                if (distancePointMap[distanceKey].includes(key)) {
                    allPointMethodsMap[key] = distanceKey
                }
            }
        } else if (key.includes("&rate")) {
            for (const rateKey in ratePointMap) {
                if (ratePointMap[rateKey].includes(key)) {
                    allPointMethodsMap[key] = rateKey
                }
            }
        }
    }
    return allPointMethodsMap
}

type TMap = Map<string, IPointObj>

export function getPointMap(nameList: string[]) {
    const pointMap: TMap = new Map
    for (const key in POINTS_CONSTANTS) {
        const item = POINTS_CONSTANTS[key]
        for (const name of nameList) {
            const flag = item.includes(name)
            if (!flag) continue
            if (!pointMap.has(name)) {
                const obj = { [key]: item }
                pointMap.set(name, obj)
            } else {
                const obj = pointMap.get(name)!
                obj[key] = item
                pointMap.set(name, obj)
            }
        }
    }
    return pointMap
}

export function getPurePoints(pointList: IGpsPointItem[]) {
    const point: { [key: string]: number[] } = {}
    for (const key in pointList) {
        const { name, gps } = pointList[key]
        point[name] = gps
    }
    return point
}

export interface IMap {
    [key: keyof typeof POINTS_CONSTANTS]: number[]
}

export type TTargetMap = Map<string, IMap>

export function getRelativePointsGroup(names: string[]) {
    const AllPointNames = [...names]
    const groupMap: TTargetMap = new Map
    const pointMap = getPointMap(AllPointNames)
    for (const nameOfPoint of AllPointNames) {
        const related = pointMap.get(nameOfPoint)
        if (!related) continue
        const obj: IMap = {}
        for (const key in related) {
            obj[key] = []
            for (const ele of related[key]) {
                const idx = AllPointNames.indexOf(ele)
                if (idx === -1) continue
                obj[key].push(idx)
            }
        }
        groupMap.set(nameOfPoint, obj)
    }
    return groupMap
}

export function getOriginAngle(pointArr: IGpsPointItem[]) {
    const { Or: [Xor, Yor], Po: [Xpo, Ypo] } = getPurePoints(pointArr)
    const Por = { x: Xor, y: Yor }
    const Ppo = { x: Xpo, y: Ypo }
    return getOriginPointIncludeAngle(Por, Ppo)
}
