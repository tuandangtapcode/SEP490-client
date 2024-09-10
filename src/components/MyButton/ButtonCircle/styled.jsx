import { Button } from "antd"
import styled from "styled-components"

export const ButtonCicleStyled = styled(Button)`
  border-radius: 50% !important;
  border-color: transparent !important;
  padding: ${props =>
    !!props.bigsize
      ? "20px"
      : !!props.mediumsize
        ? "18px"
        : ""
  } !important;
`