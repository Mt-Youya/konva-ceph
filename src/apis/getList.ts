import request, { FileHeader, METHOD } from "@/utils/request"

import type { TFormData } from "@/types/FileType"
import type { IAxiosResponse } from "@/utils/request"

export interface ITableData {
    flag: 0 | 1 | -1
    measure_name: string
    measure_value: number
    result_desc: string
    standard_deviation: number
    standard_value: number
    name: string
    tips?: {
        normal: string
        up: string
        down: string
    }
}

export interface IGpsPointItem {
    name: string
    gps: [number, number]
}

export interface TTableRes {
    "measure-items": ITableData[]
    point: IGpsPointItem[]
    "ruler-scaling": number
}

export function getTableData(data: TFormData) {
    return request<void, IAxiosResponse<TTableRes>>(
        {
            url: "/ceph/measure",
            method: METHOD.POST,
            data,
            headers: FileHeader,
            timeout: 30000,
        },
    )
}
