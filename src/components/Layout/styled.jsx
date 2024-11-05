import { Badge } from "antd"
import styled from "styled-components"
import BackGroundImage from "/background.jpg"

export const LayoutStyled = styled.div`
height: 100vh;
display: flex;
flex-direction: column;
justify-content: space-between;
`

export const ContentContainerStyled = styled.div`
 /* background-color: #dff3fe; */
 flex-grow: 1;
`

export const ContentStyled = styled.div`
  width: ${props => props.isFullScreen ? "100%" : "80%"};
  margin: auto;
`

export const HeaderContainerStyled = styled.div`
  box-shadow: rgba(183, 189, 195, 0.2) 0px 8px 24px;
  background-image: ${props => props.isHome ? `url(${BackGroundImage})` : "none"};
  background-size: cover;
  height: ${props => props.isHome ? "850px" : "auto"};
  margin-bottom: 30px;
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
  background-color: #13253F;
  margin-top: 45px;
`
export const FooterStyled = styled.div`
  width: 80%;
  margin: auto;
  padding: 30px 20px;
`

export const ChatBoxContainerStyled = styled.div`
  border-top-right-radius: 8px;
  background-color: white;
  border-top-left-radius: 8px;
  min-width: 450px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 8px 12px;
  position: fixed; /* Chuyển từ absolute sang fixed */
  right: 20px; /* Thêm khoảng cách từ cạnh */
  bottom: 20px; /* Thêm khoảng cách từ đáy */
  z-index: 1000; /* Đảm bảo xuất hiện trên cùng */
  .header {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--color-border-matte);
  }
  .messages {
    height: 400px;
  }
;
`