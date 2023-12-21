import { createSlice } from "@reduxjs/toolkit"
import algorithmsMap from "@/pages/home/algorithms"

import type { Slice } from "@reduxjs/toolkit"

export type AlgorithmState = ReturnType<typeof createAlgorithmState>

interface IAlgorithmWay {
    algorithmWay: {
        label: string
        key: keyof typeof algorithmsMap
    }
}

export function createAlgorithmState(): IAlgorithmWay {
    return {
        algorithmWay: {
            label: "华西分析法",
            key: "WestChina",
        },
    }
}

export const AlgorithmSlice: Slice<AlgorithmState> = createSlice({
    name: "algorithm",
    initialState: createAlgorithmState(),
    reducers: {
        setAlgorithm(state, action) {
            state.algorithmWay = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAlgorithm } = AlgorithmSlice.actions

export default AlgorithmSlice.reducer
