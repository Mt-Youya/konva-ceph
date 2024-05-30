import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import { extname } from "path"
import { Plugin as PluginImportToCDN } from "vite-plugin-cdn-import"
import react from "@vitejs/plugin-react"
import Compression from "vite-plugin-compression"
import Inspect from "vite-plugin-inspect"
import AutoImport from "unplugin-auto-import/vite"

const modelExts = [".gltf", ".glb", ".obj", "mtl", ".fbx", ".stl", ".vtp", ".vtk", ".ply", ".xyz"]
const cssExts = [".css", ".less", ".scss", "sass", ".stylus"]

const cdnModules = [
    // {
    //     name: "react",
    //     var: "React",
    //     path: "https://www.unpkg.com/browse/react@18.2.0/umd/react.production.min.js",
    // },
    // {
    //     name: "konva",
    //     var: "konva",
    //     path: "https://www.unpkg.com/browse/konva@9.2.3/konva.min.js",
    // },
    {
        name: "axios",
        var: "axios",
        path: "https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js",
    },
]

export default defineConfig({
        plugins: [
            react(),
            Inspect({ build: true, outputDir: ".vite-inspect" }),
            Compression({ threshold: 1024 * 1024 * 2 }), // gzip : over 2Mb compression
            PluginImportToCDN({ modules: cdnModules }),
            AutoImport({
                imports: ["react", "react-router", "react-router-dom"],
                dts: true,
                include: [/\.[tj]sx?$/],
            }),
        ],
        server: {
            open: true,
            port: 8080,
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
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
                    manualChunks: {
                        react: ["react", "react-router", "react-router-dom"],
                        redux: ["react-redux", "@reduxjs/toolkit"],
                        konva: ["konva", "react-konva", "react-konva-utils", "use-image"],
                        "styled-components": ["styled-components"],
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
            // terserOptions: {
            //     compress: {
            //         drop_console: false,
            //         ecma: 2015,
            //         toplevel: true,
            //     },
            // },
            // reportCompressedSize: false,
            cssCodeSplit: true,
            assetsInlineLimit: 1024 * 5,
            emptyOutDir: true,
        },
    },
)
