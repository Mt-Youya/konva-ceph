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
    const [stageScale, setStageScale] = useState(1)
    const [stageX, setStageX] = useState(0)
    const [stageY, setStageY] = useState(0)
    const [_, setTemp] = useState(0)
    const [image] = useImage(imgUrl)

    const stageRef = useRef<Konva.Stage | null>(null)
    const layerRef = useRef<Konva.Layer | null>(null)
    const imageRef = useRef<Konva.Image | null>(null)

    const ScaleBy = 1.03
    const MaxScale = 3
    const MinScale = .5

    function handleWheel(e: KonvaEventObject<WheelEvent>) {
        if (!e.evt.ctrlKey) return
        e.evt.preventDefault()
        const direction = e.evt.deltaY > 0 ? -1 : 1
        const stage = e.target.getStage()!
        const oldScale = stage.scaleX()
        const pointer = stage.getPointerPosition()!

        const mousePointTo = {
            x: pointer.x / oldScale - stage.x() / oldScale,
            y: pointer.y / oldScale - stage.y() / oldScale,
        }
        const newScale =
                  direction > 0
                      ? oldScale > MaxScale
                          ? oldScale
                          : oldScale * ScaleBy
                      : oldScale < MinScale
                          ? oldScale
                          : oldScale / ScaleBy
        setStageScale(newScale)

        const newStageX = -(mousePointTo.x - pointer.x / newScale) * newScale
        const newStageY = -(mousePointTo.y - pointer.y / newScale) * newScale
        setStageX(newStageX)
        setStageY(newStageY)
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

    useEffect(() => {
        if (image) {
            imageRef.current?.cache()
        }
    }, [image])

    function handleDragMove() {
        setTemp(prevState => prevState + 1)
    }

    return (
        <>
            <ScStage ref={stageRef} scaleX={stageScale} scaleY={stageScale} x={stageX} y={stageY} onWheel={handleWheel}>
                <Layer draggable ref={layerRef} onDragMove={handleDragMove}>
                    <Group
                        x={width / 2} y={height / 2} scaleX={scaleX} rotation={rotate}
                        offset={{ x: image?.width! / 2, y: image?.height! / 2 }}
                    >
                        {lateral && (
                            <Image
                                ref={imageRef}
                                image={image}
                                filters={[Konva.Filters.Brighten, Konva.Filters.Contrast]}
                                contrast={contrast}
                                brightness={brightness}
                            />
                        )}
                        <BezierLine />
                    </Group>
                    <Group>
                        <MeasureDistance layerWidth={width} layerHeight={height} />
                        <MeasureAngle layerWidth={width} layerHeight={height} />
                    </Group>
                </Layer>
            </ScStage>
        </>
    )
}

export default StageContainer
