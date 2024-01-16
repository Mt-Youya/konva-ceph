import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"
import type { ITableData } from "@/apis/getList"
import type { IPointItem } from "../home/useDataPoints"
import type { AlgorithmItem } from "./algorithms"

export interface CacheState {
    cacheTableData: ITableData[]
    cachePoints: IPointItem[]
    cacheAlgorithmsMap: AlgorithmItem | null
}

export function createTableState(): CacheState {
    return {
        cacheTableData: [],
        cachePoints: [],
        cacheAlgorithmsMap: null,
    }
}

export const cacheSlice: Slice<CacheState> = createSlice({
    name: "cacheData",
    initialState: createTableState(),
    reducers: {
        setCacheTableData(state, action) {
            state.cacheTableData = action.payload
        },
        setCachePoints(state, action) {
            state.cachePoints = action.payload
        },
        setCacheAlgorithmsMap(state, action) {
            state.cacheAlgorithmsMap = action.payload
        },
    },
})

export const { setCacheTableData, setCachePoints, setCacheAlgorithmsMap } = cacheSlice.actions

export default cacheSlice.reducer
