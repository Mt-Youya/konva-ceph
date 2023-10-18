import { Empty } from "antd"
import styled from "styled-components"

const ScContainer = styled.div`
    height: 520px;
    margin-top: 20px;

`
const ScTable = styled.div`
    width: 100%;
    height: 520px;
`
const ScThead = styled.div`
    .thead-tr {
        border-bottom-color: #6b7885;
        color: #BFD8F3;
    }
`
const ScTbody = styled.div`
    height: calc(100% - 62px);
    overflow: auto;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #a8a8a8;
        cursor: pointer;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #6e6e6e;
    }
`
const ScTr = styled.div`
    text-align: left;
    font-size: 14px;
    line-height: 22px;
    display: grid;
    grid-template-columns: 220px 80px 80px auto;
    padding: 20px;
    border-bottom: 2px #33393F solid;
`
const ScSpace = styled.div`
    display: block;
`

const AntdScEmpty = styled(Empty)`
    .ant-empty-description {
        color: white;
    }
`

export {
    ScSpace,
    ScTr,
    ScTable,
    ScTbody,
    ScContainer,
    ScThead,
    AntdScEmpty,
}
