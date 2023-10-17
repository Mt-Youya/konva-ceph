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
    margin: 0 100px;
    @media screen  and (max-width: 1440px) {
        gap: 6%;
        margin: 0 60px;
    }
    @media screen  and (max-width: 900px) {
        gap: 3%;
        margin: 0 30px;
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
