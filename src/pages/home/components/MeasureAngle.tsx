import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Group, Label, Rect, Tag, Text } from "react-konva"
import { changeAngle } from "@/stores/home/useMeasure"
import Konva from "konva"
import SingleAngle from "@/components/SingleAngle"

import type { IPoint } from "@/types/canvasCtx"
import type { RootState } from "@/stores"

const MeasureAngle = ({ layerWidth = 1200, layerHeight = 1100 }) => {
    const { angle } = useSelector((state: RootState) => state.measure)
    const [clickCount, setClickCount] = useState(0)
    const [move, setMove] = useState({ x: 200, y: 200 })
    const [angleGroup, setAngleGroup] = useState<IPoint[][]>([])

    const angleGroupRef = useRef<Konva.Group>(null)
    const dispatch = useDispatch()

    function onMeasureClick() {
        const layer = angleGroupRef.current?.getLayer()!
        const { x, y } = layer?.getRelativePointerPosition()!
        const point = { x, y }
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
            }
            return count
        })
    }

    function closeAngle(idx: number) {
        const filteredAngles = angleGroup.filter((_, index) => idx !== index)
        setAngleGroup(() => filteredAngles)
    }

    function onMouseMove() {
        const layer = angleGroupRef.current?.getLayer()!
        const { x, y } = layer?.getRelativePointerPosition()!
        const moveTarget = { x, y }
        setMove(moveTarget)
    }

    useEffect(() => {
        if (clickCount && clickCount % 3 === 0) {
            dispatch(changeAngle(false))
        }
    }, [clickCount])


    return (
        <>
            <Group ref={angleGroupRef}>
                {angleGroup.map(([p1, p2, p3], idx) => (
                    <SingleAngle
                        points={[p1, p2, p3]}
                        movePoint={move}
                        closeAngle={() => closeAngle(idx)}
                        key={p1.x + p1.y + (p2 ? p2.x * p2.y : Math.random()) + idx + (p3 ? p3?.x / (p3?.y || 1) : Math.random())}
                    />
                ))}
            </Group>
            <Group>
                {angle && (
                    <>
                        <Label {...move}>
                            {clickCount % 3 !== 1 && <Tag fill="#32393F" cornerRadius={3}/>}
                            {clickCount % 3 === 0 && (
                                <Text text="单击确定角度起点" fontSize={16} padding={5} fill="#fff"/>
                            )}
                            {clickCount % 3 === 2 && (
                                <Text text="单击确定夹角位置" fontSize={16} padding={5} fill="#fff"/>
                            )}
                        </Label>
                        <Rect
                            width={layerWidth} height={layerHeight}
                            onMouseMove={onMouseMove} onClick={onMeasureClick}
                        />
                    </>
                )}
            </Group>
        </>
    )
}

export default MeasureAngle
