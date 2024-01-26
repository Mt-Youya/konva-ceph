import { Group, Label, Line, Tag, Text } from "react-konva"
import { measureAngle } from "@/features"
import { useLog10 } from "./useHooks"
import Konva from "konva"
import SingleCircle from "./SingleCircle"

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

    const FIRST = "first", SECOND = "second", END = "end"

    function handleCircleMove(e: TKDragEvent, order: string) {
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

    const angle = p2 && p3 && Math.round(measureAngle(p2, p1, p2, p3))

    return (
        <Group draggable onDragMove={() => setP3(prev => ({ ...prev }))}>
            <Line
                stroke="#ffe40080"
                points={p2 ? [p1.x, p1.y, p2.x, p2.y] : [p1.x, p1.y, Mx, My]} strokeWidth={5 / scale}
            />
            <SingleCircle
                stroke="#FFE400"
                ref={circle1Ref} point={p1} radius={5 / scale} strokeWidth={2 / scale}
                onDragMove={(e: TKDragEvent) => handleCircleMove(e, FIRST)}
            />
            {p2 && (
                <>
                    <Line
                        stroke="#ffe40080"
                        strokeWidth={5 / scale} points={p3 ? [p2.x, p2.y, p3.x, p3.y] : [p2.x, p2.y, Mx, My]}
                    />
                    <SingleCircle
                        stroke="#FFE400"
                        ref={circle2Ref} point={p2} radius={5 / scale} strokeWidth={2 / scale}
                        onDragMove={(e: TKDragEvent) => handleCircleMove(e, SECOND)}
                    />
                </>
            )}
            {p2 && p3 && (
                <>
                    <Group scale={{ x: 1 / scale, y: 1 / scale }}>
                        <Label x={p2.x * scale + 10} y={p2.y * scale}>
                            <Tag fill="#32393F" cornerRadius={4} />
                            <Text padding={10} fill="#FFE400" text={`${angle} ° `} />
                        </Label>
                        <Label x={p2.x * scale + useLog10(angle, 20)} y={p2.y * scale}>
                            <Tag fill="#32393F" cornerRadius={4} />
                            <Text padding={10} fill="#fff" text="X" onClick={closeAngle} />
                        </Label>
                    </Group>
                    <SingleCircle
                        stroke="#FFE400"
                        ref={circle3Ref} point={p3} radius={5 / scale} strokeWidth={2 / scale}
                        onDragMove={(e: TKDragEvent) => handleCircleMove(e, END)}
                    />
                </>
            )}
        </Group>
    )
}

export default memo(SingleAngle)
