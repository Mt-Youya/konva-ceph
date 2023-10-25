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
        var: "ReactRedux",
        path: "https://cdnjs.cloudflare.com/ajax/libs/react-redux/8.1.3/react-redux.mjs",
    },
    {
        name: "react-router",
        var: "ReactRouter",
        path: "https://cdnjs.cloudflare.com/ajax/libs/react-router/6.17.0/react-router.production.min.js",
    },
    {
        name: "react-router-dom",
        var: "ReactRouterDom",
        path: "https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/6.17.0/react-router-dom.production.min.js",
    },
    {
        name: "konva",
        var: "Konva",
        path: "https://cdnjs.cloudflare.com/ajax/libs/konva/9.0.0/konva.min.js",
    },
    {
        name: "antd",
        var: "AntD",
        path: "https://cdnjs.cloudflare.com/ajax/libs/antd/5.10.2/antd.min.js",
    },
    {
        name: "axios",
        var: "Axios",
        path: "https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js",
    },
]
export default defineConfig({
        plugins: [
            react(),
            Compression({ threshold: 1024 * 1024 * 2 }), // gzip : over 2Mb compression
            importToCDN.default({ modules: cdnModules }),
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
                output: {
                    chunkFileNames: "assets/js/[name]-[hash].js",
                    entryFileNames: "assets/js/[name].[hash].js",
                    compact: true,
                    // manualChunks: {
                    //     react: ["react", "react-router", "react-router-dom"],
                    //     redux: ["react-redux", "@reduxjs/toolkit"],
                    //     konva: ["konva", "react-konva"],
                    //     antd: ["antd", "@ant-design/icons"],
                    // },
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
            minify: "terser",
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
