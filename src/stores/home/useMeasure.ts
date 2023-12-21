import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export type MeasureState = ReturnType<typeof createMeasureState>

export function createMeasureState() {
    return {
        distance: false,
        angle: false,
        imgUrl: "",
    }
}

export const measureSlice: Slice<MeasureState> = createSlice({
    name: "measure",
    initialState: createMeasureState(),
    reducers: {
        changeDistance(state, action) {
            state.distance = action.payload
        },
        changeAngle: (state, action) => {
            state.angle = action.payload
        },
        changeImgUrl(state, action) {
            state.imgUrl = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { changeDistance, changeAngle, changeImgUrl } = measureSlice.actions

export default measureSlice.reducer
