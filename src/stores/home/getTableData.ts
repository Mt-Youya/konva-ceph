import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"
import type { ITableData } from "@/apis/getList"

export type TableState = ReturnType<typeof createTableState>

export function createTableState(): StateType {
    return {
        rulerScaling: 1,
        unitLength: 1,//(mm/px)
        tableData: [],
    }
}

interface StateType {
    rulerScaling: number
    unitLength: number
    tableData: ITableData[]
}

export const tableSlice: Slice<TableState> = createSlice({
    name: "tableData",
    initialState: createTableState(),
    reducers: {
        setTableData(state, action) {
            state.tableData = action.payload
        },
        setRulerScaling(state, action) {
            state.rulerScaling = action.payload
        },
        setUnitLength(state, action) {
            state.unitLength = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setTableData, setRulerScaling, setUnitLength } = tableSlice.actions

export default tableSlice.reducer
