import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"
import type { ITableData } from "@/apis/getList"

interface CounterState {
    rulerScaling: number
    tableData: ITableData[]
}

export const counterSlice: Slice<CounterState> = createSlice({
    name: "tableData",
    initialState: {
        rulerScaling: 1,
        tableData: [] as ITableData[]
    },
    reducers: {
        setTableData(state, action) {
            state.tableData = action.payload
        },
        setRulerScaling(state, action) {
            state.rulerScaling = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setTableData, setRulerScaling } = counterSlice.actions

export default counterSlice.reducer