import ImageActions from "./components/ImageActions"
import BezierLineActions from "./components/BezierLineActions"
import InteractiveActions from "./components/InteractiveActions"
import styled from "styled-components"

const ScHeader = styled.header`
    height: 110px;
    color: #f9f9f9;
    user-select: none;
    display: flex;
    padding: 20px 6% 0 6%;
    gap: 60px;
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
