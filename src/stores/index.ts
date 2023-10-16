import { configureStore } from "@reduxjs/toolkit"
import transformReducer from "./home/useTransform"
import showPointReducer from "./home/useShowPoint"
import measureReducer from "./home/useMeasure"
import pointReducer from "./home/useDataPoints"
import tableDataReducer from "./home/getTableData"

const store = configureStore({
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
