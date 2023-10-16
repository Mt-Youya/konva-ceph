import { getOriginPointIncludeAngle } from "@/features/canvasMeasure/utils"

import type { IGpsPointItem } from "@/apis/getList"

export const points: IGpsPointItem[] = [
    {
        "name": "A",
        "gps": [
            621,
            437
        ]
    },
    {
        "name": "ANS",
        "gps": [
            631,
            410
        ]
    },
    {
        "name": "Aprime",
        "gps": [
            679,
            446
        ]
    },
    {
        "name": "Ar",
        "gps": [
            376,
            380
        ]
    },
    {
        "name": "B",
        "gps": [
            600,
            557
        ]
    },
    {
        "name": "Ba",
        "gps": [
            354,
            402
        ]
    },
    {
        "name": "Bo",
        "gps": [
            271,
            437
        ]
    },
    {
        "name": "Bri",
        "gps": [
            664,
            331
        ]
    },
    {
        "name": "C",
        "gps": [
            478,
            679
        ]
    },
    {
        "name": "Cm",
        "gps": [
            672,
            400
        ]
    },
    {
        "name": "Co",
        "gps": [
            395,
            355
        ]
    },
    {
        "name": "D",
        "gps": [
            581,
            587
        ]
    },
    {
        "name": "FA",
        "gps": [
            642,
            487
        ]
    },
    {
        "name": "G",
        "gps": [
            643,
            229
        ]
    },
    {
        "name": "Gn",
        "gps": [
            585,
            612
        ]
    },
    {
        "name": "Gnprime",
        "gps": [
            636,
            619
        ]
    },
    {
        "name": "Go",
        "gps": [
            411,
            540
        ]
    },
    {
        "name": "Go1",
        "gps": [
            424,
            550
        ]
    },
    {
        "name": "Go2",
        "gps": [
            392,
            505
        ]
    },
    {
        "name": "Id",
        "gps": [
            616,
            526
        ]
    },
    {
        "name": "L1",
        "gps": [
            624,
            496
        ]
    },
    {
        "name": "L1A",
        "gps": [
            581,
            557
        ]
    },
    {
        "name": "L6",
        "gps": [
            541,
            493
        ]
    },
    {
        "name": "L6A",
        "gps": [
            518,
            516
        ]
    },
    {
        "name": "L6d",
        "gps": [
            517,
            491
        ]
    },
    {
        "name": "L6m",
        "gps": [
            542,
            496
        ]
    },
    {
        "name": "LLprime",
        "gps": [
            664,
            538
        ]
    },
    {
        "name": "Li",
        "gps": [
            677,
            519
        ]
    },
    {
        "name": "Ls",
        "gps": [
            675,
            470
        ]
    },
    {
        "name": "Me",
        "gps": [
            581,
            612
        ]
    },
    {
        "name": "Meprime",
        "gps": [
            594,
            645
        ]
    },
    {
        "name": "N",
        "gps": [
            621,
            282
        ]
    },
    {
        "name": "Nprime",
        "gps": [
            628,
            270
        ]
    },
    {
        "name": "Or",
        "gps": [
            598,
            352
        ]
    },
    {
        "name": "PNS",
        "gps": [
            493,
            411
        ]
    },
    {
        "name": "Pcd",
        "gps": [
            385,
            372
        ]
    },
    {
        "name": "Po",
        "gps": [
            354,
            355
        ]
    },
    {
        "name": "Pog",
        "gps": [
            589,
            596
        ]
    },
    {
        "name": "Pogprime",
        "gps": [
            626,
            610
        ]
    },
    {
        "name": "Prn",
        "gps": [
            687,
            401
        ]
    },
    {
        "name": "Pt",
        "gps": [
            477,
            355
        ]
    },
    {
        "name": "Ptm",
        "gps": [
            475,
            399
        ]
    },
    {
        "name": "S",
        "gps": [
            417,
            304
        ]
    },
    {
        "name": "Si",
        "gps": [
            642,
            554
        ]
    },
    {
        "name": "Sn",
        "gps": [
            664,
            409
        ]
    },
    {
        "name": "Spr",
        "gps": [
            633,
            465
        ]
    },
    {
        "name": "Stmi",
        "gps": [
            663,
            510
        ]
    },
    {
        "name": "Stms",
        "gps": [
            663,
            494
        ]
    },
    {
        "name": "U1",
        "gps": [
            630,
            505
        ]
    },
    {
        "name": "U1A",
        "gps": [
            604,
            430
        ]
    },
    {
        "name": "U6",
        "gps": [
            538,
            481
        ]
    },
    {
        "name": "U6A",
        "gps": [
            532,
            451
        ]
    },
    {
        "name": "U6d",
        "gps": [
            530,
            472
        ]
    },
    {
        "name": "U6m",
        "gps": [
            528,
            478
        ]
    },
    {
        "name": "ULprime",
        "gps": [
            675,
            459
        ]
    },
    {
        "name": "Xi",
        "gps": [
            434,
            454
        ]
    },
    {
        "name": "ruler1",
        "gps": [
            685,
            206
        ]
    },
    {
        "name": "ruler2",
        "gps": [
            686,
            168
        ]
    }
]

