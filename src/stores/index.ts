import { configureStore } from "@reduxjs/toolkit"
import transformReducer, { type TransformState } from "./home/useTransform"
import showPointReducer, { type ShowState } from "./home/useShowPoint"
import measureReducer, { type MeasureState } from "./home/useMeasure"
import pointReducer, { type DataState } from "./home/useDataPoints"
import tableDataReducer, { type TableState } from "./home/getTableData"

import type { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore"

interface StoreState {
    transform: TransformState
    showPoint: ShowState
    measure: MeasureState
    dataPoint: DataState
    tableData: TableState
}

const store: ToolkitStore<StoreState> = configureStore({
    reducer: {
        transform: transformReducer,
        showPoint: showPointReducer,
        measure: measureReducer,
        dataPoint: pointReducer,
        tableData: tableDataReducer,
    },
})
export default store

export type RootState = ReturnType<typeof store.getState>
