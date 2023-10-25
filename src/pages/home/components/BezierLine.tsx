import { Fragment, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Circle, Group, Line, Text } from "react-konva"
import { Html } from "react-konva-utils"
import { Dropdown } from "antd"
import { DownOutlined } from "@ant-design/icons"
import {
    getIntersection2VectorPosition,
    getLine2LineIntersection,
    getPoint2VectorPosition,
    measureAngle,
    point2LineDistance,
    point2LineIntersection,
    point2PointDistance,
    parallelSymbol,
    pointInVectorSymbol,
} from "@/features/canvasMeasure"
import { changePointList } from "@/stores/home/useDataPoints"
import { setTableData } from "@/stores/home/getTableData"
import { getPurePoints, getRelativePointsGroup, shouldJudgeAngles, shouldJudgePositions } from "@/pages/home/data"
import styled from "styled-components"
import Konva from "konva"

import type { KonvaEventObject } from "konva/lib/Node"
import type { IPointItem } from "@/stores/home/useDataPoints"
import type { IMap, TTargetMap } from "@/pages/home/data"
import type { RootState } from "@/stores"
import type { ITableData } from "@/apis/getList"

const AntdDrop = styled(Dropdown)`
    background-color: #414141;
    color: #fff;
    border-radius: 2px;
    padding: 6px;
`

const items = [
    { key: 5, label: "5mm" },
    { key: 10, label: "10mm" },
    { key: 15, label: "15mm" },
    { key: 20, label: "20mm" },
]

