import { Dropdown } from "antd"
import styled from "styled-components"
import AsideTable from "@/layout/Aside/components/AsideTable.tsx"
import AiPicture from "@/layout/Aside/components/AiPicture.tsx"

const ScAside = styled.aside`
    width: 500px;
    height: 100%;
    background-color: var(--color-aside-bgColor);
    padding: 30px;
    min-width: 300px;
`

const ScH2 = styled.h2`
    color: #fff;
    display: flex;
    font-size: 20px;
    line-height: 20px;
    justify-content: space-between;
    align-items: flex-end;

    span {
        color: #BFD8F3;
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
    }
`

function Aside() {
    const menuList = [
        { label: "华西分析法", key: "0" },
        { label: "华西西分析法", key: "1" },
        { label: "华东分析法", key: "2" },
        { label: "华东东分析法", key: "3" },
        { label: "华东西分析法", key: "4" },
    ]

    return (
        <ScAside>
            <ScH2>
                分析数据
                <Dropdown menu={{ items: menuList }} trigger={["click"]}
                          arrow={{ pointAtCenter: true }}>
                    <span>{menuList[0].label}</span>
                </Dropdown>
            </ScH2>
            <AsideTable />
            <AiPicture />
        </ScAside>
    )
}

export default Aside