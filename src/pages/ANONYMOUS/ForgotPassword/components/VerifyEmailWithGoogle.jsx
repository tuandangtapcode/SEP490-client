import { useGoogleLogin } from "@react-oauth/google"
import { Col, Row } from "antd"
import { toast } from "react-toastify"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import UserService from "src/services/UserService"

const VerifyEmailWithGoogle = ({ email, setCurrent }) => {

  const loginByGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfor = await UserService.getInforByGoogleLogin(tokenResponse?.access_token)
        if (userInfor?.data?.email !== email) {
          toast.error("Tài khoản email không khớp")
        } else {
          setCurrent(2)
        }
      } finally {
        console.log()
      }
    },
    onError: (error) => {
      toast.error("error:", error.toString())
    }
  })

  return (
    <Row>
      <Col span={24}>
        <div className="fw-600 fs-25 mb-24">Xác thực với Google</div>
      </Col>
      <Col span={24} className="mb-16">
        <div className="fs-16">Vui lòng đăng nhập với tài khoản Google.</div>
        <div>{email}</div>
      </Col>
      <Col span={24} className="d-flex-end">
        <ButtonCustom
          className="primary"
          onClick={() => loginByGoogle()}
        >
          Tiếp tục
        </ButtonCustom>
      </Col>
    </Row >
  )
}

export default VerifyEmailWithGoogle