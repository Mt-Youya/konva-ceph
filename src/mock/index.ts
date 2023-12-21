import { mock_table, mock_points } from "@/pages/home/data/temp.json"
import Mock from "mockjs"

import type { IAxiosResponse } from "@/utils/request"
import type { IGpsPointItem, ITableData, TTableRes } from "@/apis/getList"

interface MockTableRes extends Omit<TTableRes, "ruler-scaling"> {
    "ruler-scaling": string | number
}

export default (function() {
    const mode = import.meta.env.VITE_MODE
    if (mode === "development"|| mode ==="production") {
        Mock.mock("/ceph/measure", (): IAxiosResponse<MockTableRes> => {
            return {
                code: 0,
                msg: "ok",
                data: {
                    "measure-items": mock_table as ITableData[],
                    "point": mock_points as IGpsPointItem[],
                    "ruler-scaling": .2 + Math.random() * (.3 - .2),
                },
            }
        })
    }
    return Mock
})()
