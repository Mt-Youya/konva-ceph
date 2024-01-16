import { Group, Line } from "react-konva"
import { Html } from "react-konva-utils"
import { createLabelStyle } from "@/features"
import SingleCircle from "./SingleCircle"

import type { IPoint, TKDragEvent } from "@/types"
import type { TKCircle } from "@/types/KonvaElement"

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

    const circle1Ref = useRef<TKCircle>(null)
    const circle2Ref = useRef<TKCircle>(null)
    const START = "start", END = "end"

    function getDistance(points: [IPoint, IPoint], unit = rulerScaling || 1, unitSize = unitLength) {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points
        const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        return Math.round(distance * unit * unitSize)
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

    function useCircleStyle() {
        const [circleLabelStyle, setCircleLabelStyle] = useState<ReturnType<typeof createLabelStyle> | null>(null)

        useEffect(() => {
            if (circle2Ref.current) {
                const { x: x1, y: y1 } = circle1Ref.current?.getAbsolutePosition()!
                const { x: x2, y: y2 } = circle2Ref.current?.getAbsolutePosition()!
                const labelStyle = x2 > x1 ? createLabelStyle(x2, y2) : createLabelStyle(x1, y1)
                setCircleLabelStyle(labelStyle)
            }
        }, [points, p1, p2])

        return circleLabelStyle
    }

    const style = useCircleStyle()!

    return (
        <Group draggable onDragMove={() => setP2(prev => ({ ...prev }))}>
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
                            <CloseOutlined onClick={() => closeDistance()} style={{ cursor: "pointer" }} />
                        </span>
                    </Html>
                </>
            )}
        </Group>
    )
}

export default memo(SingleLine)
