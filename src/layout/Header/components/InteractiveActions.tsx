import { useDispatch, useSelector } from "react-redux"
import { message, Popconfirm, Progress } from "antd"
import { actionKeys } from "../data/data"
import { angleIcon, distanceIcon, resetIcon } from "@/assets/headers"
import { getTableData } from "@/apis/getList"
import { dataURLtoBlob } from "@/utils/base64ToBlob"
import { arrayToExcel } from "@/utils/array2Excel"
import { ImageFileTypes } from "@/types"
import { POINTS_CONSTANTS } from "@/pages/home/constants/common"
import { getAllPointMethodMap } from "@/pages/home/data"
import { setCalcAlgorithmsMap } from "@/stores/cache/algorithms"
import { changePointList } from "@/stores/home/useDataPoints"
import { setRulerScaling, setTableData } from "@/stores/home/getTableData"
import { setCacheAlgorithmsMap, setCachePoints, setCacheTableData } from "@/stores/cache"
import { changeAngle, changeDistance, changeImgUrl } from "@/stores/home/useMeasure"
import { changeBrightness, changeContrast, changeRotate, changeScaleX } from "@/stores/home/useTransform"
import { changeLateral, changeMajor, changeNamed, changeOutline, changeSupport } from "@/stores/home/useShowPoint"
import { getAlgorithmState, getMeasureState, getShowPointState, getTransformState } from "@/stores/utils/getState"
import { setLoadCount } from "@/stores/header/reload"
import { setAlgorithm } from "@/stores/aside"
import { setReset } from "@/stores/header/reset"
import {
    AntdScDivider, AntdScHeaderButton,
    AntdScMask,
    AntdScModal,
    ScHeaderAction,
    ScHeaderBtnContainer,
    ScHeaderMeasureContainer,
    ScHeaderResetButton,
    ScHeaderWrapper,
} from "./styled"
import randomUUID from "@/utils/randomUUID"
import algosTableData from "@/constants/algosTableData"
import algorithmMap, { distanceRates } from "@/pages/home/algorithms"
import JSZip from "jszip"
// import useInputFileEle from "../hooks/useInputFileEle"

import type { ActionType } from "../data/data"
import type { RootState } from "@/stores"
import type { ImageExcAll } from "@/types"
import type { IPointItem } from "@/stores/home/useDataPoints"

