import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export interface AlgorithmsCacheState {
    calcAlgorithmsMap: { [key: string]: number } | null
}

export function createAlgorithmsState(): AlgorithmsCacheState {
    return { calcAlgorithmsMap: null }
}

export const algorithmsCacheSlice: Slice<AlgorithmsCacheState> = createSlice({
    name: "algorithmsCache",
    initialState: createAlgorithmsState(),
    reducers: {
        setCalcAlgorithmsMap(state, action) {
            state.calcAlgorithmsMap = action.payload
        },
    },
})

export const { setCalcAlgorithmsMap } = algorithmsCacheSlice.actions

export default algorithmsCacheSlice.reducer
