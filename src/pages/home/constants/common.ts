export const Points_Names = {
    FH: ["Po", "Or"],
    HF: ["Or", "Po"],
    OP: ["U6", "L6", "U1", "L1"],
    MP: ["Go1", "Me"],
    U1Line: ["U1", "U1A"],
    L1Line: ["L1", "L1A"],
    PP: ["PNS", "ANS"],
    EP: ["Pogprime", "Prn"],
    Apo: ["Pog", "A"],
    NME: ["N", "Me"],
    NB: ["N", "B"],
    NPo: ["N", "Pog"],
    PoN: ["Pog", "N"],
    BN: ["B", "N"],
    BA: ["B", "A"],
    NS: ["N", "S"],
    NA: ["N", "A"],
    AN: ["A", "N"],
    SN: ["S", "N"],
    ND: ["N", "D"],
    ArGo2: ["Ar", "Go2"],
}

export interface IPointObj {
    [key: string]: readonly string[]
}

export const POINTS_CONSTANTS: IPointObj = {
    "SNA&deg": [...Points_Names.NS, ...Points_Names.NA],
    "SNB&deg": [...Points_Names.NS, ...Points_Names.NB],
    // "ANB&deg": [...Points_Names.NB, ...Points_Names.NA],
    "Ptm-A&mm": ["Ptm", "A", ...Points_Names.FH],
    "PP-FH&deg": [...Points_Names.PP, ...Points_Names.FH],
    "PP-GoGn&deg": ["Go", "Gn", ...Points_Names.PP],
    "OP-SN&deg": [...Points_Names.OP, ...Points_Names.SN],
    "Go-Pog&mm": ["Go", "Pog", ...Points_Names.MP],
    "Go-Co&mm": ["Go", "Co", ...Points_Names.ArGo2],
    "MP-SN&deg": [...Points_Names.SN, ...Points_Names.MP],
    "FH-MP&deg": [...Points_Names.FH, ...Points_Names.MP],
    "SGn-FH&deg": ["S", "Gn", ...Points_Names.FH],
    "NBa-PtGn&deg": ["N", "Ba", "Pt", "Gn"],
    "N-ANS&mm": ["N", "ANS", ...Points_Names.FH],
    "S-Go&mm": ["S", "Go", ...Points_Names.FH],
    "ANS-Me&mm": ["ANS", "Me", ...Points_Names.FH],
    "S-Go/N-Me&rate": ["S", "Go", ...Points_Names.NME, ...Points_Names.FH],
    "ANS-Me/N-Me&rate": ["ANS", "Me", ...Points_Names.NME, ...Points_Names.FH],
    "U1-L1&deg": [...Points_Names.U1Line, ...Points_Names.L1Line],
    "U1-SN&deg": ["U1A", "U1", ...Points_Names.NS],
    "U1-NA&mm": ["U1", ...Points_Names.AN],
    "U1-NA&deg": [...Points_Names.AN, ...Points_Names.U1Line],
    "L1-NB&mm": ["L1", ...Points_Names.BN],
    "L1-NB&deg": [...Points_Names.L1Line, ...Points_Names.NB],
    "L1-FH&deg": [...Points_Names.L1Line, ...Points_Names.HF],
    "U1-Apo&mm": ["U1", ...Points_Names.Apo],
    "L1-Apo&mm": ["L1", ...Points_Names.Apo],
    "U6-PP&mm": ["U6", ...Points_Names.PP],
    "L1-MP&mm": ["L1", ...Points_Names.MP],
    "U1-PP&mm": ["U1", ...Points_Names.PP],
    "L6-MP&mm": ["L6", ...Points_Names.MP],
    "U6-MP&mm": ["U6", ...Points_Names.MP],
    "Ptm-U6&mm": ["Ptm", "U6", ...Points_Names.FH],
    "UL-EP&mm": ["ULprime", ...Points_Names.EP],
    "LL-EP&mm": ["LLprime", ...Points_Names.EP],
    "Z-Angle&deg": ["LLprime", "Pogprime", "ULprime", ...Points_Names.HF],
    "FH-N'Pog'&deg": ["Nprime", "Pogprime", ...Points_Names.HF],
    "N'-Sn-Pog'&deg": ["Sn", "Nprime", "Sn", "Pogprime"],
} as const

export interface IAnyStringKey {
    [key: string]: string[]
}

export const anglePointMap: IAnyStringKey = {
    angleNormal: ["SNA&deg", "SNB&deg", "MP-SN&deg", "FH-MP&deg", "SGn-FH&deg", "NBa-PtGn&deg", "U1-L1&deg", "U1-SN&deg", "L1-FH&deg", "FH-N'Pog'&deg", "N'-Sn-Pog'&deg", "U1-NA&deg", "L1-NB&deg"],
    // calcMinus: ["ANB&deg"],
    center: ["OP-SN&deg"],
    reverse: ["PP-GoGn&deg", "PP-FH&deg"],
    rightThan: ["Z-Angle&deg"],
}

export const distancePointMap: IAnyStringKey = {
    distanceLeftSideMinus: ["U1-NA&mm", "L1-NB&mm", "U1-Apo&mm", "L1-Apo&mm", "UL-EP&mm", "LL-EP&mm"],
    rotatedIntersections4: ["Ptm-U6&mm"],
    normal3: ["U6-PP&mm", "L1-MP&mm", "U1-PP&mm", "L6-MP&mm", "U6-MP&mm"],
    normal4: ["Ptm-A&mm", "Go-Pog&mm", "Go-Co&mm"],
    rotatedVerticalNormal: ["N-ANS&mm", "S-Go&mm"],
}

export const ratePointMap: IAnyStringKey = {
    baseNormalVertical: ["S-Go/N-Me&rate", "ANS-Me/N-Me&rate"],
}
