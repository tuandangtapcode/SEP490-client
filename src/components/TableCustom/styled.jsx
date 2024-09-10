import styled, { css, keyframes } from "styled-components"

export const MainTableHeader = styled.div`
  font-size: 13px !important;
`

export const SubTableHeader = styled.div`
  font-style: italic;
  font-size: 13px !important;
  font-weight: 400;
`
export const MainTableData = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
`

export const SubTableData = styled.span`
  font-style: italic;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
`

export const CellListContent = styled.div`
  padding: 4px;
  border-bottom: 1px solid #f0f0f0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  margin: 0 -4px;
  &:hover {
    border-bottom: 1px solid #ddd;
  }
  &:last-child {
    border-bottom: unset;
  }
`
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const colorChangeAnimation = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
`

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`


export const TableCustomStyled = styled.div`
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: ${props => (props.isPrimary ? "var(--color-primary-hover)" : "#E4EFFE")};
    /* animation: ${colorChangeAnimation} 1s ease infinite, ${gradientAnimation} 5s ease infinite; */
  }

  .ant-table-column-sorter-inner {
    svg path {
      fill: rgba(243, 246, 249, 0.5); 
    }
    .active {
      svg path {
        fill: #fff;
      }
    }
  }

  .ant-table-wrapper,
  .ant-table,
  .ant-table-container {
    &::-webkit-scrollbar,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      background-color: transparent !important;
    }
  }

  .ant-table-sticky-scroll {
    display: none;
  }

  .ant-spin-nested-loading {
    /* height: 100%; */
  }

  .ant-table-thead {
    .ant-table-cell {
      background: ${props => (props.isPrimary ? "var(--color-primary-hover)" : "#E4EFFE")};
      background-size: 200%;
      color: ${props => (props.isPrimary ? "#fff" : "#212529")};
      font-size: 14px;
      /* animation: ${slideInRight} 1s ease; */
      .anticon,
      .anticon {
        svg path {
          fill: ${props => (props.isPrimary ? "#fff" : "#212529")};
        }
      }
    }
  }

  .ant-table-tbody > tr {
    /* animation: ${fadeIn} 0.5s ease-in-out; */
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > thead
    > tr
    > th {
    border-right: 1px solid #f0f0f0;
  }

  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 4px;
  }

  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 4px;
  }

  .ant-table-thead > tr > th {
    text-align: center;
    padding: 4px 8px;
  }

  .ant-table-cell-fix-right-first::after {
    border-inline-end: unset !important;
  }

  .ant-table-body {
    overflow: auto auto !important;
    transition: all linear 0.2s;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c5ced9;
      border-radius: 12px;
    }
  }

  .ant-table-body {
    &::-webkit-scrollbar {
    }

    &::-webkit-scrollbar-track {
    }

    &::-webkit-scrollbar-thumb {
    }
  }

  .ant-table-body:hover {
    &::-webkit-scrollbar {
      background-color: #fff !important;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd !important;
    }
  }

  .ant-table-cell-scrollbar:not([rowspan]) {
    box-shadow: none;
  }

  td.ant-table-cell {
    padding: 8px !important;
  }

  td.ant-table-cell.ant-table-selection-column {
    padding: 0 !important;
  }

  .ant-table-placeholder {
    .ant-table-cell {
    }
  }

  .ant-table-row-level-0:hover {
    .float-action__wrapper {
      display: inline-flex;
    }
  }

  .ant-table-tbody > tr:hover {
    .float-action__wrapper {
      min-width: 80px;
      display: inline-flex;
    }
  }

  .ant-table-expanded-row-fixed {
    margin: 0px !important;
    padding: 0px !important;
    width: auto !important;
    ::after {
      border-right: 0px !important;
    }
  }
`