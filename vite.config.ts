import { defineConfig } from "vite"
import { resolve, extname } from "path"
import Compression from "vite-plugin-compression"
import react from "@vitejs/plugin-react"
import importToCDN from "vite-plugin-cdn-import"

const modelExts = [".gltf", ".glb", ".obj", "mtl", ".fbx", "stl", "vtp", "vtk", "ply", "xyz"]
const cssExts = [".css", ".less", ".scss", "sass", ".stylus"]

const cdnModules = [
    {
        name: "react",
        var: "React",
        path: `https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js`,
    },
    {
        name: "react-redux",
        var: "react-redux",
        path: "https://cdnjs.cloudflare.com/ajax/libs/react-redux/8.1.3/react-redux.min.js",
    },
    {
        name: "react-dom",
        var: "react-dom",
        path: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
    },
    {
        name: "react-router",
        var: "react-router",
        path: "https://cdnjs.cloudflare.com/ajax/libs/react-router/6.17.0/react-router.production.min.js",
    },
    {
        name: "react-router-dom",
        var: "react-router-dom",
        path: "https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/6.17.0/react-router-dom.production.min.js",
    },
    {
        name: "konva",
        var: "Konva",
        path: "https://cdnjs.cloudflare.com/ajax/libs/konva/9.0.0/konva.min.js",
    },
    {
        name: "antd",
        var: "antd",
        path: "https://cdnjs.cloudflare.com/ajax/libs/antd/5.10.2/antd.min.js",
    },
    {
        name: "axios",
        var: "axios",
        path: "https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js",
    },
    {
        name: "styled-components",
        var: "styled",
        path: "https://cdnjs.cloudflare.com/ajax/libs/styled-components/6.1.0/styled-components.min.js",
    },
    {
        name: "dayjs",
        var: "dayjs",
        path: "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js",
    },
]

const cdnPath = {
    react: "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
    "react-dom": "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
    "react-redux": "https://cdnjs.cloudflare.com/ajax/libs/react-redux/8.1.0/react-redux.min.js",
    "react-router": "https://cdnjs.cloudflare.com/ajax/libs/react-router/6.17.0/react-router.production.min.js",
    "react-router-dom": "https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/6.17.0/react-router-dom.production.min.js",
    dayjs: "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js",
    konva: "https://cdnjs.cloudflare.com/ajax/libs/konva/9.0.0/konva.min.js",
    antd: "https://unpkg.com/antd@5.10.2/dist/antd.min.js",
    axios: "https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js",
    "styled-components": "https://cdnjs.cloudflare.com/ajax/libs/styled-components/6.1.0/styled-components.min.js",
}
export default defineConfig({
        plugins: [
            react(),
            Compression({ threshold: 1024 * 1024 * 2 }), // gzip : over 2Mb compression
            // importToCDN.default({ modules: cdnModules }),
        ],
        server: {
            open: true,
            port: 8080,
        },
        resolve: {
            alias: [
                {
                    find: "@",
                    replacement: resolve(__dirname, "src"),
                },
            ],
        },
        build: {
            outDir: "dist",
            assetsDir: "assets",
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                // external: Object.keys(cdnPath),
                output: {
                    // paths: cdnPath,
                    chunkFileNames: "assets/js/[name]-[hash].js",
                    entryFileNames: "assets/js/[name].[hash].js",
                    compact: true,
                    manualChunks: {
                        react: ["react", "react-router", "react-router-dom"],
                        redux: ["react-redux", "@reduxjs/toolkit"],
                        konva: ["konva", "react-konva"],
                        antd: ["antd", "@ant-design/icons"],
                    },
                    assetFileNames: chunkInfo => {
                        const ext = extname(chunkInfo.name)

                        if (cssExts.includes(ext)) {
                            return `assets/css/[name].[hash].[ext]`
                        }

                        if (modelExts.includes(ext)) {
                            return `assets/model/[name].[hash].[ext]`
                        }

                        return `assets/images/[name].[hash].[ext]`
                    },
                },
            },
            minify: true,
            terserOptions: {
                compress: {
                    drop_console: false,
                    ecma: 2015,
                    toplevel: true,
                },
            },
            // reportCompressedSize: false,
            cssCodeSplit: true,
            assetsInlineLimit: 1024 * 5,
            emptyOutDir: true,
        },
    },
)
