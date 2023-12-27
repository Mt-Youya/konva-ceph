import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"
import type { ITableData } from "@/apis/getList"
import type { IPointItem } from "@/stores/home/useDataPoints"

export interface CacheState {
    cacheTableData: ITableData[]
    cachePoints: IPointItem[]
}

export function createTableState() {
    return {
        cacheTableData: [] as ITableData[],
        cachePoints: [] as IPointItem[],
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
    },
})

export const { setCacheTableData, setCachePoints } = cacheSlice.actions

export default cacheSlice.reducer
