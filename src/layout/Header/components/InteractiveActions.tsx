import { memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { message, Popconfirm, Progress } from "antd"
import { angleIcon, distanceIcon, resetIcon } from "@/assets/headers"
import { changeAngle, changeDistance, changeImgUrl } from "@/stores/home/useMeasure"
import { changePointList } from "@/stores/home/useDataPoints"
import { setRulerScaling, setTableData } from "@/stores/home/getTableData"
import { getTableData } from "@/apis/getList"
import { ImageFileTypes } from "@/types"
import { actionKeys } from "../data"
import {
    ScHeaderAction,
    ScHeaderNormalButton,
    ScHeaderResetButton,
    ScHeaderWrapper,
    AntdScDivider,
    AntdScMask,
    AntdScModal,
} from "./styled"

import type { ActionType } from "../data"
import type { RootState } from "@/stores"
import type { ImageExcAll } from "@/types"

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
                dispatch(changeAngle(!angle))
                break
            case actionKeys.DISTANCE:
                dispatch(changeDistance(!distance))
                break
            case actionKeys.RESET:
                resetData()
                break
            default:
                break
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
        }

        function fetchFileData(file: File) {
            const fileData = new FormData()
            fileData.append("file", file)

            setLoading(true)
            const intervalId = setInterval(() => {
                setRate(prev => prev < 99 ? prev + 1 : prev)
            }, 40)
            getTableData(fileData).then(({ code, data, msg }) => {
                if (code !== 0) return Promise.reject(`code: ${code} , msg: ${msg}`)
                const { point: points, "measure-items": tableData, "ruler-scaling": rulerScaling } = data

                dispatch(changePointList(points))
                dispatch(setTableData(tableData))
                dispatch(setRulerScaling(rulerScaling))

                sessionStorage.setItem("points", JSON.stringify(points))
                sessionStorage.setItem("tableData", JSON.stringify(tableData))
                sessionStorage.setItem("rulerScaling", JSON.stringify(rulerScaling))
                const timer = setTimeout(() => {
                    setLoading(false)
                    clearTimeout(timer)
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
                <ScHeaderAction onClick={() => handleAction("distance")}>
                    <img src={distanceIcon}/>
                    <span> 测距 </span>
                </ScHeaderAction>
                <ScHeaderAction onClick={() => handleAction("angle")}>
                    <img src={angleIcon}/>
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
                        <img src={resetIcon}/>
                        <span> 重置 </span>
                    </ScHeaderResetButton>
                </Popconfirm>
                <ScHeaderNormalButton className="upload" onClick={onUpload}>
                    <span> 上传图片 </span>
                </ScHeaderNormalButton>
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
                <AntdScDivider/>
            </AntdScModal>

            <AntdScMask
                centered open={loading} footer={null} closeIcon={null} key="loading" keyboard
                maskStyle={{ backgroundColor: "#00000080", backdropFilter: "saturate(180%) blur(20px)" }}
            >
                <p> 正在为您生成头影测量 ... </p>
                <Progress type="circle" percent={rate} size={80} strokeColor={["#fff"]} trailColor="#363636"/>
            </AntdScMask>
        </>
    )
}

export default memo(InteractiveActions)
