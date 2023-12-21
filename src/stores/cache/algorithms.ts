import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"
import type algosTableData from "@/constants/algosTableData"

interface IKsVn {
    [key: string]: number
}

export interface AlgorithmsCacheState {
    algorithmsCache: { [key: keyof typeof algosTableData]: IKsVn } | null
}

export function createAlgorithmsState(): AlgorithmsCacheState {
    return { algorithmsCache: null }
}

export const algorithmsCacheSlice: Slice<AlgorithmsCacheState> = createSlice({
    name: "algorithmsCache",
    initialState: createAlgorithmsState(),
    reducers: {
        setAlgorithmsCache(state, action) {
            state.algorithmsCache = action.payload
        },
    },
})

export const { setAlgorithmsCache } = algorithmsCacheSlice.actions

export default algorithmsCacheSlice.reducer
