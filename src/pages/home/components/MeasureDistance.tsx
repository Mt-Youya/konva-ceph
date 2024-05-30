import { useDispatch, useSelector } from "react-redux"
import { Group, Label, Rect, Tag, Text } from "react-konva"
import { changeDistance } from "@/stores/home/useMeasure"
import SingleLine from "@/components/SingleLine"
import Konva from "konva"

import type { RootState } from "@/stores"
import type { IPoint } from "@/types"

interface IProps {
    layerWidth?: number
    layerHeight?: number
    setLayerDraggable: (draggable: boolean) => void
}

const MeasureDistance = ({ layerWidth = 1200, layerHeight = 1100, setLayerDraggable }: IProps) => {
    const [clickCount, setClickCount] = useState(0)
    const [move, setMove] = useState({ x: 0, y: 0 })
    const [pointsGroup, setPointsGroup] = useState<IPoint[][]>([])
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const { distance } = useSelector((state: RootState) => state.measure)
    const { isReset } = useSelector((state: RootState) => state.reset)

    const pointsGroupRef = useRef<Konva.Group>(null)
    const dispatch = useDispatch()

    function onMeasureClick() {
        const layer = pointsGroupRef.current?.getLayer()!
        const point = layer?.getRelativePointerPosition()!
        setClickCount(prev => {
            const count = ++prev
            if (count % 2 === 1) {
                setPointsGroup([...pointsGroup, [point]])
            } else if (count % 2 === 0) {
                const lastPoints = pointsGroup.at(-1)
                const points = [...lastPoints!, point]
                const renderGroup = pointsGroup.slice(0, pointsGroup.length - 1)
                setPointsGroup([...renderGroup, points])
                setMove({ x: -100000, y: -10000000 })
            }
            return count
        })
    }

    function closeDistance(idx: number) {
        const filteredPoints = pointsGroup.filter((_, index) => idx !== index)
        setPointsGroup(filteredPoints)
    }

    function onMouseMove() {
        const stage = pointsGroupRef.current?.getStage()!
        const { x, y } = { x: Math.floor(stage.x() / scale), y: Math.floor(stage.y() / scale) }
        if (x !== offset.x || y !== offset.y) {
            setOffset({ x, y })
        }
        const layer = pointsGroupRef.current?.getLayer()!
        const moveTarget = layer?.getRelativePointerPosition()!
        setMove(moveTarget)
    }

    useEffect(() => {
        if (clickCount !== 0 && clickCount % 2 === 0) {
            dispatch(changeDistance(!distance))
            return setLayerDraggable(true)
        }
        setLayerDraggable(false)
    }, [clickCount])

    useEffect(() => {
        if (distance) {
            return setLayerDraggable(false)
        }
        if (clickCount % 2 !== 0) {
            pointsGroup.pop()
            setPointsGroup([...pointsGroup])
        }
        return setLayerDraggable(true)
    }, [distance])

    useEffect(() => {
        if (isReset) {
            setPointsGroup([])
        }
    }, [isReset])

    const scale = pointsGroupRef.current?.getStage()?.scaleX() ?? 1

    return (
        <>
            <Group ref={pointsGroupRef}>
                {pointsGroup.map(([p1, p2], idx) => (
                    <SingleLine
                        key={p1.x + p1.y + (p2 ? p2.x * p2.y : Math.random()) + idx}
                        points={[p1, p2]} movePoint={move} scale={scale}
                        closeDistance={() => closeDistance(idx)}
                    />
                ))}
            </Group>
            <Group>
                {distance && (
                    <>
                        {(clickCount === 0 || clickCount % 2 === 0) && (
                            <Label
                                x={move.x + (5 / scale)} y={move.y + (5 / scale)}
                                opacity={move.x === 0 && move.y === 0 ? 0 : 1}
                            >
                                <Tag fill="#32393F" cornerRadius={3 / scale} />
                                <Text fill="#fff" text="单击确定测距起点" fontSize={14 / scale} padding={5 / scale} />
                            </Label>
                        )}
                        <Rect
                            width={layerWidth / scale} height={layerHeight / scale} offset={offset}
                            onMouseMove={onMouseMove} onClick={onMeasureClick}
                        />
                    </>
                )}
            </Group>
        </>
    )
}

export default memo(MeasureDistance)
