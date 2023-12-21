export default (function() {
    // @ts-ignore
    const crypto = window.crypto || null
    if (crypto && crypto.randomUUID) {
        return function _randomUUID() {
            return crypto.randomUUID()
        }
    } else {
        return function _randomUUID() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                const r = (Math.random() * 16) | 0
                const v = c === "x" ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        }
    }
})()
