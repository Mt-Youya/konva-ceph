import { Stage, Layer, Group, Image } from "react-konva"
import { setReset } from "@/stores/header/reset"
import Konva from "konva"
import useImage from "use-image"
import MeasureDistance from "./MeasureDistance"
import MeasureAngle from "./MeasureAngle"
import BezierLine from "./BezierLine"
import randomUUID from "@/utils/randomUUID"

import type { TKWheelEvent } from "@/types"

const ScStage = styled(Stage)`
    width: 100%;
    height: calc(100% - 100px);
    overflow: hidden;
    @media (max-width: 1300px) {
        height: calc(100% - 180px);
    }
`

const StageContainer = () => {
    const { imgUrl } = useSelector((state: RootState) => state.measure)
    // const { pointList } = useSelector((state: RootState) => state.dataPoint)
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
    const [api, contextHolder] = notification.useNotification()
    // const [scale, setScale] = useState({ MinScale: 1, MaxScale: 4 })

    const ScaleRef = useRef({ MinScale: 1, MaxScale: 4 })
    const stageRef = useRef<Konva.Stage | null>(null)
    const layerRef = useRef<Konva.Layer | null>(null)
    const imageRef = useRef<Konva.Image | null>(null)
    const imageGroupRef = useRef<Konva.Group | null>(null)

    const dispatch = useDispatch()

    const ScaleBy = 1.03
    // let MaxScale = 4
    // let MinScale = 1

    function handleWheel(e: TKWheelEvent) {
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
        const { MaxScale, MinScale } = ScaleRef.current
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

    const notifyKey = randomUUID()

    function openNotification() {
        function close() {
            api.destroy(notifyKey)
        }

        function confirm() {
            setAdaption()
            api.destroy(notifyKey)
        }

        api.open({
            message: "图片过大提示",
            description: "检测到图片大小超出容器大小! 是否自适应画布容器大小?",
            duration: null,
            icon: <WarningOutlined style={{ color: "red" }} />,
            btn: <Space>
                <Button type="link" size="small" onClick={close}>不设置自适应 </Button>
                <Button type="primary" size="small" onClick={confirm}>
                    设置自适应
                </Button>
            </Space>,
            key: notifyKey,
            style: { zIndex: 200 },
        })
    }

    function setAdaption() {
        const imgWidth = image?.naturalWidth!
        const imgHeight = image?.naturalHeight!

        const scaleW = imgWidth / width
        const scaleH = imgHeight / height

        const newScale = scaleW > scaleH ? 1 / scaleW : 1 / scaleH
        const scalex = width * (1 - newScale) / 2
        const scaley = height * (1 - newScale) / 2

        ScaleRef.current = {
            MinScale: newScale,
            MaxScale: newScale * 4,
        }

        setStageX(scalex)
        setStageY(scaley)
        setStageScale(newScale)
    }

    function isImageOverContent() {
        const imgWidth = image?.naturalWidth!
        const imgHeight = image?.naturalHeight!
        const imgRatio = imgWidth / imgHeight
        if (imgHeight > height) {
            return {
                over: true,
                ratio: imgRatio,
                size: "height",
            }
        }
        if (imgWidth >= width) {
            return {
                over: true,
                ratio: imgRatio,
                size: "width",
            }
        }
        return {
            over: false,
            ratio: imgRatio,
        }
    }

    useEffect(() => {
        const stage = stageRef!.current!
        const stageWrapper = stage?.attrs.container
        setStageSize()

        function setStageSize() {
            stage?.width(stageWrapper.clientWidth)
            stage?.height(stageWrapper.clientHeight)
            setWidth(stageWrapper.clientWidth)
            setHeight(stageWrapper.clientHeight)
        }

        window.addEventListener("resize", setStageSize)
        return () => {
            imageRef.current?.destroy()
            window.removeEventListener("resize", setStageSize)
        }
    }, [])

    function reset() {
        setStageX(0)
        setStageY(0)
        setStageScale(1)
    }

    useEffect(() => {
        const img = imageRef.current
        if (img) {
            const { over } = isImageOverContent()
            over && openNotification()
        }
        return () => {
            img?.destroy()
        }
    }, [imageRef])

    useEffect(() => {
        if (isReset) {
            reset()
            dispatch(setReset(false))
            const { over } = isImageOverContent()
            over && setAdaption()
        }
    }, [isReset])

    useEffect(() => {
        handleDragMove()
    }, [imgUrl])

    function handleDragMove() {
        setTemp(prevState => prevState + 1)
    }

    const measureProps = {
        setLayerDraggable,
        layerWidth: width,
        layerHeight: height,
    }

    return (
        <>
            {contextHolder}
            <ScStage ref={stageRef} scaleX={stageScale} scaleY={stageScale} x={stageX} y={stageY} onWheel={handleWheel}>
                <Layer draggable={layerDraggable} ref={layerRef} onDragMove={handleDragMove}>
                    <Group
                        x={width / 2} y={height / 2} scaleX={scaleX} rotation={rotate} ref={imageGroupRef}
                        offset={{ x: image?.width! / 2, y: image?.height! / 2 }}
                    >
                        <Image
                            ref={imageRef} image={image}
                            contrast={contrast} brightness={brightness} opacity={lateral ? 1 : 0}
                            filters={[Konva.Filters.Brighten, Konva.Filters.Contrast]}
                        />
                        <BezierLine />
                    </Group>
                    <Group>
                        <MeasureDistance {...measureProps} />
                        <MeasureAngle {...measureProps} />
                    </Group>
                </Layer>
            </ScStage>
        </>
    )
}

export default StageContainer
