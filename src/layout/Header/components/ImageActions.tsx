import { useEffect, useState } from "react"
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

    interface ISliderMap {
        [P: string]: boolean

        brightnessActive: boolean
        contrastActive: boolean
    }

    const [sliderMap, setSliderMap] = useState<ISliderMap>({ brightnessActive: false, contrastActive: false })
    const [bright, setBright] = useState(brightness)
    const [contrasted, setContrasted] = useState(contrast)

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

    useEffect(() => handleAction("brightness", bright), [bright])

    useEffect(() => handleAction("contrast", contrasted), [contrasted])

    function sliderClick(key: keyof typeof sliderMap) {
        const otherKey = key === "contrastActive" ? "brightnessActive" : "contrastActive"
        setSliderMap(prev => ({ [otherKey]: false, [key]: !prev[key] } as ISliderMap))
    }

    return (
        <ScHeaderWrapper>
            <Link to="/native">Native</Link>
            <ScHeaderAction>
                <img src={mirrorIcon} onClick={() => handleAction("mirror")} alt="mirror" />
                <span> 镜像 </span>
            </ScHeaderAction>
            <ScHeaderAction onClick={() => handleAction("rotate")}>
                <img src={rotateIcon} alt="rotate" />
                <span> 旋转 </span>
            </ScHeaderAction>
            <ScHeaderAction onClick={() => sliderClick("brightnessActive")}>
                <img src={brightnessIcon} alt="brightnessActive" />
                <span> 亮度 </span>
                {sliderMap.brightnessActive && (
                    <AntdScSlider
                        value={bright} min={-1} max={1} step={.05}
                        trackStyle={{ backgroundColor: "#93bef2", height: "4px" }}
                        railStyle={{ backgroundColor: "#979797", height: "2px" }}
                        onChange={num => setBright(num)}
                    />
                )}
            </ScHeaderAction>
            <ScHeaderAction onClick={() => sliderClick("contrastActive")}>
                <img src={contrastRatioIcon} alt="contrastActive" />
                <span> 对比度 </span>
                {sliderMap.contrastActive && (
                    <AntdScSlider
                        value={contrasted} min={-100} max={100} step={1}
                        trackStyle={{ backgroundColor: "#93bef2", height: "4px" }}
                        railStyle={{ backgroundColor: "#979797", height: "2px" }}
                        onChange={num => setContrasted(num)}
                    />
                )}
            </ScHeaderAction>
        </ScHeaderWrapper>
    )
}

export default ImageActions
