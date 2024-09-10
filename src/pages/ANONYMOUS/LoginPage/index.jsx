import { useEffect, useState } from "react"
import { Col, Form, Row } from "antd"
import { LoginContainerStyled } from "./styled"
import { useNavigate } from "react-router-dom"
import { getRegexEmail } from "src/lib/stringUtils"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { useGoogleLogin } from "@react-oauth/google"
import UserService from "src/services/UserService"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import globalSlice from "src/redux/globalSlice"
import { decodeData, getCookie } from "src/lib/commonFunction"
import socket from "src/utils/socket"

const LoginPage = () => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLogin = getCookie("token")

  const loginByGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfor = await UserService.getInforByGoogleLogin(tokenResponse?.access_token)
        const res = await UserService.loginByGoogle(userInfor?.data)
        if (res?.isError) return toast.error(res?.msg)
        const user = decodeData(res?.data)
        if (!!user.ID) {
          getDetailProfile(res?.data)
        } else {
          navigate('/forbidden')
        }
      } finally {
        setLoading(false)
      }
    },
  })

  const loginByForm = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.login(values)
      if (res?.isError) return toast.error(res?.msg)
      const user = decodeData(res?.data)
      if (!!user.ID) {
        getDetailProfile(res?.data)
      } else {
        navigate('/forbidden')
      }
    } finally {
      setLoading(false)
    }
  }

  const getDetailProfile = async (token) => {
    try {
      setLoading(true)
      const res = await UserService.getDetailProfile(token)
      if (res?.isError) return toast.error(res?.msg)
      dispatch(globalSlice.actions.setUser(res?.data))
      socket.connect()
      socket.emit("add-user-online", res?.data?._id)
      if (res?.data?.RoleID === 1) {
        navigate("/dashboard")
      } else {
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!isLogin) navigate("/")
  }, [])

  return (
    <LoginContainerStyled>
      <Form form={form}>
        <Row>
          <Col span={24}>
            <div className="center-text fw-600 fs-25 mb-8">Đăng nhập</div>
            <div className="center-text mb-12">
              <span className="mr-4 mb-8 fs-16">Người dùng mới?</span>
              <span
                className="fs-16 blue-text cursor-pointer"
                onClick={() => navigate("/dang-ky")}
              >
                Tạo tài khoản mới
              </span>
            </div>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Email"
              rules={[
                { required: true, message: "Hãy nhập vào email của bạn" },
                { pattern: getRegexEmail(), message: "Email sai định dạng" }
              ]}
            >
              <InputCustom
                placeholder="Email"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Password"
              rules={[
                { required: true, message: "Hãy nhập vào mật khẩu của bạn" },
              ]}
            >
              <InputCustom
                type="isPassword"
                placeholder="Mật khẩu"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <ButtonCustom
              className="primary submit-btn fs-18 mb-16"
              htmlType="submit"
              onClick={() => loginByForm()}
              loading={loading}
            >
              Đăng nhập
            </ButtonCustom>
          </Col>
          <Col span={24}>
            <ButtonCustom
              className="d-flex-center login-google mb-15"
              onClick={() => loginByGoogle()}
            >
              <span className="icon-google"></span>
              <span className="ml-12">Sign in with Google</span>
            </ButtonCustom>
          </Col>
        </Row>
      </Form>
    </LoginContainerStyled>
  )
}

export default LoginPage