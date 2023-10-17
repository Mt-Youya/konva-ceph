export interface IState {
    clientObj: { [key: string]: any }
    upfiles: { [key: string]: any }[]
    isBreak: boolean
    isGetStsTokened: boolean
    uid: string
    fileName: string
    rocrdTime: number
    recordFileSize: number
    transFileSize: number
    allFileSize: number
    uVel: string
    uploadingStatus: string
}

export interface IResponse {
    code: number
    data: any
    msg: string
}

// type TPPT = ".pptx"
// type TTEXT = ".txt"
// type TPDF = ".pdf"
// type TCOMPRESSION = ".zip" | ".7z" | ".jar"
// type TDOCS = ".docx,.doc" | ".doc" | ".docx"
// type TEXCEL = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | ".xlsx" | ".xls"

type PPT = ".pptx"
type TEXT = ".txt"
type PDF = ".pdf"
type COMPRESSION = ".zip" | ".7z" | ".jar"
type DOCS = ".docx,.doc" | ".doc" | ".docx"
type EXCEL = ".xlsx,.xls" | ".xlsx" | ".xls"

export type IMAGE =
    | "image/*"
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp"
    | "image/bmp"
    | "image/jpg"
    | "image/avif"
    | "image/xmp"
    | "image/tiff"
    | "image/raw"

export type Suffix = IMAGE | EXCEL | DOCS | PPT | TEXT | PDF | COMPRESSION

export type ImageExcAll = Exclude<IMAGE, "image/*">
export const ImageFileTypes: ImageExcAll[] = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/avif",
    "image/xmp",
    "image/tiff",
    "image/raw",
]

export type TFormData<T extends FormData = FormData> = T