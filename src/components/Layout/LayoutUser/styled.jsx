import styled from "styled-components"

export const LayoutUserStyled = styled.div`
height: 100vh;
display: flex;
flex-direction: column;
overflow: hidden;
.menu-container {
  margin-right: 12px;
  border-color: none;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-container {
  padding: 12px;
  overflow-y: auto; 
  height: calc(100vh - 64px);
  &::-webkit-scrollbar {
    margin-left: 30px;
    width: 13px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #a19e9e;
  }
}
.collapsed-menu {
  padding: 12px 20px;
}
.ant-menu-light.ant-menu-root.ant-menu-inline {
  border-inline-end: none !important
}
`