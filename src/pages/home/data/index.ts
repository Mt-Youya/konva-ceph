import { POINTS_CONSTANTS } from "../constants/common"
import CommonAlgo from "../algorithms/common"

import type { IPointObj } from "../constants/common"
import type { IGpsPointItem } from "@/apis/getList"

export function getAllPointMethodMap(measurePoints: IPointObj, instance: InstanceType<typeof CommonAlgo>) {
    const allPointMethodsMap: { [key: string]: string } = {}

    const { angleAlgo, distanceAlgo, rateAlgo } = instance

    for (const key in measurePoints) {
        if (key.includes("&deg")) {
            for (const angleKey in angleAlgo) {
                if (angleAlgo[angleKey].includes(key)) {
                    allPointMethodsMap[key] = angleKey
                }
            }
        } else if (key.includes("&mm")) {
            for (const distanceKey in distanceAlgo) {
                if (distanceAlgo[distanceKey].includes(key)) {
                    allPointMethodsMap[key] = distanceKey
                }
            }
        } else if (key.includes("&rate")) {
            for (const rateKey in rateAlgo) {
                if (rateAlgo[rateKey].includes(key)) {
                    allPointMethodsMap[key] = rateKey
                }
            }
        }
    }
    return allPointMethodsMap
}

type TMap = Map<string, IPointObj>

export function getPointMap(nameList: string[], constants: IPointObj = POINTS_CONSTANTS) {
    const pointMap: TMap = new Map
    for (const key in constants) {
        const item = constants[key]
        for (const name of nameList) {
            const flag = item.includes(name)
            if (!flag) continue
            if (!pointMap.has(name)) {
                pointMap.set(name, { [key]: item })
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

export function getRelativePointsGroup(names: string[], constants: IPointObj = POINTS_CONSTANTS) {
    const AllPointNames = [...names]
    const groupMap: TTargetMap = new Map
    const pointMap = getPointMap(AllPointNames, constants)
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

export function getProjectIdxList(pointList: IGpsPointItem[], pointsConstants: any) {
    const idxsGroup = new Map
    for (const pointsconstantsKey in pointsConstants) {
        const item = pointsConstants[pointsconstantsKey]
        const idxsList = []
        for (let i = 0; i < pointList.length; i++) {
            const point = pointList[i].name
            if (item.includes(point)) {
                idxsList.push(i)
            }
        }
        idxsGroup.set(pointsconstantsKey, idxsList)
    }
    return idxsGroup
}