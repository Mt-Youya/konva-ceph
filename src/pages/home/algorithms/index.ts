import CommonAlgo from "./common"
import WestChinaAlgo from "./WestChinaPoints"
import PerkingUniversityAlgo from "./PerkingUniversityPoints"
import DownsAlgo from "./DownsPoints"
import McNamaraAlgo from "./McNamaraPoints"
import SteinerAlgo from "./SteinerPoints"
import RickettsAlgo from "./RickettsPoints"
import WylieAlgo from "./WyliePoints"
import HoldawayAlgo from "./HoldawayPoints"
import BurstoneAlgo from "./BurstonePoints"
import JarabakAlgo from "./JarabakPoints"
import TweedAlgo from "./TweedPoints"
import SH9HospitalAlgo from "./Shanghai9HospitalPoints"
import DoctorLeeAlgo from "./DoctorLeePoints"

export {
    CommonAlgo,
    WestChinaAlgo,
    PerkingUniversityAlgo,
    DownsAlgo,
    McNamaraAlgo,
    SteinerAlgo,
    RickettsAlgo,
    WylieAlgo,
    HoldawayAlgo,
    BurstoneAlgo,
    JarabakAlgo,
    TweedAlgo,
    SH9HospitalAlgo,
}

interface IAlgo {
    [key: string]: InstanceType<typeof CommonAlgo>

    WestChina: typeof WestChinaAlgo
    PerkingUniversity: typeof PerkingUniversityAlgo
    Downs: typeof DownsAlgo
    McNamara: typeof McNamaraAlgo
    Steiner: typeof SteinerAlgo
    Ricketts: typeof RickettsAlgo
    Wylie: typeof WylieAlgo
    Holdaway: typeof HoldawayAlgo
    Burstone: typeof BurstoneAlgo
    Jarabak: typeof JarabakAlgo
    Tweed: typeof TweedAlgo
    SH9Hospital: typeof SH9HospitalAlgo
    DoctorLee: typeof DoctorLeeAlgo
}

const Algo: IAlgo = {
    WestChina: WestChinaAlgo,
    PerkingUniversity: PerkingUniversityAlgo,
    Downs: DownsAlgo,
    McNamara: McNamaraAlgo,
    Steiner: SteinerAlgo,
    Ricketts: RickettsAlgo,
    Wylie: WylieAlgo,
    Holdaway: HoldawayAlgo,
    Burstone: BurstoneAlgo,
    Jarabak: JarabakAlgo,
    Tweed: TweedAlgo,
    SH9Hospital: SH9HospitalAlgo,
    DoctorLee: DoctorLeeAlgo,
}
const keys = Object.keys(Algo)

export const distanceRates: string[] = []

for (const key of keys) {
    const algo = Algo[key]
    if ("distanceRate" in algo) {
        const distanceRate = algo.distanceRate as string[]
        distanceRates.push(...distanceRate)
    }
}

export default Algo
