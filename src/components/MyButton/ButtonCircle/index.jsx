import { Tooltip } from "antd"
import { ButtonCicleStyled } from "./styled"
import "../style.scss"

const ButtonCircle = (props) => {

  return (
    <Tooltip
      title={props?.title}
      arrow={false}
    >
      <ButtonCicleStyled
        {...props}
      >
        {props?.children}
      </ButtonCicleStyled>
    </Tooltip>
  )
}

export default ButtonCircle