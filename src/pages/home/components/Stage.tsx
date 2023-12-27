import { useDispatch, useSelector } from "react-redux"
import { Stage, Layer, Group, Image } from "react-konva"
import { Button, notification, Space } from "antd"
import { WarningOutlined } from "@ant-design/icons"
import { setReset } from "@/stores/header/reset"
import { changePointList } from "@/stores/home/useDataPoints"
import styled from "styled-components"
import Konva from "konva"
import useImage from "use-image"
import MeasureDistance from "./MeasureDistance"
import MeasureAngle from "./MeasureAngle"
import BezierLine from "./BezierLine"
import randomUUID from "@/utils/randomUUID"

import type { KonvaEventObject } from "konva/lib/Node"
import type { RootState } from "@/stores"

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
    const { pointList } = useSelector((state: RootState) => state.dataPoint)
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

    const stageRef = useRef<Konva.Stage | null>(null)
    const layerRef = useRef<Konva.Layer | null>(null)
    const imageRef = useRef<Konva.Image | null>(null)
    const imageGroupRef = useRef<Konva.Group | null>(null)

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

    const notifyKey = randomUUID()

    function openNotification() {
        function close() {
            imageRef.current?.cache()
            api.destroy(notifyKey)
        }

        api.open({
            message: "图片过大提示",
            description: "检测到图片大小超出容器大小! 是否自适应画布容器大小?",
            duration: null,
            icon: <WarningOutlined style={{ color: "red" }} />,
            btn: <Space>
                <Button type="link" size="small" onClick={close}>不设置自适应 </Button>
                <Button type="primary" size="small" onClick={setAdaption}>
                    设置自适应
                </Button>
            </Space>,
            key: notifyKey,
            style: { zIndex: 200 },
        })
    }

    function setAdaption() {
        const img = imageRef.current!
        const imgWidth = img.width()!
        const imgHeight = img.height()!
        const imgRatio = imgWidth / imgHeight

        if (imgWidth >= width) {
            img.width(width)
            img.height(img.width() / imgRatio)
            const ratio = imgWidth / width
            const list = pointList.map(item => {
                const { gps: [x, y] } = item
                return {
                    ...item,
                    gps: [x / ratio, y / ratio],
                }
            })
            dispatch(changePointList(list))
        } else if (imgHeight > height) {
            img.height(height)
            img.width(img.height() * imgRatio)
            const ratio = imgHeight / height
            const list = pointList.map(item => {
                const { gps: [x, y] } = item
                return {
                    ...item,
                    gps: [x / ratio, y / ratio],
                }
            })
            dispatch(changePointList(list))
        }

        const newImgWidth = img.width()
        const newImgHeight = img.height()
        const resWidth = imgWidth - newImgWidth
        const resHeight = imgHeight - newImgHeight
        imageGroupRef.current?.x(width / 2 + resWidth / 2)
        imageGroupRef.current?.y(height / 2 + resHeight / 2)

        imageRef.current?.cache()
        api.destroy(notifyKey)
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
            const img = imageRef.current!
            const imgWidth = img.width()
            const imgHeight = img.height()

            const scaleW = imgWidth / width
            const scaleH = imgHeight / height

            const overWidth = scaleW > 1 ? scaleH !== 1 : false
            const overHeight = scaleH > 1 ? scaleW !== 1 : false
            if (overWidth || overHeight) {
                if (pointList.length) {
                    openNotification()
                }
            } else {
                imageRef.current?.cache()
            }
        }
    }, [image, pointList])

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
