import { useEffect } from "react"

import type { IPoint } from "@/types"

export function useLabelId(deps: IPoint[], targetDepIdx: number) {
    const id = `line-${parseInt((deps[0].x + deps[0].y).toString())}`

    useEffect(() => {
        if (deps[targetDepIdx]) {
            const label = document.querySelector(`#${id}`) as HTMLDivElement
            label.addEventListener("wheel", (e) => e.preventDefault(), { passive: false })
            return () => label.removeEventListener("wheel", () => void 0)
        }
    }, [])

    return id
}
