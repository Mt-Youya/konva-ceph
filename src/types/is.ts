const toString = Object.prototype.toString

export function isNumber(num: unknown): num is number {
    return typeof num === "number" && !Number.isNaN(num)
}

export function isString(str: unknown): str is string {
    return typeof str === "string"
}

export function isObject(obj: unknown): obj is Record<any, any> {
    return obj !== null && typeof obj === "object"
}

export function isPlainObject(obj: unknown): obj is Object {
    return toString.call(obj) === "[object Object]"
}

export function isArray(arr: unknown): arr is any[] {
    return Array.isArray(arr)
}

export function isSymbol(smb: unknown): smb is symbol {
    return typeof smb === "symbol"
}

export function isRegExp(reg: unknown): reg is RegExp {
    return toString.call(reg) === "[object RegExp]"
}

export function isMap(map: unknown): map is Map<any, any> {
    return toString.call(map) === "[object Map]"
}

export function isSet(set: unknown): set is Set<any> {
    return toString.call(set) === "[object Set]"
}

export function isDate(date: unknown): date is Date {
    return toString.call(date) === "[object Date]"
}

export function isFunction(fn: unknown): fn is Function {
    return typeof fn === "function"
}

export function isPromise<T = any>(pms: unknown): pms is Promise<T> {
    return (isObject(pms) || isFunction(pms)) &&
        isFunction((pms as any).then) &&
        isFunction((pms as any).catch)
}