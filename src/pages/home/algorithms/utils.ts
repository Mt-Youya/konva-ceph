import { ITableJson } from "@/constants/algosTableData"
import { IPointObj } from "@/pages/home/constants/common"

export function getPureMeasureProject(json: ITableJson[], algorithms: IPointObj) {
    const project: { [key: string]: readonly string[] } = {}
    const keys = Object.keys(algorithms)
    for (const jsonElement of json) {
        if (keys.includes(jsonElement.name)) {
            project[jsonElement.name] = algorithms[jsonElement.name]
        }
    }
    return project
}
