import { Badge } from "antd"
import styled from "styled-components"

export const LayoutStyled = styled.div`
height: 100vh;
display: flex;
flex-direction: column;
justify-content: space-between;
`

export const ContentContainerStyled = styled.div`
 /* background-color: #dff3fe; */
`

export const ContentStyled = styled.div`
  width: ${props => props.ismeetingscreen ? "100%" : "80%"};
  margin: auto;
`

export const FooterStyled = styled.div`
  /* width: 80%;
  margin: auto; */
  /* box-shadow: rgba(0, 0, 0, 0.45) -20px 25px 20px 0px; */
  background-image: linear-gradient(90deg,rgba(27,177,148,.036),rgba(29,183,194,.036) 101.24%);
`
export const HeaderContainerStyled = styled.div`
  min-height: 64px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`

export const HeaderStyled = styled.div`
  max-width: 95%;
  margin: auto;
 .ant-menu-horizontal {
    border-bottom: none !important;
  }
`

export const BadgeStyled = styled(Badge)`
  .ant-badge,
  .ant-badge-count {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(0%, -40%);
    transform-origin: 100% 0%;
  }
`

export const FooterContainer = styled.div`
 width: 80%;
  margin: auto;
  padding: 50px 20px;
  background-color: #ffffff;
`
export const ChatBoxContainerStyled = styled.div`
  border-top-right-radius: 8px;
  background-color: white;
  border-top-left-radius: 8px;
  min-width: 450px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 8px 12px;
  position: absolute;
  right: 0;
  bottom: 0;
  .header {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--color-border-matte);
  }
  .messages {
    height: 400px;
  }
`
