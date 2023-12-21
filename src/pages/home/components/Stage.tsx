import { useDispatch, useSelector } from "react-redux"
import { Stage, Layer, Group, Image } from "react-konva"
import { setCacheStage } from "@/stores/cache"
import { setReset } from "@/stores/header/reset"
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
    @media (max-width: 1980px) {
        height: calc(100% - 180px);
    }
`

const StageContainer = () => {
    const { imgUrl } = useSelector((state: RootState) => state.measure)
    const { lateral } = useSelector((state: RootState) => state.showPoint)
    const { rotate, scaleX, contrast, brightness } = useSelector((state: RootState) => state.transform)
    const { isReset } = useSelector((state: RootState) => state.reset)

    const [layerDraggable, setLayerDraggable] = useState(true)
    const [width, setWidth] = useState(1000)
    const [height, setHeight] = useState(1000)
    const [stageScale, setStageScale] = useState(1)
    const [stageX, setStageX] = useState(0)
    const [stageY, setStageY] = useState(0)
    const [_, setTemp] = useState(0)
    const [image] = useImage(imgUrl, "anonymous")

    const stageRef = useRef<Konva.Stage | null>(null)
    const layerRef = useRef<Konva.Layer | null>(null)
    const imageRef = useRef<Konva.Image | null>(null)

    const dispatch = useDispatch()

    const ScaleBy = 1.03
    const MaxScale = 4
    const MinScale = 1

    function handleWheel(e: KonvaEventObject<WheelEvent>) {
        if (e.evt.ctrlKey) return
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
            const imgWidth = image.width
            const imgHeight = image.height
            const scaleW = imgWidth / width
            const scaleH = imgHeight / height

            if (scaleW > 1 || scaleH > 1) {
                const newScale = scaleW > scaleH ? 1 / scaleW : 1 / scaleH
                setStageX(width * (1 - newScale) / 2)
                setStageY(height * (1 - newScale) / 2)
                setStageScale(newScale)
                setCacheStage({ x: width * (1 - newScale) / 2, y: height * (1 - newScale) / 2, scale: newScale })
            } else {
                setStageScale(1)
            }
        }
    }, [image])

    function reset() {
        setStageScale(1)
        setStageX(0)
        setStageY(0)
    }

    useEffect(() => {
        if (isReset) {
            reset()
            dispatch(setReset(false))
        }
    }, [isReset])

    function handleDragMove() {
        setTemp(prevState => prevState + 1)
    }

    const measureProps = {
        setLayerDraggable,
        layerWidth: width,
        layerHeight: height,
    }

    return (
        <ScStage ref={stageRef} scaleX={stageScale} scaleY={stageScale} x={stageX} y={stageY} onWheel={handleWheel}>
            <Layer draggable={layerDraggable} ref={layerRef} onDragMove={handleDragMove}>
                <Group
                    x={width / 2} y={height / 2} scaleX={scaleX} rotation={rotate}
                    offset={{ x: image?.width! / 2, y: image?.height! / 2 }}
                >
                    {lateral && (
                        <Image
                            ref={imageRef} image={image} contrast={contrast} brightness={brightness}
                            filters={[Konva.Filters.Brighten, Konva.Filters.Contrast]}
                        />
                    )}
                    <BezierLine />
                </Group>
                <Group>
                    <MeasureDistance {...measureProps} />
                    <MeasureAngle {...measureProps} />
                </Group>
            </Layer>
        </ScStage>
    )
}

export default StageContainer
