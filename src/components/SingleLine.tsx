import { useSelector } from "react-redux"
import { Group, Label, Line, Tag, Text } from "react-konva"
import { useLog10 } from "@/components/useHooks"
// import { Html } from "react-konva-utils"
// import { CloseOutlined } from "@ant-design/icons"
// import { createLabelStyle } from "@/features"
import Konva from "konva"
import SingleCircle from "./SingleCircle"

import type { IPoint, TKDragEvent } from "@/types"
import type { RootState } from "@/stores"

interface IProps {
    points: [IPoint, IPoint]
    movePoint: IPoint
    scale: number
    closeDistance: () => void
}

const initialPoints: [IPoint, IPoint] = [{ x: 0, y: 0 }, { x: 0, y: 0 }]

function SingleLine({ points = initialPoints, movePoint: { x: Mx, y: My }, closeDistance, scale = 1 }: IProps) {
    const [p1, setP1] = useState(points[0])
    const [p2, setP2] = useState(points[1])
    const { rulerScaling, unitLength } = useSelector((state: RootState) => state.tableData)

    const circle1Ref = useRef<Konva.Circle>(null)
    const circle2Ref = useRef<Konva.Circle>(null)
    const START = "start", END = "end"

    function getDistance(points: [IPoint, IPoint], rulerScale = rulerScaling, unitSize = unitLength) {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points
        const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        return Math.round(distance * rulerScale * unitSize)
    }

    function handleCircleMove(e: TKDragEvent, order: string) {
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

    const distance = p2 ? getDistance([p1, p2]) : 10

    return (
        <Group draggable>
            <Line
                stroke="#83ECCB"
                points={p2 ? [p1.x, p1.y, p2.x, p2.y] : [p1.x, p1.y, Mx, My]} strokeWidth={5 / scale}
            />
            <SingleCircle
                ref={circle1Ref} point={p1} radius={5 / scale} strokeWidth={2 / scale}
                onDragMove={(e: TKDragEvent) => handleCircleMove(e, START)}
            />
            {p2 && (
                <>
                    <SingleCircle
                        ref={circle2Ref} point={p2} radius={5 / scale} strokeWidth={2 / scale}
                        onDragMove={(e: TKDragEvent) => handleCircleMove(e, END)}
                    />
                    <Group scale={{ x: 1 / scale, y: 1 / scale }}>
                        <Label x={(p2.x > p1.x ? p2.x : p1.x) * scale + 10} y={(p2.x > p1.x ? p2.y : p1.y) * scale}>
                            <Tag fill="#414141" cornerRadius={4} />
                            <Text padding={10} fill="#83eccb" text={`${distance} mm`} />
                        </Label>
                        <Label
                            x={(p2.x > p1.x ? p2.x : p1.x) * scale + useLog10(distance)}
                            y={(p2.x > p1.x ? p2.y : p1.y) * scale}
                        >
                            <Tag fill="#414141" cornerRadius={4} />
                            <Text padding={10} fill="#fff" text="X" onClick={() => closeDistance()} />
                        </Label>
                    </Group>
                </>
            )}
        </Group>
    )
}

export default memo(SingleLine)
