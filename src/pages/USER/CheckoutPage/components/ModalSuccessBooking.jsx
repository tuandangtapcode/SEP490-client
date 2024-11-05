import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"
import ModalCustom from "src/components/ModalCustom"

const ModalSuccessBooking = ({ open, onCancel }) => {

  const navigate = useNavigate()

  return (
    <ModalCustom
      open={open}
      closable
      onCancel={onCancel}
      footer={null}
    >
      <Result
        status="success"
        title={`Bạn đã book giáo viên ${open?.FullName} thành công`}
        subTitle="Cảm ơn bạn vì đã sử dụng dịch vụ của chúng tôi. Mọi thắc mắc hay phản ánh gì về chất lượng dịch vụ hoặc giáo viên hãy liên hệ trực tiếp với quản trị viên. Chúc bạn có những trải nghiệm học thật tuyệt vời"
        extra={[
          <Button
            key={1}
            type="primary"
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
        ]}
      />
    </ModalCustom>
  )
}

export default ModalSuccessBooking