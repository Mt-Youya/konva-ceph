import { createSlice } from "@reduxjs/toolkit"

export interface IPointItem {
    gps: [number,number]
    name: string
}


export const counterSlice = createSlice({
    name: "dataPoints",
    initialState: {
        pointList: [] as IPointItem[],
        lineList: [] as number[][]
    },
    reducers: {
        changePointList(state, action) {
            state.pointList = action.payload
        },
        changeLineList(state, action) {
            state.lineList = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { changePointList, changeLineList } = counterSlice.actions

export default counterSlice.reducer