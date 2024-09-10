import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "antd"
import { handleLogout } from "src/lib/commonFunction"
import ModalCustom from "src/components/ModalCustom"

const InactiveModal = ({ open, onCancel }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <ModalCustom
      open={open}
      onCancel={() => {
        handleLogout(open, dispatch, navigate)
        onCancel()
      }}
      title={<div className="text-center" > THÔNG BÁO</div>}
      width="40vw"
      footer={
        <div className="d-flex-end" >
          <Button
            className="greendBorder small"
            onClick={() => {
              handleLogout(open, dispatch, navigate)
              onCancel()
            }}
          >
            ĐÓNG
          </Button>
        </div>
      }
    >
      <p className="fs-18 fw-600">Tài khoản của bạn bị cấm vì vi phạm các điều khoản và quyền riêng tư!</p>
    </ModalCustom >
  )
}

export default InactiveModal
