import { createRoot } from "react-dom/client"
import React from "react"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import "@/styles"
import "@/utils/hello"
import "./mock"
import "./index.css"

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

reportWebVitals(console.log)
