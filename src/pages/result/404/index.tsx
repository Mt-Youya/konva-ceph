import styled from "styled-components"

const ScNotFound = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 30px;
    background-color: #fff;
`

const ScLink = styled(Link)`
    padding-bottom: 4px;
    position: relative;
    color: #0009;
    background: linear-gradient(to right, #92db72, #90ff00) no-repeat right bottom;
    background-size: 0 2px;
    transition: background-size .3s ease-in-out;

    &:hover {
        background-size: 100% 2px;
        background-position: left bottom;
    }
`

const ScLinkContainer = styled.div`
    border-radius: 8px;
    padding: 8px;

    &:active {
        background-color: #f1f1f1;
    }
`

const ScTextContainer = styled.div`
    display: flex;
    gap: 10px;

    span:first-child {
        border-right: 1px solid #292e33;
        padding-right: 10px;
    }
`

function NotFound() {
    return (
        <ScNotFound>
            <ScTextContainer>
                <span> 404  </span>
                <span> Not Found </span>
            </ScTextContainer>
            <ScLinkContainer>
                <ScLink replace to="/"> Back Home </ScLink>
            </ScLinkContainer>
        </ScNotFound>
    )
}

export default NotFound