export const lines = [
    {
        "name": "ljcv",
        "gps": {
            "Lj1": [
                510,
                492
            ],
            "Lj2": [
                483,
                454
            ],
            "Lj3": [
                481,
                399
            ],
            "Lj4": [
                510,
                375
            ],
            "Lj5": [
                483,
                392
            ],
            "Lj6": [
                445,
                409
            ],
            "Lj7": [
                405,
                392
            ],
            "Lj8": [
                400,
                365
            ],
            "Co_S": [
                376,
                364
            ],
            "Pcd_S": [
                364,
                374
            ],
            "Ar_S": [
                373,
                405
            ],
            "Lj9": [
                376,
                444
            ],
            "Go2_S": [
                376,
                504
            ],
            "Go_S": [
                397,
                534
            ],
            "Go1_S": [
                422,
                555
            ],
            "Lj10": [
                444,
                555
            ],
            "Lj11": [
                472,
                568
            ],
            "Lj12": [
                542,
                594
            ],
            "Me_S": [
                590,
                616
            ]
        }
    },
    {
        "name": "faceucv",
        "gps": {
            "Stms_S": [
                647,
                489
            ],
            "Fu1": [
                662,
                474
            ],
            "Ls_S": [
                668,
                472
            ],
            "ULprime_S": [
                666,
                463
            ],
            "Aprime_S": [
                653,
                452
            ],
            "Fu2": [
                647,
                437
            ],
            "Sn_S": [
                646,
                431
            ],
            "Fu3": [
                659,
                414
            ],
            "Cm_S": [
                670,
                412
            ],
            "Prn_S": [
                692,
                406
            ],
            "Fu4": [
                685,
                380
            ],
            "Fu5": [
                670,
                353
            ],
            "Bri_S": [
                654,
                327
            ],
            "Fu6": [
                634,
                312
            ],
            "Nprime_S": [
                635,
                281
            ],
            "Fu7": [
                637,
                257
            ],
            "Fu8": [
                645,
                234
            ],
            "G_S": [
                646,
                207
            ]
        }
    },
    {
        "name": "facedcv",
        "gps": {
            "C_S": [
                462,
                658
            ],
            "Fd1": [
                506,
                649
            ],
            "Fd2": [
                548,
                647
            ],
            "Meprime_S": [
                568,
                639
            ],
            "Fd3": [
                591,
                644
            ],
            "Gnprime_S": [
                627,
                623
            ],
            "Fd4": [
                632,
                613
            ],
            "Pogprime_S": [
                649,
                595
            ],
            "Fd5": [
                649,
                585
            ],
            "Fd6": [
                644,
                552
            ],
            "Si_S": [
                642,
                542
            ],
            "Fd7": [
                650,
                534
            ],
            "LLprime_S": [
                676,
                517
            ],
            "Li_S": [
                664,
                517
            ],
            "Fd8": [
                661,
                507
            ],
            "Stmi_S": [
                656,
                488
            ]
        }
    },
    {
        "name": "adcv",
        "gps": {
            "Id_S": [
                626,
                519
            ],
            "B_S": [
                609,
                545
            ],
            "Ad1": [
                617,
                570
            ],
            "Pog_S": [
                625,
                595
            ],
            "Gn_S": [
                612,
                608
            ],
            "Me_S": [
                600,
                618
            ],
            "Ad2": [
                585,
                603
            ],
            "Ad3": [
                574,
                593
            ],
            "Ad4": [
                574,
                570
            ],
            "Ad5": [
                585,
                544
            ],
            "Ad6": [
                600,
                519
            ]
        }
    }
]

