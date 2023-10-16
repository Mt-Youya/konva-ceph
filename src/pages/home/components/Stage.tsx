import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Stage, Layer, Group, Image } from "react-konva"
import styled from "styled-components"
import Konva from "konva"
import useImage from "use-image"
import MeasureDistance from "./MeasureDistance"
import MeasureAngle from "./MeasureAngle"
import BezierLine from "./BezierLine"

import type { KonvaEventObject } from "konva/lib/Node"
import type { RootState } from "@/stores"

const ScStage = styled(Stage)`
    width: 100%;
    height: calc(100% - 100px);
    overflow: hidden;
`

const StageContainer = () => {
    const { imgUrl } = useSelector((state: RootState) => state.measure)
    const { lateral } = useSelector((state: RootState) => state.showPoint)
    const { rotate, scaleX, contrast, brightness } = useSelector((state: RootState) => state.transform)

    const [width, setWidth] = useState(1000)
    const [height, setHeight] = useState(1000)
    const [image] = useImage(imgUrl)
    const [_, setTemp] = useState(1)

    const stageRef = useRef<Konva.Stage | null>(null)
    const layerRef = useRef<Konva.Layer | null>(null)

    const scaleBy = 1.01

    function onWheel(e: KonvaEventObject<WheelEvent>) {
        if (!e.evt.ctrlKey) return
        e.evt.preventDefault()

        handleZoom(e.evt.deltaY, layerRef.current!)
    }

    function handleZoom(deltaY: number, target: Konva.Layer) {
        const oldScale = target.scaleX()
        const pointer = target?.getRelativePointerPosition()!

        const direction = deltaY > 0 ? -1 : 1

        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

        const mousePointTo = {
            x: (pointer.x - target.x()) / oldScale,
            y: (pointer.y - target.y()) / oldScale,
        }
        const transPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        }

        target.scale({ x: newScale, y: newScale })
        target.position(transPos)
        setTemp(prevState => prevState + 1)
    }

    useEffect(() => {
        const stage = stageRef.current!
        const stageWrapper = stage?.attrs.container
        setStageSize()

        function setStageSize() {
            stage?.width(stageWrapper.clientWidth)
            stage?.height(stageWrapper.clientHeight)
            setWidth(stageWrapper.clientWidth)
            setHeight(stageWrapper.clientHeight)
        }

        window.addEventListener("resize", setStageSize)
        return () => window.removeEventListener("resize", setStageSize)
    }, [])

    return (
        <>
            <ScStage ref={stageRef} onWheel={onWheel}>
                <Layer draggable
                       ref={layerRef} scaleX={scaleX} rotation={rotate}
                       onDragMove={() => setTemp(prevState => prevState + 1)}
                >
                    <Group offset={{ x: (image?.width! - width) / 2, y: (image?.height! - height) / 2 }}>
                        {lateral && (
                            <Image
                                image={image}
                                filters={[Konva.Filters.Brighten, Konva.Filters.Contrast]}
                                contrast={contrast}
                                brightness={brightness}
                            />
                        )}
                        <BezierLine/>
                    </Group>
                    <Group>
                        <MeasureDistance layerWidth={width} layerHeight={height}/>
                        <MeasureAngle layerWidth={width} layerHeight={height}/>
                    </Group>
                </Layer>
            </ScStage>
        </>
    )
}

export default StageContainer
