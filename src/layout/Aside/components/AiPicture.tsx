import styled from "styled-components"
import XRay from "@/assets/XRays/xray_default.jpg?url"

import type { FC, DragEvent } from "react"

const ScDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;

    & > p {
        margin-bottom: 20px;
    }

    img {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 8px;
    }

    .desc {
        margin: 10px 0;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`

interface IProps {
    src?: string
    desc?: {
        name?: string
        text?: string
    }
}

const AiPicture: FC<IProps> = ({ src = XRay, desc }) => {
    function handleDragStart(e: DragEvent) {
        e.dataTransfer?.setData("text/plain", src)
    }

    return (
        <ScDiv>
            <p>Ai点介绍</p>
            <img onDragStart={handleDragStart} src={src} draggable={true} alt={desc?.name || "软组织鼻根点(N')"} />
            <div className="desc">
                <p>{desc?.name ?? "软组织鼻根点(N')"}</p>
                <p> {desc?.text ?? "软组织侧面上相应之鼻根点软组织侧面上相应之鼻根点软组织侧面上相应之鼻根点软组织侧面上相应之鼻根点"} </p>
            </div>
        </ScDiv>
    )
}

export default AiPicture