import { mock_table, mock_points } from "@/pages/home/data/temp"
import Mock from "mockjs"

import type { IAxiosResponse } from "@/utils/request"
import type { TTableRes } from "@/apis/getList"

interface MockTableRes extends Omit<TTableRes, "ruler-scaling"> {
    "ruler-scaling": string | number
}

Mock.mock("/ceph/measure", (): IAxiosResponse<MockTableRes> => {
    return {
        code: 0,
        msg: "ok",
        data: {
            "measure-items": mock_table,
            "point": mock_points,
            "ruler-scaling": "@integer(.281,.343)"
        }
    }
})
