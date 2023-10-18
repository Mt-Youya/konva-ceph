import { Divider, Modal } from "antd"
import styled from "styled-components"

const ScHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const ScHeaderAction = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    position: relative;
    padding: 10px;

    &::after {
        z-index: 2;
        top: 0;
        border-radius: 10px;
        display: block;
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #2E436EFF;
        scale: 0;
        transition: scale ease-in-out .2s;
    }

    &:hover {

        &::after {
            scale: 1;
        }
    }

    img {
        z-index: 3;
        width: 30px;
        aspect-ratio: 1;
    }

    span {
        z-index: 3;
        font-size: 12px;
        line-height: 14px;
        display: flex;
        flex: 1;
    }
`

const ScHeaderResetButton = styled.button`
    background-color: #2D3238;
    width: 80px;
    height: 40px;
    border-radius: 2px;
    padding: 0;
    margin: 0;
    color: #fff;
    font-weight: 600;
    border: 1px solid #33393F;
    font-size: 14px;

    img {
        width: 16px;
        height: 20px;
    }
`

const ScHeaderNormalButton = styled.button`
    font-size: 14px;
    width: 120px;
    height: 40px;
    background-color: #009DC7;
    color: #fff;
    margin: 0;
    padding: 0;

    &.upload {
        width: 80px;
    }
`

export {
    ScHeaderWrapper,
    ScHeaderAction,
    ScHeaderResetButton,
    ScHeaderNormalButton,
}


const AntdScDivider = styled(Divider)`
    margin: 10px 0;
`
const AntdScModal = styled(Modal)`
    width: 520px;

    .ant-modal-content {
        padding: 30px;
    }

    .ant-modal-footer {
        direction: rtl;

        button {
            margin: 0;
            background-color: #0086CD;
            color: #fff;
        }
    }
`
const AntdScMask = styled(Modal)`
    .ant-modal-content {
        box-shadow: 0 0 20px #363636;
        background-color: #1f2327;
        width: 400px;
        height: 180px;
        border-radius: 10px;
        padding: 30px;
        color: #fff;

        .ant-modal-body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100%;
        }


        .ant-progress-text {
            color: #fff;
        }
    }

`

export {
    AntdScDivider,
    AntdScMask,
    AntdScModal
}