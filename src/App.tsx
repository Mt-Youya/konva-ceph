import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home"
// import Native from "@/pages/native"
import NotFound from "@/pages/result/404"
import "./App.css"

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/home" element={<Home/>}/>
                {/*<Route path="/native" element={<Native/>}/>*/}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </HashRouter>
    )
}

export default App
