import axios from "axios"

const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
})

// http method
export const METHOD = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
}

service.interceptors.request.use((config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

export interface IAxiosResponse<T extends any = any> {
    code: number
    msg: string
    data: T
}

service.interceptors.response.use((response) => {
        const res = response.data
        if (res.code !== 0) {
            return Promise.reject(new Error(res.message || "Error"))
        } else {
            return res
        }
    },
    (error) => {
        return Promise.reject(error)
    },
)

export const FileHeader = { "Content-Type": "multipart/form-data" }

export default service
