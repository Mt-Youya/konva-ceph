import { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Group, Line, Text } from "react-konva"
import { Html } from "react-konva-utils"
import { Dropdown } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { changePointList } from "@/stores/home/useDataPoints"
import { setRulerScaling, setTableData, setUnitLength } from "@/stores/home/getTableData"
import { setSelectPointKey } from "@/stores/home/userInfo"
import { setCalcAlgorithmsMap } from "@/stores/cache/algorithms"
import { getAllPointMethodMap, getRelativePointsGroup } from "../data"
import styled from "styled-components"
import Konva from "konva"
import algorithmMap, { distanceRates } from "../algorithms"
import SingleCircle from "@/components/SingleCircle"

import type { IMap } from "@/pages/home/data"
import type { RootState } from "@/stores"
import type { IPointItem } from "@/stores/home/useDataPoints"
import type { ITableData } from "@/apis/getList"
import type { TKDragEvent, TKMouseEvent } from "@/types"

const AntdDrop = styled(Dropdown)`
    background-color: #414141;
    color: #fff;
    border-radius: 2px;
    padding: 6px;
`

const ScRatioSpace = styled.div`
    position: absolute;
    white-space: nowrap;
`

const items = [
    { key: 5, label: "5mm" },
    { key: 10, label: "10mm" },
    { key: 15, label: "15mm" },
    { key: 20, label: "20mm" },
]

