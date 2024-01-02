import { Group, Line } from "react-konva"
import { Html } from "react-konva-utils"
import { createLabelStyle, measureAngle } from "@/features"
import { useLabelId } from "./useHooks"
import Konva from "konva"
import SingleCircle from "./SingleCircle"

import type { KonvaEventObject } from "konva/lib/Node"
import type { IPoint, TKDragEvent } from "@/types"

interface IProps {
    points: IPoint[]
    movePoint: IPoint
    scale: number
    closeAngle: () => void
}

function SingleAngle({ points, movePoint: { x: Mx, y: My }, closeAngle, scale = 1 }: IProps) {
    const [p1, setP1] = useState(points[0])
    const [p2, setP2] = useState(points[1])
    const [p3, setP3] = useState(points[2])

    const circle1Ref = useRef<Konva.Circle>(null)
    const circle2Ref = useRef<Konva.Circle>(null)
    const circle3Ref = useRef<Konva.Circle>(null)

    const color = "#FFE400"
    const bgColor = "#32393F"
    const FIRST = "first", SECOND = "second", END = "end"

    function handleCircleMove(e: KonvaEventObject<DragEvent>, order: string) {
        e.cancelBubble = true
        const x = +e.target.attrs.x, y = +e.target.attrs.y
        const point = { x, y }
        switch (order) {
            case FIRST:
                return setP1(point)
            case SECOND:
                return setP2(point)
            case END:
                return setP3(point)
            default:
                return
        }
    }

    function useCircleStyle() {
        const [circleLabelStyle, setCircleLabelStyle] = useState<ReturnType<typeof createLabelStyle> | null>(null)

        useEffect(() => {
            if (circle3Ref.current) {
                const circle2Pos = circle2Ref.current!.getAbsolutePosition()!
                const labelStyle = createLabelStyle(circle2Pos.x, circle2Pos.y, color, bgColor)
                setCircleLabelStyle(labelStyle)
            }
        }, [points, p1, p2, p3])

        return circleLabelStyle
    }

    const style = useCircleStyle()!

    const labelId = useLabelId(points, 2)

    return (
        <Group draggable onDragMove={() => setP3(prev => ({ ...prev }))}>
            <SingleCircle
                stroke="#FFE400"
                ref={circle1Ref} point={p1} radius={5 / scale} strokeWidth={2 / scale}
                onDragMove={(e: TKDragEvent) => handleCircleMove(e, FIRST)}
            />
            <Line
                stroke="#ffe40080"
                points={p2 ? [p1.x, p1.y, p2.x, p2.y] : [p1.x, p1.y, Mx, My]} strokeWidth={5 / scale}
            />
            {p2 && (
                <>
                    <SingleCircle
                        stroke="#FFE400"
                        ref={circle2Ref} point={p2} radius={5 / scale} strokeWidth={2 / scale}
                        onDragMove={(e: TKDragEvent) => handleCircleMove(e, SECOND)}
                    />
                    <Line
                        stroke="#ffe40080"
                        strokeWidth={5 / scale} points={p3 ? [p2.x, p2.y, p3.x, p3.y] : [p2.x, p2.y, Mx, My]}
                    />
                </>
            )}
            {p2 && p3 && (
                <>
                    <SingleCircle
                        stroke="#FFE400"
                        ref={circle3Ref} point={p3} radius={5 / scale} strokeWidth={2 / scale}
                        onDragMove={(e: TKDragEvent) => handleCircleMove(e, END)}
                    />
                    <Html divProps={{ style, id: labelId }}>
                        {Math.round(measureAngle(p2, p1, p2, p3))} °&nbsp;
                        <CloseOutlined style={{ color: "#fff", cursor: "pointer" }} onClick={() => closeAngle()} />
                    </Html>
                    {/*<Arc {...p2} innerRadius={10} outerRadius={12} angle={ measureAngle(p2, p1, p2, p3)}*/}
                    {/*    fill="#f0f"/>*/}
                </>
            )}
        </Group>
    )
}

export default memo(SingleAngle)
