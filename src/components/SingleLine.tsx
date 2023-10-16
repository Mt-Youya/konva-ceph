import { memo, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Group, Line } from "react-konva"
import { Html } from "react-konva-utils"
import { CloseOutlined } from "@ant-design/icons"
import { createLabelStyle } from "@/features"
import Konva from "konva"
import SingleCircle from "@/components/SingleCircle"

import type { IPoint } from "@/types"
import type { KonvaEventObject } from "konva/lib/Node"
import type { RootState } from "@/stores"

const START = "start", END = "end"

interface IProps {
    points: IPoint[]
    movePoint: IPoint
    closeDistance: () => void
}

function SingleLine({ points = [{ x: 0, y: 0 }, { x: 0, y: 0 }], movePoint: { x: Mx, y: My }, closeDistance }: IProps) {
    const [p1, setP1] = useState(points[0])
    const [p2, setP2] = useState(points[1])
    const { rulerScaling } = useSelector((state: RootState) => state.tableData)
    const circle1Ref = useRef<Konva.Circle>(null)
    const circle2Ref = useRef<Konva.Circle>(null)

    function getDistance(points: [IPoint, IPoint], unit = rulerScaling) {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points
        const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        return Math.round(distance * unit)
    }

    function handleCircleMove(e: KonvaEventObject<DragEvent>, order: string) {
        e.cancelBubble = true
        const x = +e.target.attrs.x, y = +e.target.attrs.y
        const point = { x, y }
        switch (order) {
            case START:
                return setP1(point)
            case END:
                return setP2(point)
            default:
                return
        }
    }

    function useCircleStyle() {
        const [circleLabelStyle, setCircleLabelStyle] = useState<ReturnType<typeof createLabelStyle> | null>(null)

        useEffect(() => {
            if (circle2Ref.current) {
                const circle1Pos = circle1Ref.current!.getAbsolutePosition()!
                const circle2Pos = circle2Ref.current!.getAbsolutePosition()!
                const labelStyle = circle2Pos.x > circle1Pos.x
                    ? createLabelStyle(circle2Pos.x, circle2Pos.y)
                    : createLabelStyle(circle1Pos.x, circle1Pos.y)
                setCircleLabelStyle(labelStyle)
            }
        }, [points, p1, p2])

        return circleLabelStyle
    }

    const style = useCircleStyle()!

    return (
        <Group>
            <SingleCircle ref={circle1Ref} point={p1} onCircleMove={(e) => handleCircleMove(e, START)}/>
            <Line points={p2 ? [p1.x, p1.y, p2.x, p2.y] : [p1.x, p1.y, Mx, My]} stroke="#83ECCB"/>
            {p2 && (
                <>
                    <SingleCircle ref={circle2Ref} point={p2} onCircleMove={(e) => handleCircleMove(e, END)}/>
                    {/*<Label  {...p2} >*/}
                    {/*    <Tag fill="#414141" cornerRadius={4}>*/}
                    {/*    </Tag>*/}
                    {/*    <Text padding={10} fill="#83eccb"*/}
                    {/*          text={`${getDistance([p1, p2])} mm`}*/}
                    {/*    />*/}
                    {/*    <Text padding={10} fill="#fff" text=" X" x={60} onClick={() => closeDistance()}/>*/}
                    {/*</Label>*/}
                    <Html divProps={{ style }}>
                        {getDistance([p1, p2])}&nbsp;
                        <span style={{ color: "#fff" }}>
                                            mm &nbsp;
                            <CloseOutlined onClick={() => closeDistance()} style={{ cursor: "pointer" }}/>
                        </span>
                    </Html>
                </>
            )}
        </Group>
    )
}

export default memo(SingleLine)
