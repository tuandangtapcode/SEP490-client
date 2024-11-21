import ModalCustom from "src/components/ModalCustom"
import BankInfor from "../../BankInfor"

const ModalBankInfor = ({ open, onCancel, setBankInfor }) => {
  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Thông tin thanh toán"
      width="50vw"
      footer={null}
    >
      <BankInfor setBankInfor={setBankInfor} isProfilePage={true} />
    </ModalCustom>
  )
}

export default ModalBankInfor