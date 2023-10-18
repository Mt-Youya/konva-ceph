import ImageActions from "./components/ImageActions"
import BezierLineActions from "./components/BezierLineActions"
import InteractiveActions from "./components/InteractiveActions"
import styled from "styled-components"

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
    
    @media screen  and (width: 1440px) {
        gap: 7%;
        padding: 0 70px;
    }
    @media screen  and (width: 900px) {
        gap: 4%;
        padding: 0 40px;
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