const Names = {
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
    BN: ["B", "N"],
    NS: ["N", "S"],
    NA: ["N", "A"],
    AN: ["A", "N"],
    SN: ["S", "N"],
    ArGo2: ["Ar", "Go2"],
}

interface IPointObj {
    [key: string]: readonly string[]
}

export const POINTS_CONSTANTS: IPointObj = {
    "SNA&deg": [...Names.NS, ...Names.NA],
    "SNB&deg": [...Names.NS, ...Names.NB],
    "ANB&deg": [...Names.NB, ...Names.NA],
    "Ptm-A&mm": ["Ptm", "A", ...Names.FH],
    "PP-FH&deg": [...Names.PP, ...Names.FH],
    "PP-GoGn&deg": ["Go", "Gn", ...Names.PP],
    "OP-SN&deg": [...Names.OP, ...Names.SN],
    "Go-Pog&mm": ["Go", "Pog", ...Names.MP],
    "Go-Co&mm": ["Go", "Co", ...Names.ArGo2],
    "MP-SN&deg": [...Names.SN, ...Names.MP],
    "FH-MP&deg": [...Names.FH, ...Names.MP],
    "SGn-FH&deg": ["S", "Gn", ...Names.FH],
    "NBa-PtGn&deg": ["N", "Ba", "Pt", "Gn"],
    "N-ANS&mm": ["N", "ANS", ...Names.FH],
    "S-Go&mm": ["S", "Go", ...Names.FH],
    "S-Go/N-Me&rate": ["S", "Go", ...Names.NME, ...Names.FH],
    "ANS-Me/N-Me&rate": ["ANS", "Me", ...Names.NME, ...Names.FH],
    "U1-L1&deg": [...Names.U1Line, ...Names.L1Line],
    "U1-SN&deg": ["U1A", "U1", ...Names.NS],
    "U1-NA&mm": ["U1", ...Names.NA],
    "U1-NA&deg": [...Names.AN, ...Names.U1Line],
    "L1-NB&mm": ["L1", ...Names.BN],
    "L1-NB&deg": [...Names.L1Line, ...Names.NB],
    "L1-FH&deg": [...Names.L1Line, ...Names.HF],
    "U1-Apo&mm": ["U1", ...Names.Apo],
    "L1-Apo&mm": ["L1", ...Names.Apo],
    "U6-PP&mm": ["U6", ...Names.PP],
    "L1-MP&mm": ["L1", ...Names.MP],
    "U1-PP&mm": ["U1", ...Names.PP],
    "L6-MP&mm": ["L6", ...Names.MP],
    "U6-MP&mm": ["U6", ...Names.MP],
    "Ptm-U6&mm": ["Ptm", "U6", ...Names.FH],
    "UL-EP&mm": ["ULprime", ...Names.EP],
    "LL-EP&mm": ["LLprime", ...Names.EP],
    "Z-Angle&deg": ["LLprime", "Pogprime", "ULprime", ...Names.HF],
    "FH-N'Pog'&deg": ["Nprime", "Pogprime", ...Names.HF],
    "N'-Sn-Pog'&deg": ["Sn", "Nprime", "Sn", "Pogprime"],
} as const

export const shouldJudgePositions = ["U1-NA&mm", "L1-NB&mm", "U1-Apo&mm", "L1-Apo&mm", "UL-EP&mm", "LL-EP&mm", "Ptm-U6&mm"]
export const shouldJudgeAngles = ["OP-SN&deg", "PP-GoGn&deg", "PP-FH&deg"]

interface IAnyStringKey {
    [key: string]: any
}

