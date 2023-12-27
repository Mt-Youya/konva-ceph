export const cdns = [
    {
        name: "react",
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
    },
    {
        name: "react-dom",
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
        aliases: ["client"],
    },
    {
        name: "react-router",
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/react-router/6.21.1/react-router.production.min.js",
    },
    {
        name: "react-router-dom",
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/6.21.1/react-router-dom.production.min.js",
    },
    {
        name: "react-redux",
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/react-redux/8.1.0/react-redux.min.js",
    },
    {
        name: "styled-components",
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/styled-components/6.1.0/styled-components.min.js",
    },
    { name: "dayjs", type: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js" },
    { name: "axios", type: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js" },
    { name: "antd", type: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/antd/5.10.2/antd.min.js" },
    { name: "xlsx", type: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/shim.min.js" },
    { name: "jszip", type: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" },
    { name: "konva", type: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/konva/9.0.0/konva.min.js" },
    {
        name: "antd-reset",
        type: "link",
        href: "https://cdnjs.cloudflare.com/ajax/libs/antd/5.10.2/reset.min.css",
        rel: "stylesheet",
        prefetch: true,
    },
]


export function transform2VitePluginCDN2(cdns1 = cdns) {
    const scripts = cdns1.filter(cdn => cdn.type === "script")
    const externals = scripts.map(cdn => cdn.name)
    const resolvers = scripts.map(cdn => {
        const pattern = /\/(\d+\.\d+\.\d+)\//
        const [match] = pattern.exec(cdn.src)
        const path = cdn.src.split(match)[1]
        if (cdn.aliases) {
            return { name: cdn.name, relativeModule: path, aliases: cdn.aliases }
        }
        return { name: cdn.name, relativeModule: path }
    })
    return { resolvers, externals }
}

const result = transform2VitePluginCDN2()
console.log(result)

export const cdns2 = [
    { name: "react", relativeModule: "./umd/react.production.min.js" },
    { name: "react-dom", relativeModule: "./umd/react-dom.production.min.js", aliases: ["client"] },
    { name: "react-router", relativeModule: "./react-router.production.min.js" },
    { name: "react-router-dom", relativeModule: "react-router-dom.production.min.js" },
    { name: "react-redux", relativeModule: "react-redux.min.js" },
    { name: "styled-components", relativeModule: "styled-components.min.js" },
    { name: "dayjs", relativeModule: "dayjs.min.js" },
    { name: "axios", relativeModule: "axios.min.js" },
    { name: "antd", relativeModule: "antd.min.js" },
    { name: "xlsx", relativeModule: "xlsx.min.js" },
    { name: "jszip", relativeModule: "jszip.min.js" },
    { name: "konva", relativeModule: "konva.min.js" },
]
