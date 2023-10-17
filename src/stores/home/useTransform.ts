import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export interface TransformState {
    contrast: number,
    brightness: number,
    scaleX: number,
    rotate: number,
}

export const transformSlice: Slice<TransformState> = createSlice({
    name: "transform",
    initialState: {
        contrast: 0,
        brightness: 0,
        scaleX: 1,
        rotate: 0,
    },
    reducers: {
        changeContrast: (state, action) => {
            state.contrast = action.payload
        },
        changeBrightness: (state, action) => {
            state.brightness = action.payload
        },
        changeScaleX: (state, action) => {
            state.scaleX = action.payload
        },
        changeRotate: (state, action) => {
            state.rotate = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { changeContrast, changeRotate, changeScaleX, changeBrightness } = transformSlice.actions

export default transformSlice.reducer