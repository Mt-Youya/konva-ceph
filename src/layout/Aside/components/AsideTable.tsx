import { useDispatch, useSelector } from "react-redux"
import { Tooltip } from "antd"
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons"
import { AntdScEmpty, ScContainer, ScSpace, ScTable, ScTbody, ScThead, ScTr } from "./styled"
import { setTableData } from "@/stores/home/getTableData"
import AlgosTableData from "@/constants/algosTableData"
import WarningInfo from "@/assets/icons/WarningInfo.svg?url"

import type { RootState } from "@/stores"

interface IIconProps {
    value: number
    standardValue: number
    deviation: number
    errorTips: {
        up: string
        down: string
        normal: string
    }
}

function Icon({ value, standardValue, deviation, errorTips }: IIconProps) {
    if (value > (standardValue + deviation)) {
        return (
            <>
                <ScSpace>{value} <ArrowUpOutlined style={{ color: "red" }} /></ScSpace>
                <ScSpace className="icon">
                    <Tooltip title={errorTips?.up}> <img src={WarningInfo} alt="warning" role="img" /> </Tooltip>
                </ScSpace>
            </>
        )
    }
    if (value < (standardValue - deviation)) {
        return (
            <>
                <ScSpace> {value} <ArrowDownOutlined style={{ color: "green" }} /> </ScSpace>
                <ScSpace className="icon">
                    <Tooltip title={errorTips?.down}> <img src={WarningInfo} alt="warning" role="img" /> </Tooltip>
                </ScSpace>
            </>
        )
    }
    return <>{value}</>
}

function AsideTable() {
    const { tableData, unitLength, rulerScaling } = useSelector((state: RootState) => state.tableData)
    const { algorithmWay } = useSelector((state: RootState) => state.algorithm)
    const { calcAlgorithmsMap } = useSelector((state: RootState) => state.algorithmsCache)

    const wayKey = useMemo(() => algorithmWay.key, [algorithmWay])
    const unit = useMemo(() => unitLength, [unitLength])
    const algorithmMap = useMemo(() => calcAlgorithmsMap, [calcAlgorithmsMap])!

    const dispatch = useDispatch()

    const measureValue = "measure_value"
    const measureName = "measure_name"
    const standard = "standard_value"

    const columns = [
        { title: "测量项目", dataIndex: measureName, key: measureName },
        { title: "标准值", dataIndex: standard, key: standard },
        { title: "测量值", dataIndex: measureValue, key: measureValue },
    ]

    useEffect(() => {
        if (!tableData.length || !algorithmMap) return
        const target = AlgosTableData[wayKey]
        const data = target.map(item => {
            const isMM = item.name.includes("&mm")

            if (rulerScaling !== 0) {
                const mv = isMM ? algorithmMap[item.name] * unit * rulerScaling : algorithmMap[item.name]
                if (!mv) {
                    console.log("!mv", isMM, algorithmMap, item.name, unit, rulerScaling)
                    return {
                        ...item,
                        measure_value: "-",
                    }
                }
                return {
                    ...item,
                    measure_value: +mv.toFixed(2),
                }
            }
            return {
                ...item,
                measure_value: isMM ? "-" : +algorithmMap[item.name].toFixed(2),
            }
        })
        dispatch(setTableData(data))
    }, [wayKey, unit, algorithmMap, rulerScaling])

    return (
        <ScContainer>
            {!!tableData?.length ?
                <ScTable>
                    <ScThead>
                        <ScTr className="thead-tr">
                            {columns.map(item => <ScSpace key={item.key}>{item.title}</ScSpace>)}
                        </ScTr>
                    </ScThead>
                    <ScTbody>
                        {tableData.map(item => (
                            <ScTr key={item.measure_name + item.measure_value}>
                                {columns.map((column, idx) => {
                                    switch (column.dataIndex) {
                                        case standard:
                                            return (
                                                <ScSpace key={item.name + column.key + idx}>
                                                    {item.standard_value} ± {item.standard_deviation}
                                                </ScSpace>
                                            )
                                        case measureValue:
                                            return (
                                                <Icon key={item.measure_value + column.key + idx}
                                                      value={item.measure_value}
                                                      standardValue={item.standard_value}
                                                      deviation={item.standard_deviation}
                                                      errorTips={item.tips!}
                                                />
                                            )
                                        case measureName:
                                            return <ScSpace key={column.key}> {item.measure_name} </ScSpace>
                                    }
                                })}
                            </ScTr>
                        ))}
                    </ScTbody>
                </ScTable>
                :
                <AntdScEmpty description="暂无数据,请上传图片" />
            }
        </ScContainer>
    )
}

export default AsideTable
