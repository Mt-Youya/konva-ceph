import { Stage, Layer, Image, Circle, Text } from "react-konva"
import constants from "../data/constMap.json"
import Konva from "konva"
import useImage from "use-image"

const ScContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;

    & > p {
        margin-bottom: 20px;
    }

    .desc {
        margin: 10px 0;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`

const ScStage = styled(Stage)`
    width: 440px;
    height: 440px;
    border-radius: 5px;
    overflow: hidden;
`

interface PointData {
    key: string
    name: string
    text: string
    pos: number[]
}

interface PointProps {
    [key: string]: PointData
}

const pointConstants: PointProps = { ...constants }

const AiPicture = () => {
    const [image] = useImage("http://yayan-dev.oss-cn-shanghai.aliyuncs.com/935a277347b3454fafcb46e69a3caf73.png")
    const [pointData, setPointData] = useState<PointData | null>(null)
    const [pointX, setPointX] = useState<number>(0)
    const [pointY, setPointY] = useState<number>(0)
    const { selectPointKey } = useSelector((state: RootState) => state.userInfo)

    const stageRef = useRef<Konva.Stage | null>(null)
    const imgScale = 440 / 600

    useEffect(() => {
        const stage = stageRef.current!
        const stageWrapper = stage?.attrs.container
        if (stage) {
            stage?.width(stageWrapper.clientWidth)
            stage?.height(stageWrapper.clientHeight)
        }
    }, [])

    useEffect(() => {
        if (selectPointKey) {
            const newPointData = pointConstants[selectPointKey]
            setPointData(newPointData)
            setPointX(newPointData.pos[0] * imgScale)
            setPointY(newPointData.pos[1] * imgScale)
        }
    }, [selectPointKey])

    return (
        <ScContainer>
            <p>Ai点介绍</p>
            <ScStage ref={stageRef}>
                <Layer>
                    <Image image={image} width={440} height={440} />
                    <Circle x={pointX} y={pointY} radius={3} fill="red" />
                    <Text x={pointX - 20} y={pointY - 20} text={pointData?.key} fill="#f00" fontSize={14} />
                </Layer>
            </ScStage>

            <div className="desc">
                <p>{pointData?.name}</p>
                <p>{pointData?.text} </p>
            </div>
        </ScContainer>
    )
}

export default AiPicture
