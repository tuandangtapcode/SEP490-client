import styled from "styled-components"

export const PatentChildBorder = styled.div`
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
`
export const TabStyled = styled.div`
  .ant-tabs-nav {
    margin-bottom: 0;
    position: sticky;
    top: ${props => (!!props.isEdit ? "-12px" : 0)};
    background-color: #fff;
    z-index: 100;
  }
  .ant-tabs-nav {
    :before {
      border-bottom: 1px solid #ccc;
    }
  }
  .ant-tabs .ant-tabs-tab + .ant-tabs-tab {
    margin-left: 8px;
  }
  .ant-tabs-tab {
    border: 1px solid #ccc !important;
  }
  .ant-tabs-tab-active {
    border-bottom: none !important;
  }
`