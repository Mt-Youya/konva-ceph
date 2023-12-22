import { useDispatch, useSelector } from "react-redux"
import { changeLateral, changeMajor, changeNamed, changeOutline, changeSupport } from "@/stores/home/useShowPoint"
import {
    lateralActiveIcon, lateralIcon,
    majorActiveIcon, majorIcon,
    nameActiveIcon, nameIcon,
    supportActiveIcon, supportIcon,
    outlineActiveIcon, outlineIcon,
} from "@/assets/headers"
import { actionKeys } from "../data/data"
import { ScHeaderAction, ScHeaderWrapper } from "./styled"

import type { RootState } from "@/stores"
import type { ActionType } from "../data/data"

function BezierLineActions() {
    const { named, outline, major, support, lateral } = useSelector((state: RootState) => state.showPoint)
    const dispatch = useDispatch()

    type TBezierActionType = Extract<ActionType, "major" | "outline" | "lateral" | "support" | "named">

    function handleAction(action: TBezierActionType) {
        switch (action) {
            case actionKeys.OUTLINE:
                return dispatch(changeOutline(!outline))
            case actionKeys.LATERAL:
                return dispatch(changeLateral(!lateral))
            case actionKeys.NAME:
                return dispatch(changeNamed(!named))
            case actionKeys.SUPPORT:
                return dispatch(changeSupport(!support))
            case actionKeys.MAJOR:
                return dispatch(changeMajor(!major))
            default:
                return
        }
    }

    return (
        <ScHeaderWrapper>
            <ScHeaderAction onClick={() => handleAction("lateral")}>
                <img src={lateral ? lateralActiveIcon : lateralIcon} />
                <span> 侧位片 </span>
            </ScHeaderAction>
            <ScHeaderAction onClick={() => handleAction("named")}>
                <img src={named ? nameActiveIcon : nameIcon} />
                <span> 名称 </span>
            </ScHeaderAction>
            <ScHeaderAction onClick={() => handleAction("major")}>
                <img src={major ? majorActiveIcon : majorIcon} />
                <span> 主点 </span>
            </ScHeaderAction>
            <ScHeaderAction onClick={() => handleAction("support")}>
                <img src={support ? supportActiveIcon : supportIcon} />
                <span> 辅助点 </span>
            </ScHeaderAction>
            <ScHeaderAction onClick={() => handleAction("outline")}>
                <img src={outline ? outlineActiveIcon : outlineIcon} />
                <span> 轮廓 </span>
            </ScHeaderAction>
        </ScHeaderWrapper>
    )
}

export default BezierLineActions
