import { ModalCustomStyled } from "./styled"


const ModalCustom = (props) => {

  return (
    <ModalCustomStyled
      {...props}
      centered={true}
    >
      {props?.children}
    </ModalCustomStyled>
  )
}

export default ModalCustom