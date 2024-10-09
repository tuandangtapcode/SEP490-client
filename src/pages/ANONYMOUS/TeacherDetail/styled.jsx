import { Card } from "antd"
import styled from "styled-components"

export const MainProfileWrapper = styled.div`
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 12px;
  .ant-menu {
    padding: 6px;
    margin-top: 30px;
    border: 1px solid var(--color-border-matte);
    border-radius: 12px;
  }
`

export const DivTimeContainer = styled.div`
  border: 1px solid var(--color-border-matte);
  padding: 8px;
  border-radius: 8px;
`

export const VideoItemStyled = styled.div`
 padding: 20px 16px;
 border-radius: 8px;
 cursor: pointer;
`

export const CardStyled = styled(Card)`
position: relative;
background-color: transparent;
border-color: transparent;
.ant-card-body {
  margin-top: 20px;
  padding: 0;
}

.icon-play {
  display: none;
}
&:hover .icon-play {
  display: block;
  animation: iconFadeIn ease 0.5s;
}
`