import { createSlice } from "@reduxjs/toolkit"
import type { Slice } from "@reduxjs/toolkit"

export type ReloadState = ReturnType<typeof createReloadState>

export function createReloadState() {
    return {
        loadCount: 0,
    }
}

export const ResetSlice: Slice<ReloadState> = createSlice({
    name: "reload",
    initialState: createReloadState(),
    reducers: {
        setLoadCount(state) {
            state.loadCount += 1
        },
    },
})

// Action creators are generated for each case reducer function
export const { setLoadCount } = ResetSlice.actions

export default ResetSlice.reducer
