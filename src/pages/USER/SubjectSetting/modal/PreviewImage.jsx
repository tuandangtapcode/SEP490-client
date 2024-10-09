import ModalCustom from "src/components/ModalCustom"

const PreviewImage = ({ open, onCancel }) => {
  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <img
        alt="example"
        style={{
          width: '100%',
        }}
        src={open}
      />
    </ModalCustom>
  )
}

export default PreviewImage