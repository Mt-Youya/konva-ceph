import ImageActions from "./components/ImageActions"
import BezierLineActions from "./components/BezierLineActions"
import InteractiveActions from "./components/InteractiveActions"

const ScHeader = styled.header`
    height: 100px;
    color: #f9f9f9;
    user-select: none;
    display: grid;
    grid-template-columns: .6fr .8fr 1fr;
    gap: 10%;
    padding: 0 100px;
    background-color: #1f2327;
    backdrop-filter: saturate(180%) blur(20px);
    box-shadow: 0 0 4px #292e33;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;

    @media screen  and (max-width: 1980px) {
        gap: 20px;
        padding: 15px 3%;
    }
    @media screen  and (max-width: 1700px) {
        gap: 10px;
        padding: 15px 2%;
    }
    @media screen  and (max-width: 1440px) {
        gap: 5px;
        padding: 15px 1%;
    }
    @media screen  and (max-width: 1080px) {
        gap: 0;
        padding: 15px .5%;
    }
`

function Header() {
    return (
        <ScHeader>
            <ImageActions />
            <BezierLineActions />
            <InteractiveActions />
        </ScHeader>
    )
}

export default Header
