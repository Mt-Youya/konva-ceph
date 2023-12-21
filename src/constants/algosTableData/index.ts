import Burstone from "./Burstone.json"
import DoctorLee from "./DoctorLee.json"
import Downs from "./Downs.json"
import Jarabak from "./Jarabak.json"
import McNamara from "./McNamara.json"
import Ricketts from "./Ricketts.json"
import Steiner from "./Steiner.json"
import Tweed from "./Tweed.json"
import PerkingUniversity from "./PerkingUniversity.json"
import Holdaway from "./Holdaway.json"
import SH9Hospital from "./Shanghai9hospital.json"
import WestChina from "./WestChina.json"
import Wylie from "./Wylie.json"

export interface ITableJson {
    name: string
    measure_name: string
    measure_value: number | string
    standard_value: number | string
    standard_deviation: number | string
    result_desc: string
    flag: number
    tips: {
        down: string
        normal: string
        up: string
    }
}

interface IJSONs {
    [key: string]: ITableJson[]

    Burstone: typeof Burstone
    DoctorLee: typeof DoctorLee
    Downs: typeof Downs
    Jarabak: typeof Jarabak
    McNamara: typeof McNamara
    Ricketts: typeof Ricketts
    Steiner: typeof Steiner
    Tweed: typeof Tweed
    PerkingUniversity: typeof PerkingUniversity
    Holdaway: typeof Holdaway
    SH9Hospital: typeof SH9Hospital
    WestChina: typeof WestChina
    Wylie: typeof Wylie
}

const JSONs: IJSONs = {
    Burstone,
    DoctorLee,
    Downs,
    Jarabak,
    McNamara,
    Ricketts,
    Steiner,
    Tweed,
    PerkingUniversity,
    Holdaway,
    SH9Hospital,
    WestChina,
    Wylie,
}

export default JSONs
