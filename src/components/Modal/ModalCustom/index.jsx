import { CustomStyledModal } from "./styled"


const ModalCustom = ({ footer = null, ...props }) => {

  return (
    <CustomStyledModal footer={footer} {...props}>
      {props.children}
    </CustomStyledModal>
  )
}

export default ModalCustom