import { useDispatch, useSelector } from "react-redux"
import { Slider } from "antd"
import { mirrorIcon, rotateIcon, brightnessIcon, contrastRatioIcon } from "@/assets/headers"
import { ScHeaderAction, ScHeaderWrapper } from "./styled"
import { actionKeys } from "../data/data"
import { changeBrightness, changeContrast, changeRotate, changeScaleX } from "@/stores/home/useTransform.ts"
import styled from "styled-components"

import type { RootState } from "@/stores"
import type { ActionType } from "../data/data"

const AntdScSlider = styled(Slider)`
    width: 200px;
    position: absolute;
    bottom: -50%;
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
                return
            case actionKeys.CONTRAST:
                dispatch(changeContrast(value))
                return
            case actionKeys.ROTATE:
                dispatch(changeRotate(rotate + 90))
                return
            case actionKeys.MIRROR:
                dispatch(changeScaleX(scaleX * -1))
                return
            default:
                return
        }
    }

    useEffect(() => handleAction("brightness", bright), [bright])

    useEffect(() => handleAction("contrast", contrasted), [contrasted])

    function sliderClick(key: keyof typeof sliderMap) {
        const otherKey = key === "contrastActive" ? "brightnessActive" : "contrastActive"
        setSliderMap(prev => ({ [otherKey]: false, [key]: !prev[key] } as ISliderMap))
    }

    const sliderStyle = {
        track: { backgroundColor: "#93bef2", height: "4px" },
        rail: { backgroundColor: "#979797", height: "2px" },
    }

    return (
        <ScHeaderWrapper>
            <ScHeaderAction>
                <img src={mirrorIcon} onClick={() => handleAction("mirror")} alt="mirror" />
                <span> 镜像 </span>
            </ScHeaderAction>
            <ScHeaderAction onClick={() => handleAction("rotate")}>
                <img src={rotateIcon} alt="rotate" />
                <span> 旋转 </span>
            </ScHeaderAction>
            <ScHeaderAction $active={sliderMap.brightnessActive} onClick={() => sliderClick("brightnessActive")}>
                <img src={brightnessIcon} alt="brightness" />
                <span> 亮度 </span>
                {sliderMap.brightnessActive && (
                    <AntdScSlider
                        min={-1} max={1} step={.05} value={bright} styles={sliderStyle}
                        onChange={num => setBright(num)}
                    />
                )}
            </ScHeaderAction>
            <ScHeaderAction $active={sliderMap.contrastActive} onClick={() => sliderClick("contrastActive")}>
                <img src={contrastRatioIcon} alt="contrast" />
                <span> 对比度 </span>
                {sliderMap.contrastActive && (
                    <AntdScSlider
                        min={-100} max={100} step={1} value={contrasted} styles={sliderStyle}
                        onChange={num => setContrasted(num)}
                    />
                )}
            </ScHeaderAction>
        </ScHeaderWrapper>
    )
}

export default ImageActions
