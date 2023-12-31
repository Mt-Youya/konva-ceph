import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export type ShowState = ReturnType<typeof createShowPointState>

export function createShowPointState() {
    return {
        named: true,
        major: true,
        support: true,
        outline: true,
        lateral: true,
    }
}

export const showPointSlice: Slice<ShowState> = createSlice({
    name: "showPoint",
    initialState: createShowPointState(),
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
