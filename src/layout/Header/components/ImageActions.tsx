import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Slider } from "antd"
import { mirrorIcon, rotateIcon, brightnessIcon, contrastRatioIcon } from "@/assets/headers"
import { ScHeaderAction, ScHeaderWrapper } from "./styled"
import { actionKeys } from "../data.ts"
import { changeBrightness, changeContrast, changeRotate, changeScaleX } from "@/stores/home/useTransform.ts"
import styled from "styled-components"

import type { RootState } from "@/stores"
import type { ActionType } from "../data.ts"

const AntdScSlider = styled(Slider)`
    width: 200px;
    position: absolute;
    bottom: -30%;
    z-index: 999;
`

function ImageActions() {
    const { brightness, rotate, contrast, scaleX } = useSelector((state: RootState) => state.transform)
    const [sliderMap, setSliderMap] = useState({
        brightnessActive: false,
        contrastActive: false,
    })

    const dispatch = useDispatch()

    function handleAction(action: ActionType, value?: number) {
        switch (action) {
            case actionKeys.BRIGHTNESS:
                dispatch(changeBrightness(value))
                break
            case actionKeys.CONTRAST:
                dispatch(changeContrast(value))
                break
            case actionKeys.ROTATE:
                dispatch(changeRotate(rotate + 90))
                break
            case actionKeys.MIRROR:
                dispatch(changeScaleX(scaleX * -1))
                break
            default:
                break
        }
    }

    function sliderClick(key: keyof typeof sliderMap) {
        setSliderMap(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <ScHeaderWrapper>
            <Link to="/native">Native</Link>
            <ScHeaderAction className={scaleX === -1 ? "active" : ""} onClick={() => handleAction("mirror")}>
                <img src={mirrorIcon} alt="mirror" />
                <span> 镜像 </span>
            </ScHeaderAction>
            <ScHeaderAction className={(rotate / 90) % 4 !== 0 ? "active" : ""} onClick={() => handleAction("rotate")}>
                <img src={rotateIcon} alt="rotate" />
                <span> 旋转 </span>
            </ScHeaderAction>
            <ScHeaderAction
                className={sliderMap.brightnessActive ? "active" : ""}
                onClick={() => sliderClick("brightnessActive")}
            >
                <img src={brightnessIcon} alt="brightness" />
                <span> 亮度 </span>
                {sliderMap.brightnessActive && (
                    <AntdScSlider
                        defaultValue={brightness}
                        trackStyle={{ backgroundColor: "#979797", height: "2px" }}
                        railStyle={{ backgroundColor: "#979797", height: "2px" }}
                        onChange={num => handleAction("brightness", num)}
                    />
                )}
            </ScHeaderAction>
            <ScHeaderAction className={sliderMap.contrastActive ? "active" : ""}
                            onClick={() => sliderClick("contrastActive")}>
                <img src={contrastRatioIcon} alt="contrastRatio" />
                <span> 对比度 </span>
                {sliderMap.contrastActive && (
                    <AntdScSlider
                        defaultValue={contrast * 100}
                        trackStyle={{ backgroundColor: "#979797", height: "2px" }}
                        railStyle={{ backgroundColor: "#979797", height: "2px" }}
                        onChange={num => handleAction("contrast", num / 100)}
                    />
                )}
            </ScHeaderAction>
        </ScHeaderWrapper>
    )
}

export default ImageActions
