import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export interface ShowState {
    named: boolean
    major: boolean
    support: boolean
    outline: boolean
    lateral: boolean
}

export const showPointSlice: Slice<ShowState> = createSlice({
    name: "showPoint",
    initialState: {
        named: true as boolean,
        major: true as boolean,
        support: true as boolean,
        outline: true as boolean,
        lateral: false as boolean,
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
export const { changeNamed, changeOutline, changeSupport, changeMajor, changeLateral } = showPointSlice.actions

export default showPointSlice.reducer