import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { message, Popconfirm, Progress } from "antd"
import { angleIcon, distanceIcon, resetIcon } from "@/assets/headers"
import { changeAngle, changeDistance, changeImgUrl } from "@/stores/home/useMeasure"
import { changePointList } from "@/stores/home/useDataPoints"
import { changeLateral } from "@/stores/home/useShowPoint"
import { setRulerScaling, setTableData } from "@/stores/home/getTableData"
import { getTableData } from "@/apis/getList"
import { imageToFileByCanvas } from "@/utils/image2File"
import { ImageFileTypes } from "@/types"
import { actionKeys } from "../data"
import {
    AntdScDivider,
    AntdScMask,
    AntdScModal,
    ScHeaderAction,
    ScHeaderNormalButton,
    ScHeaderResetButton,
    ScHeaderWrapper,
} from "./styled"

import type { DragEvent } from "react"
import type { ImageExcAll } from "@/types"
import type { RootState } from "@/stores"
import type { ActionType } from "../data"

function InteractiveActions() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [rate, setRate] = useState(1)
    const [messageApi, contextHolder] = message.useMessage()

    const { angle, distance } = useSelector((state: RootState) => state.measure)
    const dispatch = useDispatch()

    type TInteractiveActionType = Extract<ActionType, "angle" | "distance" | "reset">

    function handleAction(action: TInteractiveActionType) {
        switch (action) {
            case actionKeys.ANGLE:
                return dispatch(changeAngle(!angle))
            case actionKeys.DISTANCE:
                return dispatch(changeDistance(!distance))
            case actionKeys.RESET:
                return resetData()
            default:
                break
        }
    }

    async function handleDrop(e: DragEvent) {
        const src = e.dataTransfer?.getData("text/plain")!
        const image = new Image()
        image.src = src
        try {
            const file = await imageToFileByCanvas(image, "image.jpg")
            const imgUrl = URL.createObjectURL(file)
            dispatch(changeImgUrl(imgUrl))
            fetchFileData(file)
        } catch (err: any) {
            messageApi.error(err)
        }
    }

    function onUpload() {
        const input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("accept", "image/*")
        input.addEventListener("input", handleUpload)
        input.click()

        function handleUpload(e: Event) {
            const target = e.target as HTMLInputElement
            if (!target) return

            const file = target.files![0]
            if (!file) return

            const type = file.type as ImageExcAll
            if (!ImageFileTypes.includes(type)) return
            fetchFileData(file)

            const imgUrl = URL.createObjectURL(file)
            dispatch(changeImgUrl(imgUrl))
            input.removeEventListener("input", handleUpload)
        }
    }

    function fetchFileData(file: File) {
        const fileData = new FormData()
        fileData.append("file", file)
        dispatch(changeLateral(true))

        setLoading(true)
        const intervalId = setInterval(() => {
            setRate(prev => prev < 99 ? prev + 1 : prev)
        }, 40)
        getTableData(fileData).then(({ code, data, msg }) => {
            if (code !== 0) return Promise.reject({ code, msg })
            const { point: points, "measure-items": tableData, "ruler-scaling": rulerScaling } = data

            dispatch(changePointList(points))
            dispatch(setTableData(tableData))
            dispatch(setRulerScaling(rulerScaling))

            sessionStorage.setItem("points", JSON.stringify(points))
            sessionStorage.setItem("tableData", JSON.stringify(tableData))
            sessionStorage.setItem("rulerScaling", JSON.stringify(rulerScaling))
            const timer = setTimeout(() => {
                clearTimeout(timer)
                setLoading(false)
                setRate(0)
            }, 500)
            clearInterval(intervalId)
            setRate(100)
        }).catch(err => {
            messageApi.error(err.message)
            setRate(99)
            setLoading(false)
        })
    }

    function resetData() {
        const points = sessionStorage.getItem("points")!
        const tableData = sessionStorage.getItem("tableData")!
        const rulerScaling = sessionStorage.getItem("rulerScaling")!
        dispatch(changePointList(JSON.parse(points)))
        dispatch(setTableData(JSON.parse(tableData)))
        dispatch(setRulerScaling(JSON.parse(rulerScaling)))
    }

    return (
        <>
            <ScHeaderWrapper>
                <ScHeaderAction onClick={() => handleAction("distance")} className={distance ? "active" : ""}>
                    <img src={distanceIcon} />
                    <span> 测距 </span>
                </ScHeaderAction>
                <ScHeaderAction onClick={() => handleAction("angle")} className={angle ? "active" : ""}>
                    <img src={angleIcon} />
                    <span> 测角度 </span>
                </ScHeaderAction>

                <Popconfirm
                    placement="bottom"
                    title="重置提示!"
                    description="确定重置嘛?"
                    onConfirm={() => handleAction("reset")}
                    okText="确定"
                    cancelText="取消"
                >
                    <ScHeaderResetButton>
                        <img src={resetIcon} />
                        <span> 重置 </span>
                    </ScHeaderResetButton>
                </Popconfirm>
                <div onClick={onUpload} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                    <ScHeaderNormalButton className="upload">
                        <span> 上传图片 </span>
                    </ScHeaderNormalButton>
                </div>
                <ScHeaderNormalButton onClick={() => setOpen(true)}>
                    <span> 完成头测分析 </span>
                </ScHeaderNormalButton>
            </ScHeaderWrapper>

            {contextHolder}

            <AntdScModal
                title="保存成功" destroyOnClose key="save"
                open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}
                footer={[<button key="closeBtn" onClick={() => setOpen(false)}> 我知道了</button>]}
            >
                <p>头测分析结果已保存，您可以关闭页面并回到方案设计页面</p>
                <AntdScDivider />
            </AntdScModal>

            <AntdScMask
                centered open={loading} footer={null} closeIcon={null} key="loading" keyboard
                styles={{ mask: { backgroundColor: "#00000080", backdropFilter: "saturate(180%) blur(20px)" } }}
            >
                <p> 正在为您生成头影测量 ... </p>
                <Progress type="circle" percent={rate} size={80} strokeColor={["#fff"]} trailColor="#363636" />
            </AntdScMask>
        </>
    )
}

export default InteractiveActions
