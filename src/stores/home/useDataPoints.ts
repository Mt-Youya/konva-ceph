import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export interface IPointItem {
    gps: [number, number]
    name: string
}

export interface DataState {
    pointList: IPointItem[]
    lineList: number[][]
}

export const dataSlice: Slice<DataState> = createSlice({
    name: "dataPoints",
    initialState: {
        pointList: [] as IPointItem[],
        lineList: [] as number[][],
    },
    reducers: {
        changePointList(state, action) {
            state.pointList = action.payload
        },
        changeLineList(state, action) {
            state.lineList = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { changePointList, changeLineList } = dataSlice.actions

export default dataSlice.reducer
