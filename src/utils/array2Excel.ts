import * as XLSX from "xlsx"

interface IWorkbook {
    Sheets: { [key: string]: XLSX.WorkSheet }
    SheetNames: string[]
}

interface IParams {
    name: string
    table: { [key: string]: any }[]
}

export function arrayToExcel<T extends IParams[]>(array: T) {
    const workbook: IWorkbook = {
        Sheets: {},
        SheetNames: [],
    }
    for (const t of array) {
        workbook.Sheets[t.name] = XLSX.utils.json_to_sheet(t.table)
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
