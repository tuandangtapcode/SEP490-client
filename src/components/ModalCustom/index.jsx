import { ModalCustomStyled } from "./styled"


const ModalCustom = (props) => {

  return (
    <ModalCustomStyled
      {...props}
    >
      {props?.children}
    </ModalCustomStyled>
  )
}

export default ModalCustom