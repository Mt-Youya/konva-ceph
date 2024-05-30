import * as XLSX from "xlsx"

interface IWorkbook {
    Sheets: { [key: string]: XLSX.WorkSheet }
    SheetNames: string[]
}

interface IParams {
    name: string
    table: { [key: string]: any }[]
}


// const headers = ["A", "B", "C", "D", "E"]
export function arrayToExcel<T extends IParams[]>(array: T) {
    const workbook: IWorkbook = {
        Sheets: {},
        SheetNames: [],
    }
    for (const t of array) {
        workbook.Sheets[t.name] = XLSX.utils.json_to_sheet(t.table)
        // console.table(t.table)
        // for (let index = 0; index < t.table.length; index++) {
        //     const tableElement = t.table[index]
        //     const down = (tableElement.标准值 + tableElement.标准差)
        //     const up = (tableElement.标准值 - tableElement.标准差)
        //     const key = tableElement.测量值 > up ? "up" : tableElement.测量值 < down ? "down" : "normal"
        //
        //     if (key === "normal") continue
        //     for (const header of headers) {
        //         workbook.Sheets[t.name][`${header}${index + 1}`].s = {
        //             fill: { fgColor: { rgb: key === "up" ? "FF0000" : "0000FF00" } },
        //             font: { color: { rgb: "FF0000" } },
        //         }
        //     }
        //
        // }
        // console.log(workbook.Sheets[t.name])
        // for (const sheetElement in workbook.Sheets[t.name]) {
        //     // console.log(sheetElement)
        // }
        workbook.SheetNames.push(t.name)
    }
    const excelData = XLSX.write(workbook, { bookType: "xlsx", bookSST: false, type: "binary" })
    return new Blob([excelDataToBlob(excelData)], { type: "application/octet-stream" })
}

function excelDataToBlob(excelData: string) {
    const buffer = new ArrayBuffer(excelData.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i != excelData.length; ++i) {
        view[i] = excelData.charCodeAt(i) & 0xff
    }
    return buffer
}
