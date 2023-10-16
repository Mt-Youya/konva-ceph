import { useSelector } from "react-redux"
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons"
import { AntdScEmpty, ScContainer, ScSpace, ScTable, ScTbody, ScThead, ScTr } from "./styled"
import InfoSvg from "@/assets/icons/infoSvg"

import type { RootState } from "@/stores"

interface IIconProps {
    value: number
    standardValue: number
    deviation: number
}

function Icon({ value, standardValue, deviation }: IIconProps) {
    if (value > (standardValue + deviation)) {
        return (
            <>
                <ScSpace>{value} <ArrowUpOutlined style={{ color: "red" }}/></ScSpace>
                <ScSpace> <InfoSvg/> </ScSpace>
            </>
        )
    }
    if (value < (standardValue - deviation)) {
        return (
            <>
                <ScSpace> {value} <ArrowDownOutlined style={{ color: "green" }}/> </ScSpace>
                <ScSpace> <InfoSvg/> </ScSpace>
            </>
        )
    }
    return <>{value}</>
}

function AsideTable() {
    const { tableData } = useSelector((state: RootState) => state.tableData)
    const measureValue = "measure_value"
    const measureName = "measure_name"
    const standard = "standard_value"

    const columns = [
        { title: "测量项目", dataIndex: measureName, key: measureName, },
        { title: "标准值", dataIndex: standard, key: standard, },
        { title: "测量值", dataIndex: measureValue, key: measureValue, },
    ]

    return (
        <ScContainer>
            {!!tableData?.length ?
                <ScTable>
                    <ScThead>
                        <ScTr className="thead-tr">
                            {columns.map((item, index) => <ScSpace key={index}>{item.title}</ScSpace>)}
                        </ScTr>
                    </ScThead>
                    <ScTbody>
                        {tableData.map((item, index) => (
                            <ScTr key={item.measure_name + index}>
                                {columns.map((column, idx) => {
                                    switch (column.dataIndex) {
                                        case standard:
                                            return (
                                                <ScSpace key={column.key + idx}>
                                                    {item.standard_value} ± {item.standard_deviation}
                                                </ScSpace>
                                            )
                                        case measureValue :
                                            return (
                                                <Icon key={column.key + idx} value={item.measure_value}
                                                      standardValue={item.standard_value}
                                                      deviation={item.standard_deviation}
                                                />
                                            )
                                        case measureName:
                                            return <ScSpace key={column.key + idx}> {item.measure_name} </ScSpace>
                                    }
                                })}
                            </ScTr>
                        ))}
                    </ScTbody>
                </ScTable>
                :
                <AntdScEmpty description="暂无数据,请上传图片"/>
            }
        </ScContainer>
    )
}

export default AsideTable
