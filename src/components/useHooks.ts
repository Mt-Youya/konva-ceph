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

export function useLog10(num: number, append = 35) {
    const pow = Math.log10(num)
    if (pow == -Infinity || pow === 0) {
        return 15 + append
    }
    if (pow % 1 === 0) {
        return 20 + 5 * pow + append
    }
    if (pow < 1) {
        return Math.ceil(pow) * 15 + append
    }
    if (pow < 2) {
        return Math.ceil(pow) * 11 + append
    }
    return Math.ceil(pow) * 10 + append
}
