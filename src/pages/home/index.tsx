import { Provider } from "react-redux"
import styled from "styled-components"
import store from "@/stores"
import Header from "@/layout/Header"
import Aside from "@/layout/Aside"
import Stage from "./components/Stage"

const ScContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
`

const ScMain = styled.main`
    flex: 1;
    background-color: #1a1a1a;
    overflow: hidden;
`

function Home() {
    return (
        <Provider store={store}>
            <ScContainer>
                <ScMain>
                    <Header />
                    <Stage />
                </ScMain>
                <Aside />
            </ScContainer>
        </Provider>
    )
}

export default Home
