export default function useInputFileEle(handleUpload: (e: Event) => void, accept = "image/*") {
    const inputRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        const input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("accept", accept)
        input.addEventListener("input", handleUpload)

        inputRef.current = input
        return () => {
            input.removeEventListener("input", handleUpload)
            inputRef.current = null
        }
    }, [])

    return inputRef
}
