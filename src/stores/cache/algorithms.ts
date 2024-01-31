import { createSlice } from "@reduxjs/toolkit"

import type { Slice } from "@reduxjs/toolkit"

export interface AlgorithmItem {
    [key: string]: number

    "A-FH&mm": number
    "A-N&mm": number
    "A-NPog&mm": number
    "A-Np&mm": number
    "A-Npog&mm": number
    "AB-NPo&deg": number
    "AFH&mm": number
    "ANB&deg": number
    "ANS-Me&mm": number
    "ANS-Me/N-Me&rate": number
    "ANS-Ptm&mm": number
    "Ar-Go'&mm": number
    "Ar-Go'-Me&deg": number
    "Ar-Go'-N&deg": number
    "Ar-Go-Me&deg": number
    "Ar-S&mm": number
    "B-FH&mm": number
    "B-N&mm": number
    "Cm-Sn-Ls&deg": number
    "Co-A&mm": number
    "Co-Gn&mm": number
    "Co-Go&mm": number
    "Co-Pog&mm": number
    "Co-S&mm": number
    "FH-MP&deg": number
    "FH-N'Pog'&deg": number
    "FH-N'Pog'-Holdaway&deg": number
    "FH-NA&deg": number
    "FH-NPo&deg": number
    "FMA&deg": number
    "G-Pg'&mm": number
    "G-Sn&mm": number
    "G-Sn-Pg'&deg": number
    "G-Sn/Sn-Me'&rate": number
    "Go'-Me&mm": number
    "Go-Co&mm": number
    "Go-Pog&mm": number
    "GoGn-SN&deg": number
    "H-N'Pm'&deg": number
    "L1-APog&deg": number
    "L1-APog&mm": number
    "L1-Apo&mm": number
    "L1-FH&deg": number
    "L1-MP&deg": number
    "L1-MP&mm": number
    "L1-NB&deg": number
    "L1-NB&mm": number
    "L1-OP&deg": number
    "L6-MP&mm": number
    "LL-EP&mm": number
    "Li-H&mm": number
    "Li-SnPg'&mm": number
    "Ls-SnPg'&mm": number
    "MP-NPog&deg": number
    "MP-SN&deg": number
    "Me-FH&mm": number
    "N'-Pog'&mm": number
    "N'-Sn&mm": number
    "N'-Sn-Pog'&deg": number
    "N-ANS&mm": number
    "N-ANS/N-Me&rate": number
    "N-FH&mm": number
    "N-Go'-Me&deg": number
    "N-Me&mm": number
    "N-S-Ar&deg": number
    "NA-APo&deg": number
    "NBa-PtGn&deg": number
    "OP-FH&deg": number
    "OP-SN&deg": number
    "Overbite&mm": number
    "Overjet&mm": number
    "PFH&mm": number
    "PFH/AFH&rate": number
    "PP-FH&deg": number
    "PP-GoGn&deg": number
    "Pm-Pm'&mm": number
    "Po-NB&mm": number
    "Pog-Np&mm": number
    "Prn-Sn&mm": number
    "Ptm-A&mm": number
    "Ptm-U6&mm": number
    "S-Ar-Go&deg": number
    "S-Ar-Go'&deg": number
    "S-Ar/Ar-Go'&rate": number
    "S-Co&mm": number
    "S-Go&mm": number
    "S-Go'&mm": number
    "S-Go'/N-Me&rate": number
    "S-Go/N-Me&rate": number
    "S-N&mm": number
    "S-N/Go'-Me&rate": number
    "S-Ptm&mm": number
    "SE&mm": number
    "SGn-FH&deg": number
    "SL&mm": number
    "SN-FH&deg": number
    "SN/GoMe&rate": number
    "SNA&deg": number
    "SNB&deg": number
    "SND&deg": number
    "Si-H&mm": number
    "Si-LiPg'&mm": number
    "Sn-Gn'-C&deg": number
    "Sn-Gn'/C-Gn'&rate": number
    "Sn-H&mm": number
    "Sn-Stms/Stmi-Me'&rate": number
    "Ss-Ls&mm": number
    "Stms-Stmi&mm": number
    "Stms-U1&mm": number
    "U1-A&mm": number
    "U1-Apo&mm": number
    "U1-L1&deg": number
    "U1-Ls&mm": number
    "U1-NA&deg": number
    "U1-NA&mm": number
    "U1-PP&mm": number
    "U1-SN&deg": number
    "U6-PP&mm": number
    "UL-EP&mm": number
    "ULL&mm": number
    "Wits&mm": number
    "Z-Angle&deg": number
}

export interface AlgorithmsCacheState {
    calcAlgorithmsMap: AlgorithmItem | null
}

export function createAlgorithmsState(): AlgorithmsCacheState {
    return { calcAlgorithmsMap: null }
}

export const algorithmsCacheSlice: Slice<AlgorithmsCacheState> = createSlice({
    name: "algorithmsCache",
    initialState: createAlgorithmsState(),
    reducers: {
        setCalcAlgorithmsMap(state, action) {
            state.calcAlgorithmsMap = action.payload
        },
    },
})

export const { setCalcAlgorithmsMap } = algorithmsCacheSlice.actions

export default algorithmsCacheSlice.reducer
