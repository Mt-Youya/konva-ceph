import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home"
import NotFound from "@/pages/result/404"
import "./App.css"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
