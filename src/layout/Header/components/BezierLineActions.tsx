import { useDispatch, useSelector } from "react-redux"
import { changeLateral, changeMajor, changeNamed, changeOutline, changeSupport } from "@/stores/home/useShowPoint"
import { actionKeys } from "../data/data"
import { ScHeaderAction, ScHeaderWrapper } from "./styled"
import {
    lateralIcon,
    lateralActiveIcon,
    majorIcon,
    majorActiveIcon,
    nameIcon,
    nameActiveIcon,
    outlineIcon,
    outlineActiveIcon,
    supportIcon,
    supportActiveIcon,
} from "@/assets/headers"

import type { RootState } from "@/stores"
import type { ActionType } from "../data/data"

function BezierLineActions() {
    const { named, outline, major, support, lateral } = useSelector((state: RootState) => state.showPoint)
    const dispatch = useDispatch()

    type TBezierActionType = Extract<ActionType, "major" | "outline" | "lateral" | "support" | "named">

    function handleAction(action: TBezierActionType) {
        switch (action) {
            case actionKeys.OUTLINE:
                dispatch(changeOutline(!outline))
                break
            case actionKeys.LATERAL:
                dispatch(changeLateral(!lateral))
                break
            case actionKeys.NAME:
                dispatch(changeNamed(!named))
                break
            case actionKeys.SUPPORT:
                dispatch(changeSupport(!support))
                break
            case actionKeys.MAJOR:
                dispatch(changeMajor(!major))
                break
            default:
                break
        }
    }

    return (
        <ScHeaderWrapper>
            <ScHeaderAction className={!lateral ? "active" : ""} onClick={() => handleAction("lateral")}>
                <img src={lateral ? lateralActiveIcon : lateralIcon} alt="lateral" />
                <span> 侧位片 </span>
            </ScHeaderAction>
            <ScHeaderAction className={!named ? "active" : ""} onClick={() => handleAction("named")}>
                <img src={named ? nameActiveIcon : nameIcon} alt="named" />
                <span> 名称 </span>
            </ScHeaderAction>
            <ScHeaderAction className={!major ? "active" : ""} onClick={() => handleAction("major")}>
                <img src={major ? majorActiveIcon : majorIcon} alt="major" />
                <span> 主点 </span>
            </ScHeaderAction>
            <ScHeaderAction className={!support ? "active" : ""} onClick={() => handleAction("support")}>
                <img src={support ? supportActiveIcon : supportIcon} alt="support" />
                <span> 辅助点 </span>
            </ScHeaderAction>
            <ScHeaderAction className={!outline ? "active" : ""} onClick={() => handleAction("outline")}>
                <img src={outline ? outlineActiveIcon : outlineIcon} alt="outline" />
                <span> 轮廓 </span>
            </ScHeaderAction>
        </ScHeaderWrapper>
    )
}

export default BezierLineActions
