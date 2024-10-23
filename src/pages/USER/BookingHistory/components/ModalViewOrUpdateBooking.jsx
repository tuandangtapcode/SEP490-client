import ModalCustom from "src/components/ModalCustom"

const ModalViewOrUpdateBooking = ({ open, onCancel }) => {



  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
    // title={!!open?.isUpdate ?}
    >

    </ModalCustom>
  )
}

export default ModalViewOrUpdateBooking