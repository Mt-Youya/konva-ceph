import { createSlice } from "@reduxjs/toolkit"

export const counterSlice = createSlice({
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
export const { changeContrast, changeRotate, changeScaleX, changeBrightness } = counterSlice.actions

export default counterSlice.reducer