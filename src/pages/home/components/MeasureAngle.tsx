import { useDispatch, useSelector } from "react-redux"
import { Group, Label, Rect, Tag, Text } from "react-konva"
import { changeAngle } from "@/stores/home/useMeasure"
import Konva from "konva"
import SingleAngle from "@/components/SingleAngle"

import type { IPoint } from "@/types/canvasCtx"
import type { RootState } from "@/stores"
import { useState } from "react"

interface IProps {
    layerWidth?: number
    layerHeight?: number
    setLayerDraggable: (draggable: boolean) => void
}

const MeasureAngle = ({ layerWidth = 1200, layerHeight = 1100, setLayerDraggable }: IProps) => {
    const { angle } = useSelector((state: RootState) => state.measure)
    const { isReset } = useSelector((state: RootState) => state.reset)
    const [clickCount, setClickCount] = useState(0)
    const [move, setMove] = useState({ x: 200, y: 200 })
    const [angleGroup, setAngleGroup] = useState<IPoint[][]>([])
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    const angleGroupRef = useRef<Konva.Group>(null)
    const dispatch = useDispatch()

    function onMeasureClick() {
        const layer = angleGroupRef.current?.getLayer()!
        const point = layer?.getRelativePointerPosition()!
        setClickCount((prev: number) => {
            const count = prev + 1
            if (count % 3 === 1) {
                setAngleGroup([...angleGroup, [point]])
            } else if (count % 3 === 2) {
                const lastPoints = angleGroup.at(-1)
                const points = [...lastPoints!, point]
                const renderGroup = angleGroup.slice(0, angleGroup.length - 1)
                setAngleGroup([...renderGroup, points])
            } else if (count % 3 === 0) {
                const lastPoints = angleGroup.at(-1)
                const points = [...lastPoints!, point]
                const renderGroup = angleGroup.slice(0, angleGroup.length - 1)
                setAngleGroup([...renderGroup, points])
                setMove({ x: -100000, y: -10000000 })
            }
            return count
        })
    }

    function closeAngle(idx: number) {
        const filteredAngles = angleGroup.filter((_, index) => idx !== index)
        setAngleGroup(() => filteredAngles)
    }

    function onMouseMove() {
        const stage = angleGroupRef.current?.getStage()!
        const offset = { x: stage.x() / scale, y: stage.y() / scale }
        setOffset(offset)
        const layer = angleGroupRef.current?.getLayer()!
        const moveTarget = layer?.getRelativePointerPosition()!
        setMove(moveTarget)
    }

    useEffect(() => {
        if (clickCount && clickCount % 3 === 0) {
            dispatch(changeAngle(false))
            return setLayerDraggable(true)
        }
        setLayerDraggable(false)
    }, [clickCount])

    useEffect(() => {
        if (!angle) {
            setClickCount(prev => {
                if (prev % 3 !== 0) {
                    angleGroup.pop()
                    return 0
                }
                return prev
            })
            return setLayerDraggable(true)
        }
        setLayerDraggable(false)
    }, [angle])

    useEffect(() => {
        if (isReset) {
            setAngleGroup([])
        }
    }, [isReset])

    const scale = angleGroupRef.current?.getStage()?.scaleX() ?? 1

    const textProps = {
        fontSize: 14 / scale,
        padding: 5 / scale,
        fill: "#fff",
    }

    const { random } = Math

    return (
        <>
            <Group ref={angleGroupRef}>
                {angleGroup.map(([p1, p2, p3], idx) => (
                    <SingleAngle
                        key={p1.x + p1.y + (p2 ? p2.x * p2.y : random()) + idx + (p3 ? p3?.x / (p3?.y || 1) : random())}
                        points={[p1, p2, p3]} movePoint={move} scale={scale}
                        closeAngle={() => closeAngle(idx)}
                    />
                ))}
            </Group>
            <Group>
                {angle && (
                    <>
                        <Label {...move} opacity={move.x === 0 && move.y === 0 ? 0 : 1}>
                            {clickCount % 3 !== 1 && <Tag fill="#32393F" cornerRadius={3} />}
                            {clickCount % 3 === 0 && <Text text="单击确定角度起点" {...textProps} />}
                            {clickCount % 3 === 2 && <Text text="单击确定夹角位置" {...textProps} />}
                        </Label>
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

export default memo(MeasureAngle)