const BezierLine = () => {
    const { named, major } = useSelector((state: RootState) => state.showPoint)
    const { pointList } = useSelector((state: RootState) => state.dataPoint)
    const { tableData, rulerScaling, unitLength } = useSelector((state: RootState) => state.tableData)
    const { algorithmWay } = useSelector((state: RootState) => state.algorithm)
    const { calcAlgorithmsMap } = useSelector((state: RootState) => state.algorithmsCache)
    const { scaleX } = useSelector((state: RootState) => state.transform)
    const { isReset } = useSelector((state: RootState) => state.reset)

    const [menuLabel, setMenuLabel] = useState(items[1].label)
    const [rulerPoint, setRulerPoint] = useState<IMap>()

    const stateRef = useRef({ stateAlgorithms: calcAlgorithmsMap, points: pointList })

    const pointListRef = useRef<Konva.Group | null>(null)
    const dispatch = useDispatch()

    function onDragMove(e: TKMouseEvent, index: number) {
        const newPoints = [...pointList]
        // newPoints[index] = { name: pointList[index].name, gps: [e.target.attrs.x, e.target.attrs.y] }
        newPoints[index] = {
            name: pointList[index].name,
            gps: [Math.floor(e.target.attrs.x), Math.floor(e.target.attrs.y)],
        }
        dispatch(changePointList(newPoints))
    }

    let algorithm = algorithmMap[algorithmWay.key].algorithm
    let instance = algorithmMap[algorithmWay.key]
    let pointsMethods = getAllPointMethodMap(algorithm, instance)

    useEffect(() => {
        stateRef.current.stateAlgorithms = calcAlgorithmsMap
        stateRef.current.points = pointList
    }, [calcAlgorithmsMap, pointList])

    function onDrop(name: string) {
        const pointList = stateRef.current.points
        if (name === "ruler1" || name === "ruler2") {
            const [r1, r2] = pointList.filter(item => item.name === "ruler1" || item.name === "ruler2")
            const rulerScale = r1.gps[1] - r2.gps[1]
            const unit = unitLength * 10
            const result = unit / rulerScale
            dispatch(setRulerScaling(result))
            return
        }

        const targetGroup = pointList.map(({ name }) => name)
        const targetPoints = getRelativePointsGroup(targetGroup, algorithm)
        const target = targetPoints.get(name)!

        const calcValue = getCalculateValue(target)
        const list = computedTableData(calcValue)

        // console.log("stateRef.current.stateAlgorithms", stateRef.current.stateAlgorithms)
        const algoCacheMap = { ...stateRef.current.stateAlgorithms, ...calcValue }
        // const algoCacheMap = { ...calcAlgorithmsMap, ...calcValue }
        dispatch(setCalcAlgorithmsMap(algoCacheMap))
        dispatch(setTableData(list))
    }

    interface IMeasureData extends Omit<ITableData, "measure_value"> {
        measure_value: number | string
    }

    function computedTableData(calcValue: ReturnType<typeof getCalculateValue>) {
        const data = tableData.length !== 0 ? tableData : JSON.parse(sessionStorage.getItem("tempTableData")!)
        const list = JSON.parse(JSON.stringify(data)) as IMeasureData[]
        for (const key in calcValue) {
            for (const item of list) {
                if (key === item.name) {
                    item.measure_value = calcValue[key]
                }
                if (item.measure_value === "-" || item.measure_value === "—") continue
                item.measure_value = +(+item.measure_value).toFixed(2)
            }
        }
        const [SNA, SNB] = list.filter(item => {
            return item.name === "SNA&deg" || item.name === "SNB&deg"
        })

        for (const iMeasureDatum of list) {
            if (iMeasureDatum.name === "ANB&deg") {
                const value = +SNA.measure_value! - +SNB.measure_value!
                iMeasureDatum.measure_value = +value.toFixed(2)
                break
            }
        }
        return list
    }

    function gps2IPoint(list: IPointItem[]) {
        return list.map(({ gps: [x, y] }) => ({ x, y }))
    }

    type TCalculateValue = { [p: string]: number | string }

    function getCalculateValue(groups: IMap) {
        const calculatedValue: TCalculateValue = {}
        for (const key in groups) {
            const idxs = groups[key]
            const pointArr = []
            for (const idx of idxs) {
                pointArr.push(pointList[idx])
            }
            const xyPoints = gps2IPoint(pointArr)

            const value = pointsMethods[key]
            if (key.includes("&mm")) {
                if (rulerScaling === 0) {
                    calculatedValue[key] = "-"
                    continue
                }
                const distance = instance.handleDistance(xyPoints, value)!
                calculatedValue[key] = +Math.round(distance * 100) / 100
            } else if (key.includes("&deg")) {
                if (key.includes("ANB")) {
                    const [sna, snb] = [+calculatedValue["SNA&deg"], +calculatedValue["SNB&deg"]]
                    const anb = sna - snb
                    calculatedValue[key] = +(Math.round(anb * 100) / 100).toFixed(2)
                    continue
                }
                const angle = instance.handleAngle(xyPoints, value)!
                calculatedValue[key] = !!angle ? +(Math.round(angle * 100) / 100).toFixed(2) : (+angle).toFixed(2)
            } else if (key.includes("&rate")) {
                if (rulerScaling === 0 && distanceRates.includes(key)) {
                    calculatedValue[key] = "-"
                    continue
                }
                const rate = instance.handleRate(xyPoints, value)!
                if (rate) {
                    calculatedValue[key] = +(Math.round(rate * 100) / 100).toFixed(2)
                }
            }
        }
        return calculatedValue
    }

    function onMenuClick({ key }: any) {
        const filteredLabel = items.filter(item => item.key === +key)[0]?.label
        setMenuLabel(filteredLabel)
        switch (+key) {
            case items[0].key:
                return dispatch(setUnitLength(0.5))
            case items[1].key:
                return dispatch(setUnitLength(1))
            case items[2].key:
                return dispatch(setUnitLength(1.5))
            case items[3].key:
                return dispatch(setUnitLength(2))
            default:
                return
        }
    }

    useEffect(() => {
        if (tableData?.length !== 0) {
            sessionStorage.setItem("tempTableData", JSON.stringify(tableData))
        }
    }, [tableData])

    useEffect(() => {
        if (isReset) {
            onMenuClick({ key: 10 })
        }
    }, [isReset])

    function arrayEqual(arr1: number[], arr2: number[]) {
        return arr1.every((item, index) => item === arr2[index])
    }

    const rulers = useMemo(() => pointList.filter(item => item.name === "ruler1" || item.name === "ruler2"), [pointList])
    useEffect(() => {
        if (!rulers.length) return
        const [r1, r2] = rulers
        if (!r1 || !r2) return
        const eq1 = arrayEqual(r1.gps, rulerPoint?.ruler1 ?? [])
        const eq2 = arrayEqual(r2.gps, rulerPoint?.ruler2 ?? [])
        if (eq1 && eq2) return
        setRulerPoint({ ruler1: r1.gps, ruler2: r2.gps })
    }, [rulerPoint, rulers])

    const scale = pointListRef.current?.getStage()?.scaleX() ?? 1

    const ratioStyle = {
        left: `${rulerPoint?.ruler1?.[0]! + (scaleX === 1 ? 40 / scale : 0)}px`,
        top: `${Math.ceil((rulerPoint?.ruler1?.[1]! + rulerPoint?.ruler2?.[1]!) / 2) + 10 / scale}px`,
        transform: `scaleX(${scaleX / scale}) scaleY(${1 / scale})`,
    }

    const mode = import.meta.env.VITE_MODE
    if (mode === "qa" || mode === "development") {
        function getAllPointInfoFn() {
            const points = pointList.map(item => ({
                name: item.name,
                coordinate: item.gps.join(","),
            }))
            console.table(points)
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
                delete window.__ceph_setPoint
                // @ts-ignore
                // delete window.__ceph_setLinePosFn
                // // @ts-ignore
                // delete window.__ceph_setIntersectionNull
            }
        }, [])

        useEffect(() => {
            // @ts-ignore
            window.__ceph_getAllPoint = getAllPointInfoFn
            // @ts-ignore
            window.__ceph_setPoint = setPointFn
        }, [pointList])
    }

    return (
        <Group>
            {rulerPoint?.ruler1 && rulerPoint?.ruler2 && (
                <>
                    <Html>
                        <ScRatioSpace style={ratioStyle}>
                            <AntdDrop
                                autoFocus
                                menu={{ items, selectable: true, defaultSelectedKeys: ["10"], onClick: onMenuClick }}
                            >
                                <span>
                                    {menuLabel} <DownOutlined />
                                </span>
                            </AntdDrop>
                        </ScRatioSpace>
                    </Html>
                    <Line points={[...rulerPoint?.ruler1, ...rulerPoint?.ruler2]} stroke="#FF005C" />
                </>
            )}
            <Group ref={pointListRef}>
                {pointList?.map(({ name, gps: [x, y] }, index) => {
                    return (
                        <Fragment key={"point_" + index}>
                            {major && (
                                <SingleCircle
                                    name={name} x={x} y={y} radius={4 / scale} stroke={null}
                                    onDragEnd={() => onDrop(name)}
                                    onDragMove={(e: TKDragEvent) => onDragMove(e, index)}
                                    onMouseOver={() => dispatch(setSelectPointKey(name))}
                                />
                            )}
                            {named && (
                                <Text
                                    fill="#f00" text={name} fontSize={20 / scale} scaleX={scaleX}
                                    x={(scaleX === 1 ? 5 : -8) / scale + x} y={(scaleX === 1 ? 5 : 0) / scale + y}
                                />
                            )}
                        </Fragment>
                    )
                })}
            </Group>
        </Group>
    )
}

export default BezierLine
