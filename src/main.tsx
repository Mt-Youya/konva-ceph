import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "@/styles"
import "./index.css"
import "./mock/index.ts"
// import reportWebVitals from "./reportWebVitals"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)

// reportWebVitals(console.log)
