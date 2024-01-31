import { Divider, Modal, Button } from "antd"
import styled from "styled-components"

import type { ModalProps, DividerProps } from "antd"

const ScHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 35px;
    @media (max-width: 1980px) {
        gap: 10px;
    }
    @media (max-width: 1700px) {
        gap: 0;
    }

    &.interactive-wrapper {
        gap: 100px;
        flex: 1;
        @media (max-width: 1980px) {
            flex-wrap: wrap;
            gap: 0;
        }
    }
`

const ScHeaderAction = styled.div<{ $active?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    position: relative;
    background-color: ${({ $active }) => $active ? "#414141" : "unset"};
    padding: 15px 10px;
    border-radius: 8px;
    border: 1px solid ${({ $active }) => $active ? "#32393F" : "transparent"};
    min-width: 60px;
    box-sizing: border-box;

    @media (max-width: 1980px) {
        gap: 10px;
    }

    img {
        width: 30px;
        aspect-ratio: 1;
        @media (max-width: 1700px) {
            width: 20px;
        }
    }

    span {
        font-size: 14px;
        line-height: 14px;
        white-space: nowrap;

        @media (max-width: 1700px) {
            font-size: 12px;
        }
    }
`

const ScHeaderResetButton = styled.button`
    background-color: #2D3238;
    width: 80px;
    height: 40px;
    border-radius: 2px;
    padding: 0;
    margin-right: 10px;
    color: #fff;
    font-weight: 600;
    border: 1px solid #33393F;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    @media (max-width: 1700px) {
        width: 60px;
        height: 36px;
        font-size: 12px;
        gap: 3px;
    }

    img {
        width: 16px;
        @media (max-width: 1700px) {
            width: 13px;
        }
    }
`

const ScHeaderBtnContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    justify-content: flex-end;
`

const ScHeaderMeasureContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 1980px) {
        gap: 0px;
    }
    @media (max-width: 1710px) {
        justify-content: space-between;
    }
`

export {
    ScHeaderWrapper,
    ScHeaderAction,
    ScHeaderBtnContainer,
    ScHeaderMeasureContainer,
    ScHeaderResetButton,
}

const AntdScHeaderButton = styled(Button)<{ hasloading?: string }>`
    font-size: 14px;
    width: ${prop => prop.hasloading === "true" ? 90 : 70}px;
    height: 40px;
    background-color: #009DC7;
    border: unset;
    color: #fff;
    margin: 0;
    padding: 0;

    &.ant-btn.ant-btn-default:hover {
        color: inherit;
    }

    @media (max-width: 1700px) {
        width: 52.5px;
        height: 36px;
        font-size: 12px;
    }

    &.upload {
        width: 80px;
    }
`
const AntdScDivider = styled(Divider)`
    margin: 10px 0;
`

const AntdScModal = styled(Modal)<ModalProps>`
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

const AntdScMask = styled(Modal)<DividerProps>`
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
    AntdScHeaderButton,
    AntdScDivider,
    AntdScMask,
    AntdScModal,
}
