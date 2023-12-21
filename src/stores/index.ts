import { configureStore } from "@reduxjs/toolkit"
import transformReducer, { type TransformState } from "./home/useTransform"
import showPointReducer, { type ShowState } from "./home/useShowPoint"
import measureReducer, { type MeasureState } from "./home/useMeasure"
import pointReducer, { type DataState } from "./home/useDataPoints"
import tableDataReducer, { type TableState } from "./home/getTableData"
import cacheReducer, { type CacheState } from "@/stores/cache"
import userInfoReducer, { type UserInfoState } from "./home/userInfo"
import AlgorithmReducer, { type AlgorithmState } from "@/stores/aside"
import AlgorithmsCacheReducer, { type AlgorithmsCacheState } from "@/stores/cache/algorithms"
import ResetReducer, { type ResetState } from "@/stores/header/reset"

import type { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore"

interface StoreState {
    transform: TransformState
    showPoint: ShowState
    measure: MeasureState
    dataPoint: DataState
    tableData: TableState
    cache: CacheState
    userInfo: UserInfoState
    algorithm: AlgorithmState
    algorithmsCache: AlgorithmsCacheState
    reset: ResetState
}

const store: ToolkitStore<StoreState> = configureStore({
    reducer: {
        transform: transformReducer,
        showPoint: showPointReducer,
        measure: measureReducer,
        dataPoint: pointReducer,
        tableData: tableDataReducer,
        cache: cacheReducer,
        userInfo: userInfoReducer,
        algorithm: AlgorithmReducer,
        algorithmsCache: AlgorithmsCacheReducer,
        reset: ResetReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export default store
