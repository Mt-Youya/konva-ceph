export default function useInputFileEle(handleUpload: (e: Event) => void) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        const input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("accept", "image/*")
        input.addEventListener("input", handleUpload)

        inputRef.current = input
        return () => {
            input.removeEventListener("input", handleUpload)
            inputRef.current = null
        }
    }, [])

    return inputRef
}
