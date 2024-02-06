function reportWebVitals(onPerfEntry: () => void) {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
            onCLS(onPerfEntry)
            onFID(onPerfEntry)
            onFCP(onPerfEntry)
            onINP(onPerfEntry)
            onLCP(onPerfEntry)
            onTTFB(onPerfEntry)
        })
    }
}

export default reportWebVitals
