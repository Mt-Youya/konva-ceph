import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"
import type { ITableData } from "@/apis/getList"
import type { IPointItem } from "@/stores/home/useDataPoints"

export interface CacheState {
    cacheTableData: ITableData[]
    cachePoints: IPointItem[]
    cacheStage: { x: number, y: number, scale: number }
}


export function createTableState() {
    return {
        rulerScaling: 1,
        tableData: [],
    }
}


export const cacheSlice: Slice<CacheState> = createSlice({
    name: "cacheData",
    initialState: {
        cacheTableData: [] as ITableData[],
        cachePoints: [] as IPointItem[],
        cacheStage: { x: 0, y: 0, scale: 1 },
    },
    reducers: {
        setCacheTableData(state, action) {
            state.cacheTableData = action.payload
        },
        setCachePoints(state, action) {
            state.cachePoints = action.payload
        },
        setCacheStage(state, action) {
            state.cacheStage = action.payload
        },
    },
})

export const { setCacheTableData, setCachePoints, setCacheStage } = cacheSlice.actions

export default cacheSlice.reducer