export const anglePointMap: IAnyStringKey = {
    normal: ["SNA&deg", "SNB&deg", "MP-SN&deg", "FH-MP&deg", "SGn-FH&deg", "NBa-PtGn&deg", "U1-L1&deg", "U1-SN&deg", "L1-FH&deg", "FH-N'Pog'&deg", "N'-Sn-Pog'&deg", "U1-NA&deg", "L1-NB&deg"],
    lOrR: ["ANB&deg"],
    center: ["OP-SN&deg"],
    reverse: ["PP-GoGn&deg", "PP-FH&deg"],
    rightThan: ["Z-Angle&deg",]
}

export const distancePointMap: IAnyStringKey = {
    intersections3: ["U1-NA&mm", "L1-NB&mm", "U1-Apo&mm", "L1-Apo&mm", "UL-EP&mm", "LL-EP&mm",],
    intersections4: ["Ptm-U6&mm"],
    normal3: ["U6-PP&mm", "L1-MP&mm", "U1-PP&mm", "L6-MP&mm", "U6-MP&mm"],
    normal4: ["Ptm-A&mm", "Go-Pog&mm", "Go-Co&mm",],
    side2: ["N-ANS&mm", "S-Go&mm",],
    side1: ["N-ANS&mm", "S-Go&mm",],
}

export const ratePointMap: IAnyStringKey = {
    mmNormal: ["S-Go/N-Me&rate", "ANS-Me/N-Me&rate"]
}

export function getAllPointMethodMap(measurePoints: IPointObj) {
    const allPointMethodsMap: IAnyStringKey = {}
    for (const key in measurePoints) {
        if (key.includes("&deg")) {
            // allPointMethodsMap[key] =
            for (const angleKey in anglePointMap) {
                if (anglePointMap[angleKey].includes(key)) {
                    allPointMethodsMap[key] = angleKey
                }
            }
        } else if (key.includes("&mm")) {
            for (const distanceKey in distancePointMap) {
                if (distancePointMap[distanceKey].includes(key)) {
                    allPointMethodsMap[key] = distanceKey
                }
            }
        } else if (key.includes("&rate")) {
            for (const rateKey in ratePointMap) {
                if (ratePointMap[rateKey].includes(key)) {
                    allPointMethodsMap[key] = rateKey
                }
            }
        }
    }
    return allPointMethodsMap
}

type TMap = Map<string, IPointObj>

export function getPointMap(nameList: string[]) {
    const pointMap: TMap = new Map
    for (const key in POINTS_CONSTANTS) {
        const item = POINTS_CONSTANTS[key]
        for (const name of nameList) {
            const flag = item.includes(name)
            if (!flag) continue
            if (!pointMap.has(name)) {
                const obj = { [key]: item }
                pointMap.set(name, obj)
            } else {
                const obj = pointMap.get(name)!
                obj[key] = item
                pointMap.set(name, obj)
            }
        }
    }
    return pointMap
}

export function getPurePoints(pointList: IGpsPointItem[]) {
    const point: { [key: string]: number[] } = {}
    for (const key in pointList) {
        const { name, gps } = pointList[key]
        point[name] = gps
    }
    return point
}

export interface IMap {
    [key: keyof typeof POINTS_CONSTANTS]: number[]
}

export type TTargetMap = Map<string, IMap>

export function getRelativePointsGroup(names: string[]) {
    const AllPointNames = [...names]
    const groupMap: TTargetMap = new Map
    const pointMap = getPointMap(AllPointNames)
    for (const nameOfPoint of AllPointNames) {
        const related = pointMap.get(nameOfPoint)
        if (!related) continue
        const obj: IMap = {}
        for (const key in related) {
            obj[key] = []
            for (const ele of related[key]) {
                const idx = AllPointNames.indexOf(ele)
                if (idx === -1) continue
                obj[key].push(idx)
            }
        }
        groupMap.set(nameOfPoint, obj)
    }
    return groupMap
}

export function getOriginAngle(pointArr: IGpsPointItem[]) {
    const { Or: [Xor, Yor], Po: [Xpo, Ypo] } = getPurePoints(pointArr)
    const Por = { x: Xor, y: Yor }
    const Ppo = { x: Xpo, y: Ypo }
    return getOriginPointIncludeAngle(Por, Ppo)
}
