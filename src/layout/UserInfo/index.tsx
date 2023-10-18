import { Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"
import React from "react"
import styled from "styled-components"

const ScAside = styled.aside`
    width: 140px;
    height: 100%;
    background-color: var(--color-aside-bgColor);
    color: #fff;
    padding: 40px 0 0;
    min-width: 120px;
    box-shadow: 0 0 4px #363636;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
`

const ScUserInfo = styled.div`
    margin: 20px 0;

    .username {
        font-size: 36px;
        font-weight: 700;
    }

    .info {
        font-size: 16px;
        margin-top: 20px;
    }
`

interface IProps {
    src?: string
    username?: string
    age?: number
    sex?: string
}

const UserInfo: React.FC<IProps> = ({ src, username, age, sex }) => {
    return (
        <ScAside>
            <Avatar size={80} src={src} icon={!src && <UserOutlined />} />
            <ScUserInfo>
                <p className="username"> {username ?? "用户名"} </p>
                <p className="info"> {sex ?? "性别"} , {age ?? "18"} 岁 </p>
            </ScUserInfo>
        </ScAside>
    )
}

export default UserInfo