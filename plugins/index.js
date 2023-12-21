function cdnImport(cdns) {
    return {
        name: "BuildStart",
        apply: "build",
        transformIndexHtml: (indexHtml) => {
            const innerHTML = cdns.reduce((acc, cur, index) => {
                if (cur.type === "link") {
                    if (index === 0) {
                        return acc + `<link rel="${cur.rel}" href="${cur.href}" ${cur.prefetch ? "prefetch" : ""}>\n`
                    }
                    return acc + `    <link rel="${cur.rel}" href="${cur.href}" ${cur.prefetch ? "prefetch" : ""}>\n`
                }
                if (index === 0) {
                    return acc + `<script src="${cur.src}"></script>\n`
                }
                return acc + `    <script src="${cur.src}"></script>\n`
            }, "")
            return indexHtml.replace(/<!--  %__CDN-Import__%  -->/, innerHTML)
        },
    }
}

export {
    cdnImport as Plugin,
}
