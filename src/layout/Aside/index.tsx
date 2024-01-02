import { setAlgorithm } from "@/stores/aside"
import AsideTable from "./components/AsideTable"
import AiPicture from "./components/AiPicture"

import type { RootState } from "@/stores"

const ScAside = styled.aside`
    height: 100%;
    color: #fff;
    background-color: var(--color-aside-bgColor);
    padding: 24px;
    min-width: 500px;
    box-shadow: 0 0 5px #363636;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    overflow-y: auto;
`

const ScH2 = styled.h2`
    display: flex;
    font-size: 20px;
    line-height: 20px;
    justify-content: space-between;
    align-items: flex-end;

    & > span {
        color: #BFD8F3;
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
        cursor: pointer;
    }
`

const menuList = [
    { label: "华西分析法", key: "WestChina" },
    { label: "北大分析法", key: "PerkingUniversity" },
    { label: "Downs分析法", key: "Downs" },
    { label: "McNamara分析法", key: "McNamara" },
    { label: "Steiner分析法", key: "Steiner" },
    { label: "Ricketts分析法", key: "Ricketts" },
    { label: "Wylie分析法", key: "Wylie" },
    { label: "Holdaway分析法", key: "Holdaway" },
    { label: "Burstone分析法", key: "Burstone" },
    { label: "Jarabak分析法", key: "Jarabak" },
    { label: "Tweed分析法", key: "Tweed" },
    { label: "九院分析法", key: "SH9Hospital" },
    { label: "李博分析法", key: "DoctorLee" },
]

function Aside() {
    const { algorithmWay } = useSelector((state: RootState) => state.algorithm)
    const dispatch = useDispatch()

    function handleMenuClick(e: any) {
        const target = menuList.find(item => item.key === e?.key)
        dispatch(setAlgorithm(target))
    }

    return (
        <ScAside>
            <ScH2>
                分析数据
                <Dropdown
                    menu={{
                        items: menuList,
                        selectable: true,
                        defaultSelectedKeys: ["WestChina"],
                        onClick: handleMenuClick,
                    }}
                    trigger={["click"]}
                    arrow={{ pointAtCenter: true }}
                    placement="bottomRight"
                >
                    <span>{algorithmWay.label} <DownOutlined /></span>
                </Dropdown>
            </ScH2>
            <AsideTable />
            <AiPicture />
        </ScAside>
    )
}

export default Aside
