import ModalCustom from "src/components/ModalCustom"

const PreviewVideo = ({ open, onCancel }) => {

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Video giới thiệu"
      footer={null}
      width="60vw"
    >
      <video src={open} controls autoPlay />
    </ModalCustom>
  )
}

export default PreviewVideo