function InteractiveActions() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [rate, setRate] = useState(1)
    const [imgUrl, setImgUrl] = useState<string | ArrayBuffer | null>(null)
    const [imgType, setImgType] = useState("jpeg")
    const [downloading, setDownloading] = useState(false)

    const { angle, distance } = useSelector((state: RootState) => state.measure)
    const { pointList } = useSelector((state: RootState) => state.dataPoint)
    const { algorithmWay } = useSelector((state: RootState) => state.algorithm)
    const { calcAlgorithmsMap } = useSelector((state: RootState) => state.algorithmsCache)
    const { unitLength, rulerScaling } = useSelector((state: RootState) => state.tableData)
    const cache = useSelector((state: RootState) => state.cache)
    const { cachePoints, cacheTableData, cacheAlgorithmsMap } = cache

    const dispatch = useDispatch()

    // const inputRef = useInputFileEle(handleUpload)

    const storeState = {
        transform: getTransformState(),
        showPoint: getShowPointState(),
        measure: getMeasureState(),
        algorithms: getAlgorithmState(),
    }

    type TInteractiveActionType = Extract<ActionType, "angle" | "distance" | "reset">

    function handleAction(action: TInteractiveActionType) {
        switch (action) {
            case actionKeys.ANGLE:
                distance && dispatch(changeDistance(false))
                return dispatch(changeAngle(!angle))
            case actionKeys.DISTANCE:
                angle && dispatch(changeAngle(false))
                return dispatch(changeDistance(!distance))
            case actionKeys.RESET:
                return resetData()
            default:
                return
        }
    }

    function resetData() {
        dispatch(setReset(true))
        dispatch(setCalcAlgorithmsMap(cacheAlgorithmsMap))
        dispatch(changePointList(cachePoints))
        dispatch(setTableData(cacheTableData))
        const { measure, transform, showPoint, algorithms } = storeState

        dispatch(changeDistance(measure.distance))
        dispatch(changeAngle(measure.angle))

        dispatch(changeNamed(showPoint.named))
        dispatch(changeMajor(showPoint.major))
        dispatch(changeOutline(showPoint.outline))
        dispatch(changeSupport(showPoint.support))
        dispatch(changeLateral(showPoint.lateral))

        dispatch(changeContrast(transform.contrast))
        dispatch(changeRotate(transform.rotate))
        dispatch(changeScaleX(transform.scaleX))
        dispatch(changeBrightness(transform.brightness))

        dispatch(setAlgorithm(algorithms.algorithmWay))
    }

    function handleAnalysisUpload() {
        // inputRef.current?.click()
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.addEventListener("change", handleUpload)
        input.click()

        async function handleUpload(e: Event) {
            const target = e.target as HTMLInputElement
            if (!target) return

            const [file] = target.files!
            if (!file) return

            const type = file.type as ImageExcAll
            if (!ImageFileTypes.includes(type)) return

            setImgType(type.split("/")[1])
            // const blob = await getFileUrl(file)
            const url = URL.createObjectURL(file)
            setImgUrl(url)
            dispatch(changeImgUrl(url))
            count++
            input.remove()
            await fetchFileData(file)
            dispatch(setLoadCount(count))
        }
    }

    let count = 0

    function calcAllAlgorithms(pointList: IPointItem[], rulerScaling = 1) {
        let allAlgorithms = POINTS_CONSTANTS
        for (const algorithmMapKey in algorithmMap) {
            allAlgorithms = { ...allAlgorithms, ...algorithmMap[algorithmMapKey].algorithm }
        }
        const idxsMap = new Map

        const pointsMap = new Map
        for (const iPointItem of pointList) {
            pointsMap.set(iPointItem.name, iPointItem.gps)
        }

        for (const algoKey in allAlgorithms) {
            const item = allAlgorithms[algoKey]
            const idxs = []
            for (const iName of item) {
                const [x, y] = pointsMap.get(iName)
                idxs.push({ x, y })
            }
            idxsMap.set(algoKey, idxs)
        }

        type TCalculateValue = { [p: string]: number | string }
        let cache: TCalculateValue = {}

        let algorithm = algorithmMap[algorithmWay.key].algorithm
        let instance = algorithmMap[algorithmWay.key]
        let pointsMethods = getAllPointMethodMap(algorithm, instance)

        for (const algoKey in algosTableData) {
            algorithm = algorithmMap[algoKey].algorithm
            instance = algorithmMap[algoKey]
            pointsMethods = getAllPointMethodMap(algorithm, instance)

            const element = algosTableData[algoKey]
            const calculatedValue: TCalculateValue = {}
            for (const ele of element) {
                const key = ele.name
                const table = idxsMap.get(key)
                if (!table) {
                    // console.log("table: Not Found", key, table, algoKey)
                    continue
                }
                const value = pointsMethods[key]
                if (!value) {
                    // console.log("value: Not Found", pointsMethods, key, value, algoKey)
                    continue
                }
                const xyPoints = [...table]
                if (key.includes("&mm")) {
                    const distance = instance.handleDistance(xyPoints, value)!
                    calculatedValue[key] = +Math.round(distance * 100) / 100
                    if (rulerScaling === 0) {
                        calculatedValue[key] = "-"
                    }
                } else if (key.includes("&deg")) {
                    const angle = instance.handleAngle(xyPoints, value)!
                    calculatedValue[key] = !!angle ? +(Math.round(angle * 100) / 100).toFixed(2) : (+angle).toFixed(2)
                } else if (key.includes("&rate")) {
                    const rate = instance.handleRate(xyPoints, value)!
                    calculatedValue[key] = +(Math.round(rate * 100) / 100).toFixed(2)
                    if (rulerScaling === 0 && distanceRates.includes(key)) {
                        calculatedValue[key] = "-"
                    }
                }
            }
            cache = { ...cache, ...calculatedValue }
        }
        const cacheMap: any = {}
        for (const cacheKey in cache) {
            const value = cache[cacheKey]
            if (cacheMap[cacheKey]) continue
            cacheMap[cacheKey] = value
        }

        cacheMap["ANB&deg"] = +(+cacheMap["SNA&deg"] - +cacheMap["SNB&deg"]).toFixed(2)

        dispatch(setCalcAlgorithmsMap(cacheMap))
        dispatch(setCacheAlgorithmsMap(cacheMap))
    }

    const delay = (function() {
        const VITE_MODE = import.meta.env.VITE_MODE
        switch (VITE_MODE) {
            case "development":
                return 40
            case "qa":
            case "qa2":
            case "production":
                return 120
            default:
                return 40
        }
    })()

    async function fetchFileData(file: File) {
        const fileData = new FormData()
        fileData.append("file", file)
        dispatch(changeLateral(true))

        setLoading(true)
        const intervalId = setInterval(() => {
            setRate(prev => prev < 99 ? prev + 1 : prev)
        }, delay)
        return getTableData(fileData).then(({ code, data, msg }) => {
            if (code !== 0) return message.error(msg)
            const { point: points, "measure-items": measureData, "ruler-scaling": rulerScaling } = data
            const keyFlag = { "-1": "down", "0": "normal", "1": "up" }
            const dataList = measureData.map(item => {
                return {
                    ...item,
                    tips: { [keyFlag[item.flag]]: item.result_desc },
                }
            })

            const floorPoints = points.map(({ name, gps }) => ({ name, gps: [Math.floor(gps[0]), Math.floor(gps[1])] }))
            dispatch(changePointList(floorPoints))
            dispatch(setTableData(dataList))
            dispatch(setRulerScaling(Math.abs(rulerScaling)))
            dispatch(setAlgorithm(storeState.algorithms.algorithmWay))

            const timer = setTimeout(() => {
                dispatch(setCacheTableData(dataList))
                dispatch(setCachePoints(points))
                calcAllAlgorithms(points, Math.abs(rulerScaling))
                setRate(0)
                clearTimeout(timer)
            }, 500)

            setRate(100)
        }).catch(() => {
            setRate(0)
            setLoading(false)
        }).finally(() => {
            clearInterval(intervalId)
            setLoading(false)
        })
    }

    async function downloadZip() {
        if (!pointList.length) {
            return message.warning("暂无头测点相关信息,请先上传头影图片!")
        }
        setDownloading(true)
        const str = await getMarkImageBlob()

        const zip = new JSZip
        const xlsxList = []

        for (const algosTableDataKey in algosTableData) {
            const table = algosTableData[algosTableDataKey].map(item => {
                const up = +item.standard_value + +item.standard_deviation
                const down = +item.standard_value - +item.standard_deviation
                const key = +item.measure_value > up ? "up" : +item.measure_value < down ? "down" : "normal"
                const desc = item.tips?.[key] || ""
                const value = calcAlgorithmsMap?.[item.name] ? calcAlgorithmsMap?.[item.name] * unitLength * rulerScaling : "-"
                return {
                    "测量项目": item.measure_name,
                    "标准值": item.standard_value,
                    "标准差": item.standard_deviation,
                    "测量值": value,
                    "测量结果描述": desc,
                }
            })

            xlsxList.push({ name: algosName[algosTableDataKey], table })
        }

        const Pn = pointList.find(p => p.name === "N")!.gps

        const table = pointList.map((p, index) => {
            return {
                "序号": index + 1,
                "点简写": p.name,
                "点坐标": translate2NOriginPoint(p.gps, Pn).join(","),
            }
        })

        const src = await dataURLtoBlob(imgUrl as string)
        xlsxList.push({ name: "坐标版", table })
        zip.file("分析法.xlsx", arrayToExcel(xlsxList))
        zip.file(`xray_头颅侧位定位片.${imgType}`, src)
        zip.file(`xray_头颅侧位定位片_Landmark.${imgType}`, str!, { base64: true })
        zip.generateAsync({ type: "blob" }).then(content => downloadHandler(content, `头影测量_${randomUUID()}.zip`))

    }

    function downloadHandler(url: Blob, saveName: string) {
        const src = url instanceof Blob ? URL.createObjectURL(url) : ""
        const aLink = document.createElement("a")
        aLink.href = src
        aLink.download = saveName || "" // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        aLink.click()
        setDownloading(false)
    }

    async function getMarkImageBlob(): Promise<string> {
        const img = new Image
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!
        img.src = imgUrl + ""
        return new Promise(resolve => {
            img.onload = () => {
                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight
                ctx.drawImage(img, 0, 0)

                function addCircleAndText(pointItem: IPointItem) {
                    ctx.save()
                    ctx.beginPath()
                    ctx.arc(pointItem.gps[0], pointItem.gps[1], 3, 0, 2 * Math.PI, true)
                    ctx.fillStyle = "#fff"
                    ctx.fill()
                    ctx.strokeStyle = "#fff"
                    ctx.stroke()
                    ctx.closePath()
                    ctx.font = "14px Arial"
                    ctx.fillStyle = "red"
                    ctx.fillText(pointItem.name, pointItem.gps[0] + 5, pointItem.gps[1] - 5)
                    ctx.restore()
                }

                for (const iPointItem of pointList) {
                    addCircleAndText(iPointItem)
                }

                const src = canvas.toDataURL()
                resolve(src.substring(src.indexOf(",") + 1))
                canvas.remove()
            }
        })
    }

    const algosName: { [key: string]: string } = {
        Burstone: "Burstone分析法",
        DoctorLee: "李博分析法",
        Downs: "Downs分析法",
        Jarabak: "Jarabak分析法",
        McNamara: "McNamara分析法",
        Ricketts: "Ricketts分析法",
        Steiner: "Steiner分析法",
        Tweed: "Tweed分析法",
        PerkingUniversity: "北大分析法",
        Holdaway: "Holdaway分析法",
        SH9Hospital: "上海九院分析法",
        WestChina: "华西分析法",
        Wylie: "Wylie分析法",
    }

    function translate2NOriginPoint(point: [number, number], Pn: [number, number]) {
        const [x0, y0] = Pn
        const [x, y] = point
        return [(x - x0).toFixed(2), (y - y0).toFixed(2)]
    }

    useEffect(() => () => URL.revokeObjectURL(imgUrl as string), [])

    return (
        <>
            <ScHeaderWrapper className="interactive-wrapper">
                <ScHeaderMeasureContainer>
                    <ScHeaderAction onClick={() => handleAction("distance")} className={distance ? "active" : ""}>
                        <img src={distanceIcon} alt="测距" />
                        <span> 测距 </span>
                    </ScHeaderAction>
                    <ScHeaderAction onClick={() => handleAction("angle")} className={angle ? "active" : ""}>
                        <img src={angleIcon} alt="测角度" />
                        <span> 测角度 </span>
                    </ScHeaderAction>
                </ScHeaderMeasureContainer>
                <ScHeaderBtnContainer>
                    <Popconfirm
                        placement="bottom" title="重置提示!" description="确定重置嘛?" okText="确定" cancelText="取消"
                        onConfirm={() => handleAction("reset")}
                    >
                        <ScHeaderResetButton>
                            <img src={resetIcon} alt="reset" />
                            <span> 重置 </span>
                        </ScHeaderResetButton>
                    </Popconfirm>
                    {/*<div onClick={handleUploadClick} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>*/}
                    {/*    <ScHeaderNormalButton className="upload">*/}
                    {/*        <span> 上传图片 </span>*/}
                    {/*    </ScHeaderNormalButton>*/}
                    {/*</div>*/}
                    <AntdScHeaderButton onClick={handleAnalysisUpload}>
                        <span> 上传 </span>
                    </AntdScHeaderButton>
                    <AntdScHeaderButton onClick={downloadZip} loading={downloading} hasloading="true">
                        <span> 下载 </span>
                    </AntdScHeaderButton>
                </ScHeaderBtnContainer>
            </ScHeaderWrapper>

            <AntdScMask
                centered keyboard key="loading" open={loading} footer={null} closeIcon={null}
                styles={{ mask: { backgroundColor: "#00000080", backdropFilter: "saturate(180%) blur(20px)" } }}
            >
                <p> 正在为您生成头影测量 ... </p>
                <Progress type="circle" percent={rate} size={80} strokeColor={["#fff"]} trailColor="#363636" />
            </AntdScMask>

            <AntdScModal
                destroyOnClose key="save" title="保存成功"
                open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}
                footer={[<button key="closeBtn" onClick={() => setOpen(false)}> 我知道了</button>]}
            >
                <p>头测分析结果已保存，您可以关闭页面并回到方案设计页面</p>
                <AntdScDivider />
            </AntdScModal>
        </>
    )
}

export default InteractiveActions
