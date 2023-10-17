import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Group, Label, Rect, Tag, Text } from "react-konva"
import { changeDistance } from "@/stores/home/useMeasure"
import SingleLine from "@/components/SingleLine"

import type { RootState } from "@/stores"
import type { IPoint } from "@/types"
import Konva from "konva"

const MeasureDistance = ({ layerWidth = 1200, layerHeight = 1100 }) => {
    const [clickCount, setClickCount] = useState(0)
    const [move, setMove] = useState({ x: 0, y: 0 })
    const [pointsGroup, setPointsGroup] = useState<IPoint[][]>([])
    const pointsGroupRef = useRef<Konva.Group>(null)
    const { distance } = useSelector((state: RootState) => state.measure)

    const dispatch = useDispatch()

    function onMeasureClick() {
        const layer = pointsGroupRef.current?.getLayer()!
        const { x, y } = layer?.getRelativePointerPosition()!
        const point = { x, y }
        setClickCount(prev => {
            const count = ++prev
            if (count % 2 === 1) {
                setPointsGroup([...pointsGroup, [point]])
            } else if (count % 2 === 0) {
                const lastPoints = pointsGroup.at(-1)
                const points = [...lastPoints!, point]
                const renderGroup = pointsGroup.slice(0, pointsGroup.length - 1)
                setPointsGroup([...renderGroup, points])
            }
            return count
        })
    }

    function closeDistance(idx: number) {
        const filteredPoints = pointsGroup.filter((_, index) => idx !== index)
        setPointsGroup(filteredPoints)
    }

    function onMouseMove() {
        const layer = pointsGroupRef.current?.getLayer()!
        const { x, y } = layer?.getRelativePointerPosition()!
        const moveTarget = { x, y }
        setMove(moveTarget)
    }

    useEffect(() => {
        if (clickCount !== 0 && clickCount % 2 === 0) {
            dispatch(changeDistance(!distance))
        }
    }, [clickCount])

    return (
        <>
            <Group ref={pointsGroupRef}>
                {pointsGroup.map(([p1, p2], idx) => (
                    <SingleLine
                        points={[p1, p2]}
                        movePoint={move}
                        closeDistance={() => closeDistance(idx)}
                        key={p1.x + p1.y + (p2 ? p2.x * p2.y : Math.random()) + idx}
                    />
                ))}
            </Group>
            <Group>
                {distance && (
                    <>
                        {clickCount % 2 === 0 && (
                            <Label x={move.x + 5} y={move.y + 5}>
                                <Tag fill="#32393F" cornerRadius={3} />
                                <Text text="单击确定测距起点" fontSize={16} padding={5} fill="#fff" />
                            </Label>
                        )}
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

export default MeasureDistance
