import { createSlice } from "@reduxjs/toolkit"

export const counterSlice = createSlice({
    name: "measure",
    initialState: {
        distance: false,
        angle: false,
        imgUrl: ""
    },
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
export const { changeDistance, changeAngle, changeImgUrl } = counterSlice.actions

export default counterSlice.reducer