const BezierLine = () => {
    const { named, outline, major } = useSelector((state: RootState) => state.showPoint)
    const { pointList, lineList } = useSelector((state: RootState) => state.dataPoint)
    const { tableData, rulerScaling } = useSelector((state: RootState) => state.tableData)

    const [menuLabel, setMenuLabel] = useState(items[1].label)
    const [targetPointsGroup, setTargetPointsGroup] = useState<TTargetMap>(new Map)
    const [linePos, setLinePos] = useState({ p1: 33, p2: 36, p3: 34, p4: 1 })
    const [rulerPoint, setRulerPoint] = useState<IMap>()

    const [intersection, setIntersection] = useState({ x: 0, y: 0 })
    const [intersectionKey, setIntersectionKey] = useState("")

    const pointListRef = useRef<Konva.Group | null>(null)
    const dispatch = useDispatch()

    // const pointsMethods = getAllPointMethodMap(POINTS_CONSTANTS)

    function onDragMove(e: KonvaEventObject<MouseEvent>, index: number) {
        const newPoints = [...pointList]
        newPoints[index] = { name: newPoints[index].name, gps: [e.target.attrs.x, e.target.attrs.y] }
        dispatch(changePointList(newPoints))
    }

    function onDrop(name: string) {
        const target = targetPointsGroup.get(name)!
        const calcValue = getCalculateValue(target)
        const list = computedTableData(calcValue)
        dispatch(setTableData(list))
    }

    interface IMeasureData extends Omit<ITableData, "measure_value"> {
        measure_value: number | string;
    }

    function computedTableData(calcValue: ReturnType<typeof getCalculateValue>) {
        const data = tableData.length !== 0 ? tableData : JSON.parse(sessionStorage.getItem("tempTableData")!)
        const list = JSON.parse(JSON.stringify(data)) as IMeasureData[]
        for (const key in calcValue) {
            for (const item of list) {
                if (key === item.name) {
                    item.measure_value = calcValue[key]
                }
            }
        }
        return list
    }

    function gps2IPoint(list: IPointItem[]) {
        return list.map(({ gps: [x, y] }) => ({ x, y }))
    }

    type TGroupsType = ReturnType<typeof targetPointsGroup.get>

    function getCalculateValue(groups: TGroupsType) {
        const calculatedValue: { [p: string]: number | string } = {}
        for (const key in groups) {
            const idxs = groups[key]
            const pointArr = []
            for (const idx of idxs) {
                pointArr.push(pointList[idx])
            }
            const xyPoints = gps2IPoint(pointArr)

            if (key.includes("&mm")) {
                const distance = handleDistance(xyPoints, pointArr.length, key)
                calculatedValue[key] = Math.round((distance * rulerScaling) * 100) / 100
            } else if (key.includes("&deg")) {
                const angle = handleAngle(xyPoints, key)!
                calculatedValue[key] = !!angle ? (Math.round(angle * 100) / 100).toFixed(2) : angle
            } else if (key.includes("&rate")) {
                const rate = handleRate(xyPoints)
                if (rate) {
                    calculatedValue[key] = (Math.round(rate * 100) / 100).toFixed(2)
                }
            }
        }
        return calculatedValue
    }

    type TReturnGps2Point = ReturnType<typeof gps2IPoint>

    function handleDistance(xyPoints: TReturnGps2Point, pointsLen: number, key: string) {
        const [f1, f2] = xyPoints.splice(pointsLen - 2, pointsLen - 1)
        let distance
        if (xyPoints.length === 2) {
            const [dync1, dync2] = xyPoints
            if (key === "S-Go&mm" || key === "N-ANS&mm") {
                const d1 = point2LineDistance(dync1, f1, f2)
                const d2 = point2LineDistance(dync2, f1, f2)

                const pos1 = getPoint2VectorPosition(dync1, f1, f2)
                const pos2 = getPoint2VectorPosition(dync2, f1, f2)

                if (pos1 === pos2) {
                    return Math.abs(d1 - d2)
                }
                return d1 + d2
            }
            const foot1 = point2LineIntersection(dync1, f1, f2)
            const foot2 = point2LineIntersection(dync2, f1, f2)
            distance = point2PointDistance(foot1, foot2)
            if (shouldJudgePositions.includes(key)) {
                const position = getPoint2VectorPosition(dync2, dync1, foot1)
                if (position === pointInVectorSymbol) {
                    return 0
                } else if (position === "left") {
                    return -distance
                }
            }
        } else {
            const dync1 = xyPoints[0]
            if (f1.y < f2.y) distance = point2LineDistance(dync1, f1, f2)
            else distance = point2LineDistance(dync1, f2, f1)

            if (shouldJudgePositions.includes(key)) {
                const position = getPoint2VectorPosition(dync1, f1, f2)
                if (position === pointInVectorSymbol) {
                    return 0
                } else if (position === "left") {
                    return -distance
                }
            }
        }
        return distance
    }

    function handleAngle(xyPoints: TReturnGps2Point, key: string) {
        let angle
        if (xyPoints.length === 6) {
            const [p1, p2, p3, p4, p5, p6] = xyPoints
            const c1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
            const c2 = { x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 }
            angle = measureAngle(c1, c2, p5, p6)
            if (shouldJudgeAngles.includes(key)) {
                try {
                    const Pi = getLine2LineIntersection(c1, c2, p5, p6)!
                    const Pa = getIntersection2VectorPosition(Pi, c1, c2)
                    const Pb = getIntersection2VectorPosition(Pi, p5, p6)
                    if (key === intersectionKey) {
                        intersection && setIntersection({
                            x: Pi.x,
                            y: Pi.y,
                        })
                    }
                    return angle * judgeMinusAngle(Pa, Pb)
                } catch (err) {
                    console.error(err)
                    return ""
                }
            }
        } else if (xyPoints.length === 5) {
            const [p1, p2, p3, p4, p5] = xyPoints
            if (key === "Z-Angle&deg") {
                const Pa = point2LineIntersection(p1, p4, p5)
                const Pb = point2LineIntersection(p3, p4, p5)
                angle = Pa.x > Pb.x ? measureAngle(p1, p2, p4, p5) : measureAngle(p3, p2, p4, p5)
            }
            return angle
        } else {
            const [p1, p2, p3, p4] = xyPoints
            angle = measureAngle(p1, p2, p3, p4)
            if (angle === 0) return 0
            if (key === "ANB&deg") {
                const P = xyPoints.at(-1)!
                const position = getPoint2VectorPosition(P, p2, p1)
                if (position === "left") return -angle
            }
            if (shouldJudgeAngles.includes(key)) {
                try {
                    const Pi = getLine2LineIntersection(p1, p2, p3, p4)!
                    const Pa = getIntersection2VectorPosition(Pi, p1, p2)
                    const Pb = getIntersection2VectorPosition(Pi, p3, p4)

                    if (key === intersectionKey) {
                        intersection && setIntersection({
                            x: Pi.x,
                            y: Pi.y,
                        })
                    }
                    return angle * judgeMinusAngle(Pa, Pb)
                } catch (err) {
                    console.error(err)
                    return ""
                }
            }
        }
        return angle
    }

    type TReturnI2VPos = ReturnType<typeof getIntersection2VectorPosition>

    function judgeMinusAngle(Pa: TReturnI2VPos, Pb: TReturnI2VPos) {
        if (Pa === "front" && Pb !== "back") {
            return -1
        }
        if (Pa === parallelSymbol && Pb === "front") {
            return -1
        }
        return 1
    }

    function handleRate(xyPoints: TReturnGps2Point) {
        let rate
        const [dync1, dync2, dync3, dync4, f1, f2] = xyPoints
        if (xyPoints.length === 6) {
            const d1 = point2LineDistance(dync1, f1, f2)
            const d2 = point2LineDistance(dync2, f1, f2)
            const d3 = point2LineDistance(dync3, f1, f2)
            const d4 = point2LineDistance(dync4, f1, f2)
            const pos1 = getPoint2VectorPosition(dync1, f1, f2)
            const pos2 = getPoint2VectorPosition(dync2, f1, f2)
            const pos3 = getPoint2VectorPosition(dync3, f1, f2)
            const pos4 = getPoint2VectorPosition(dync4, f1, f2)

            const numerator = pos1 === pos2 ? Math.abs(d1 - d2) : d1 + d2
            const denominator = pos3 === pos4 ? Math.abs(d3 - d4) : d3 + d4
            rate = (100 * numerator) / denominator
        }
        return rate
    }

    function onMenuClick({ key }: any) {
        const filteredLabel = items.filter(item => item.key === +key)[0]?.label
        setMenuLabel(filteredLabel)

        // const standardRuler = items[1].key
        // switch (key) {
        //     case  items[0].key:
        //         return dispatch(setRulerScaling())
        //     case  items[1].key:
        //         return dispatch(setRulerScaling(standardRuler))
        //     case  items[2].key:
        //         return dispatch(setRulerScaling(standardRuler * 1.5))
        //     case  items[3].key:
        //         return dispatch(setRulerScaling(standardRuler * 2))
        // }
    }

    function getAllPointInfoFn() {
        const points = pointList.map(item => ({
            name: item.name,
            coordinate: item.gps.join(","),
        }))
        console.table(points)
    }

    function nList([x, y]: [number, number]) {
        return { x, y }
    }

    function setShowLinePosFn(p1: number, p2: number, p3: number, p4: number, keyIdx: number) {
        setLinePos({ p1, p2, p3, p4 })

        const pos1 = nList(pointList[p1].gps)
        const pos2 = nList(pointList[p2].gps)
        const pos3 = nList(pointList[p3].gps)
        const pos4 = nList(pointList[p4].gps)

        const Pi = getLine2LineIntersection(pos1, pos2, pos3, pos4)!

        setIntersection({ x: Pi.x, y: Pi.y })
        setIntersectionKeyFn(keyIdx)
    }

    function setIntersectionKeyFn(idx: number) {
        const measureList = JSON.parse(sessionStorage.getItem("tableData")!) as ITableData[]
        const key = measureList[idx].name
        setIntersectionKey(key)
    }

    function setPointFn(name: string, x: number, y: number) {
        const idx = pointList.findIndex(item => item.name === name)
        const copyPointList = JSON.parse(JSON.stringify(pointList))
        copyPointList[idx].gps.splice(0, 2, x, y)
        dispatch(changePointList(copyPointList))
        onDrop(copyPointList[idx].name)
    }

    useEffect(() => {
        return () => {
            // @ts-ignore
            delete window.__ceph_getAllPoint
            // @ts-ignore
            delete window.__ceph_setLinePosFn
            // @ts-ignore
            delete window.__ceph_setIntersectionNull
            // @ts-ignore
            delete window.__ceph_setPoint
        }
    }, [])

    useEffect(() => {
        if (pointList?.length > 0) {
            const targetGroup = pointList.map(({ name }) => name)
            const targetPoints = getRelativePointsGroup(targetGroup)
            setTargetPointsGroup(targetPoints)
            const RPoints = getPurePoints(pointList)
            // const ruler = gps2IPoint(RPoints)
            setRulerPoint(RPoints)

            // @ts-ignore
            window.__ceph_getAllPoint = getAllPointInfoFn
            // @ts-ignore
            window.__ceph_setLinePosFn = setShowLinePosFn
            // @ts-ignore
            window.__ceph_setIntersectionNull = () => setIntersection(null)
            // @ts-ignore
            window.__ceph_setPoint = setPointFn
        }
    }, [pointList])

    useEffect(() => {
        if (tableData?.length !== 0) {
            sessionStorage.setItem("tempTableData", JSON.stringify(tableData))
        }
    }, [tableData])

    const scale = pointListRef.current?.getStage()?.scaleX() ?? 1

    const htmlStyle = {
        left: rulerPoint?.ruler1[0]! * scale + 40 + "px",
        top: Math.ceil((rulerPoint?.ruler1[1]! * scale + rulerPoint?.ruler2[1]! * scale) / 2) - 10 + "px",
        borderColor: "#32393F",
        textWrap: "nowrap",
    }

    return (
        <Group>
            {lineList.map((item, index) => (
                <Fragment key={"line_" + index}>
                    {outline && <Line points={item} stroke="#00b6ff" strokeWidth={2} tension={.5} bezier={true} />}
                </Fragment>
            ))}

            {!!intersection.x && !!intersection.y && !!pointList.length && (
                <>
                    <Line
                        points={[...pointList[linePos.p1].gps, ...pointList[linePos.p2].gps]}
                        stroke="rgb(100,0,255)" strokeWidth={2}
                    />
                    <Line points={[...pointList[linePos.p3].gps, ...pointList[linePos.p4].gps]}
                          stroke="rgb(220,120,0)" strokeWidth={2}
                    />

                    <Line
                        points={[intersection.x - 20, intersection.y, intersection.x + 20, intersection.y]}
                        stroke="rgb(0,182,255)" strokeWidth={2}
                    />
                    <Line
                        points={[intersection.x, intersection.y - 20, intersection.x, intersection.y + 20]}
                        stroke="rgb(0,182,255)" strokeWidth={2}
                    />
                </>
            )}
            <Group ref={pointListRef}>
                {pointList?.map(({ name, gps: [x, y] }, index) => {
                    return (
                        <Fragment key={"point_" + index}>
                            {major && (
                                <Circle
                                    name={name}
                                    x={x} y={y} fill="#fff" radius={4} draggable
                                    onDragEnd={() => onDrop(name)}
                                    onDragMove={e => onDragMove(e, index)}
                                    onMouseEnter={e => e.target.getStage()!.container().style.cursor = "pointer"}
                                    onMouseOut={e => e.target.getStage()!.container().style.cursor = "default"}
                                />
                            )}
                            {named && (<Text x={x + 5} y={y} fontSize={20} fill="#f00" text={name} />)}
                        </Fragment>
                    )
                })}
            </Group>
            {rulerPoint && (
                <>
                    <Html
                        divProps={{ style: htmlStyle }}
                        transformFunc={(transform) => ({ ...transform, rotation: 0, scaleY: 1, scaleX: 1 })}
                    >
                        <AntdDrop menu={{ items, selectable: true, defaultSelectedKeys: ["2"], onClick: onMenuClick }}>
                            <span> {menuLabel} <DownOutlined /></span>
                        </AntdDrop>
                    </Html>
                    <Line points={[...rulerPoint.ruler1, ...rulerPoint.ruler2]} stroke="#FF005C" />
                </>
            )}
        </Group>
    )
}

export default BezierLine
