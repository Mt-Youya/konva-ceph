import { createSlice } from "@reduxjs/toolkit"
import type { Slice } from "@reduxjs/toolkit"

export type ResetState = ReturnType<typeof createResetState>

export function createResetState() {
    return {
        isReset: false,
    }
}

export const ResetSlice: Slice<ResetState> = createSlice({
    name: "reset",
    initialState: createResetState(),
    reducers: {
        setReset(state, action) {
            state.isReset = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setReset } = ResetSlice.actions

export default ResetSlice.reducer
