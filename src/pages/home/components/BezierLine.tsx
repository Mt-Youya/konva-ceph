import { Fragment } from "react"
import { Group, Line, Text } from "react-konva"
import { Html } from "react-konva-utils"
import { changePointList } from "@/stores/home/useDataPoints"
import { setTableData, setUnitLength } from "@/stores/home/getTableData"
import { setSelectPointKey } from "@/stores/home/userInfo"
import { getAllPointMethodMap, getPurePoints, getRelativePointsGroup } from "../data"
import Konva from "konva"
import algorithmMap, { distanceRates } from "../algorithms"
import SingleCircle from "@/components/SingleCircle"

import type { IMap, TTargetMap } from "@/pages/home/data"
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
    const { tableData, rulerScaling } = useSelector((state: RootState) => state.tableData)
    const { algorithmWay } = useSelector((state: RootState) => state.algorithm)
    const { scaleX } = useSelector((state: RootState) => state.transform)
    const { isReset } = useSelector((state: RootState) => state.reset)

    const [menuLabel, setMenuLabel] = useState(items[1].label)
    const [targetPointsGroup, setTargetPointsGroup] = useState<TTargetMap>(new Map)
    // const [linePos, setLinePos] = useState({ p1: 33, p2: 36, p3: 34, p4: 1 })
    const [rulerPoint, setRulerPoint] = useState<IMap>()

    // const [intersection, setIntersection] = useState({ x: 0, y: 0 })
    // const [intersectionKey, setIntersectionKey] = useState("")

    const pointListRef = useRef<Konva.Group | null>(null)
    const dispatch = useDispatch()

    let algorithm = algorithmMap[algorithmWay.key].algorithm
    let instance = algorithmMap[algorithmWay.key]
    let pointsMethods = getAllPointMethodMap(algorithm, instance)

    // console.log(instance)

    function onDragMove(e: TKMouseEvent, index: number) {
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

    function onCircleEnter(index: number) {
        const circleName = pointList[index].name
        if (circleName === "ruler1" || circleName === "ruler2") return
        dispatch(setSelectPointKey(circleName))
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
        const [SNA, SNB] = list.map(item => {
            if (item.name === "SNA&deg" || item.name === "SNB&deg") {
                return +item.measure_value
            }
        })

        for (const iMeasureDatum of list) {
            if (iMeasureDatum.name === "ANB&deg") {
                iMeasureDatum.measure_value = +(SNA! - SNB!).toFixed(2)
                break
            }
        }
        return list
    }

    function gps2IPoint(list: IPointItem[]) {
        return list.map(({ gps: [x, y] }) => ({ x, y }))
    }

    type TGroupsType = ReturnType<typeof targetPointsGroup.get>
    type TCalculateValue = { [p: string]: number | string }

    function getCalculateValue(groups: TGroupsType) {
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
                calculatedValue[key] = +Math.round(distance * (rulerScaling || 1) * 100) / 100
            } else if (key.includes("&deg")) {
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
        if (pointList?.length > 0) {
            const targetGroup = pointList.map(({ name }) => name)
            const targetPoints = getRelativePointsGroup(targetGroup, algorithm)
            setTargetPointsGroup(targetPoints)
            const RPoints = getPurePoints(pointList)
            setRulerPoint(RPoints)
        }
    }, [pointList])

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

    const scale = pointListRef.current?.getStage()?.scaleX() ?? 1

    const ratioStyle = {
        left: `${rulerPoint?.ruler1?.[0]! + (scaleX === 1 ? 40 / scale : 0)}px`,
        top: `${Math.ceil((rulerPoint?.ruler1?.[1]! + rulerPoint?.ruler2?.[1]!) / 2) - 14 / scale}px`,
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

        // function nList([x, y]: [number, number]) {
        //     return { x, y }
        // }

        // function setShowLinePosFn(p1: number, p2: number, p3: number, p4: number, keyIdx: number) {
        //     setLinePos({ p1, p2, p3, p4 })
        //
        //     const pos1 = nList(pointList[p1].gps)1
        //     const pos2 = nList(pointList[p2].gps)
        //     const pos3 = nList(pointList[p3].gps)
        //     const pos4 = nList(pointList[p4].gps)
        //
        //     const Pi = getLine2LineIntersection(pos1, pos2, pos3, pos4)!
        //
        //     setIntersection({ x: Pi.x, y: Pi.y })
        //     setIntersectionKeyFn(keyIdx)
        // }

        // function setIntersectionKeyFn(idx: number) {
        //     const measureList = JSON.parse(sessionStorage.getItem("tableData")!) as ITableData[]
        //     const key = measureList[idx].name
        //     setIntersectionKey(key)
        // }

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
            // @ts-ignore
            // window.__ceph_setLinePosFn = setShowLinePosFn
            // @ts-ignore
            // window.__ceph_setIntersectionNull = () => setIntersection(null)
        }, [pointList])
    }

    return (
        <Group>
            {/*#region*/}
            {/*{lineList.map((item, index) => (*/}
            {/*    <Fragment key={"line_" + index}>*/}
            {/*        {outline && <Line points={item} stroke="#00b6ff" strokeWidth={2} tension={.5} bezier={true} />}*/}
            {/*    </Fragment>*/}
            {/*))}*/}

            {/*{!!intersection.x && !!intersection.y && !!pointList.length && (*/}
            {/*    <>*/}
            {/*        <Line*/}
            {/*            points={[...pointList[linePos.p1].gps, ...pointList[linePos.p2].gps]}*/}
            {/*            stroke="rgb(100,0,255)" strokeWidth={2}*/}
            {/*        />*/}
            {/*        <Line points={[...pointList[linePos.p3].gps, ...pointList[linePos.p4].gps]}*/}
            {/*              stroke="rgb(220,120,0)" strokeWidth={2}*/}
            {/*        />*/}

            {/*        <Line*/}
            {/*            points={[intersection.x - 20, intersection.y, intersection.x + 20, intersection.y]}*/}
            {/*            stroke="rgb(0,182,255)" strokeWidth={2}*/}
            {/*        />*/}
            {/*        <Line*/}
            {/*            points={[intersection.x, intersection.y - 20, intersection.x, intersection.y + 20]}*/}
            {/*            stroke="rgb(0,182,255)" strokeWidth={2}*/}
            {/*        />*/}
            {/*    </>*/}
            {/*)}*/}
            {/*#endregion*/}
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
                                    fill="#fff" name={name} x={x} y={y} stroke={null} radius={4 / scale}
                                    onDragEnd={() => onDrop(name)}
                                    onDragMove={(e: TKDragEvent) => onDragMove(e, index)}
                                    onMouseOver={() => onCircleEnter(index)}
                                />
                            )}
                            {named &&
                                <Text
                                    fill="#f00" text={name} fontSize={20 / scale} scaleX={scaleX}
                                    x={(scaleX === 1 ? 5 : -8) / scale + x} y={(scaleX === 1 ? 5 : 0) / scale + y}
                                />
                            }
                        </Fragment>
                    )
                })}
            </Group>
        </Group>
    )
}

export default BezierLine
