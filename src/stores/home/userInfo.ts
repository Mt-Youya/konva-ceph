import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export type UserInfoState = ReturnType<typeof createUserInfoState>

export function createUserInfoState() {
    return {
        selectPointKey: "A",
    }
}

export const userInfoSlice: Slice<UserInfoState> = createSlice({
    name: "userInfo",
    initialState: createUserInfoState(),
    reducers: {
        setSelectPointKey(state, action) {
            state.selectPointKey = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSelectPointKey } = userInfoSlice.actions

export default userInfoSlice.reducer
