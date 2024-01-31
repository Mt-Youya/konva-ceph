import { Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Group, Line, Text } from "react-konva"
import { Html } from "react-konva-utils"
import { Select } from "antd"
import { changePointList } from "@/stores/home/useDataPoints"
import { setRulerScaling, setTableData, setUnitLength } from "@/stores/home/getTableData"
import { setSelectPointKey } from "@/stores/home/userInfo"
import { setCalcAlgorithmsMap } from "@/stores/cache/algorithms"
import { getAllPointMethodMap, getRelativePointsGroup } from "../data"
import { useRulerScale } from "@/hooks/useRulerScale"
import styled from "styled-components"
import Konva from "konva"
import algorithmMap, { distanceRates } from "../algorithms"
import SingleCircle from "@/components/SingleCircle"

import type { ForwardedRef } from "react"
import type { IMap } from "@/pages/home/data"
import type { RootState } from "@/stores"
import type { IPointItem } from "@/stores/home/useDataPoints"
import type { ITableData } from "@/apis/getList"
import type { TKDragEvent, TKMouseEvent } from "@/types"

const AntdSelect = styled(Select)`
    background-color: #414141;
    color: #fff;
    border-radius: 4px;
    padding: 6px;

    &.ant-select > .ant-select-selector {
        background-color: unset;
        border: unset;
        color: inherit;
    }

    &.ant-select-open > .ant-select-selector {
        .ant-select-selection-item {
            color: inherit;
        }
    }

    &.ant-select > .ant-select-arrow {
        color: inherit;
    }
`

const ScRatioSpace = styled.div`
    position: absolute;
    white-space: nowrap;
`

const items = [
    { value: 5, label: "5mm" },
    { value: 10, label: "10mm" },
    { value: 15, label: "15mm" },
    { value: 20, label: "20mm" },
]

function BezierLine(_p: any, ref: ForwardedRef<any>) {
    const { named, major } = useSelector((state: RootState) => state.showPoint)
    const { pointList } = useSelector((state: RootState) => state.dataPoint)
    const { tableData, rulerScaling, unitLength } = useSelector((state: RootState) => state.tableData)
    const { algorithmWay } = useSelector((state: RootState) => state.algorithm)
    const { calcAlgorithmsMap } = useSelector((state: RootState) => state.algorithmsCache)
    const { scaleX } = useSelector((state: RootState) => state.transform)
    const { isReset } = useSelector((state: RootState) => state.reset)
    const { loadCount } = useSelector((state: RootState) => state.reload)

    const [_, setTemp] = useState(0)
    const [menu, setMenu] = useState(items[1].value)
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
            const result = useRulerScale(pointList, unitLength)
            dispatch(setRulerScaling(result))
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

    function handleSelectChange(value: typeof items[number]["value"]) {
        setMenu(value)
        dispatch(setUnitLength(value / 10))
    }

    useEffect(() => {
        if (loadCount > 0) {
            handleSelectChange(10)
        }
    }, [loadCount])

    useEffect(() => {
        if (tableData?.length !== 0) {
            sessionStorage.setItem("tempTableData", JSON.stringify(tableData))
        }
    }, [tableData])

    useEffect(() => {
        if (isReset) {
            handleSelectChange(10)
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
        left: `${(rulerPoint?.ruler1?.[0] ?? 0) + 30 / scale}px`,
        top: `${Math.ceil((rulerPoint?.ruler1?.[1]! + rulerPoint?.ruler2?.[1]!) / 2) + 10 / scale}px`,
        transform: `scaleX(${scaleX / scale}) scaleY(${1 / scale})`,
    }

    useImperativeHandle(ref, () => ({ setTemp }))

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
                            <AntdSelect autoFocus value={menu} options={items}
                                        onChange={value => handleSelectChange(value as number)}
                            />
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

export default forwardRef(BezierLine)
