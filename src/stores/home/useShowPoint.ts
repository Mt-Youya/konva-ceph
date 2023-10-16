import { createSlice } from "@reduxjs/toolkit"

export const counterSlice = createSlice({
    name: "showPoint",
    initialState: {
        named: true,
        major: true,
        support: true,
        outline: true,
        lateral: true,
    },
    reducers: {
        changeLateral(state, action) {
            state.lateral = action.payload
        },
        changeNamed: (state, action) => {
            state.named = action.payload
        },
        changeMajor: (state, action) => {
            state.major = action.payload
        },
        changeSupport: (state, action) => {
            state.support = action.payload
        },
        changeOutline: (state, action) => {
            state.outline = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { changeNamed, changeOutline, changeSupport, changeMajor, changeLateral } = counterSlice.actions

export default counterSlice.reducer