import { useEffect, useState } from "react"
import { Col, Form, Row } from "antd"
import { LoginContainerStyled } from "./styled"
import { Link, useNavigate } from "react-router-dom"
import { getRegexEmail } from "src/lib/stringUtils"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { useGoogleLogin } from "@react-oauth/google"
import UserService from "src/services/UserService"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import globalSlice from "src/redux/globalSlice"
import SpinCustom from "src/components/SpinCustom"
import { decodeData } from "src/lib/commonFunction"
import { globalSelector } from "src/redux/selector"
import Router from "src/routers"

const LoginPage = () => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLogin } = useSelector(globalSelector)

  const loginByGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true)
        const userInfor = await UserService.getInforByGoogleLogin(tokenResponse?.access_token)
        const res = await UserService.loginByGoogle(userInfor?.data)
        if (!!res?.isError) return toast.error(res?.msg)
        const tokenInfor = decodeData(res?.data)
        if (!!tokenInfor.ID) {
          dispatch(globalSlice.actions.setIsCheckAuth(true))
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
      if (!!res?.isError) return toast.error(res?.msg)
      const tokenInfor = decodeData(res?.data)
      if (!!tokenInfor.ID) {
        dispatch(globalSlice.actions.setIsCheckAuth(true))
      } else {
        navigate('/forbidden')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!isLogin) navigate("/")
  }, [])

  return (
    <SpinCustom spinning={loading}>
      <LoginContainerStyled>
        <Form form={form}>
          <Row>
            <Col span={24}>
              <div className="center-text fw-600 fs-25 mb-8">Đăng nhập</div>
              <div className="center-text mb-12">
                <span className="mr-4 mb-8 fs-16">Người dùng mới?</span>
                <span
                  className="fs-16 primary-text cursor-pointer"
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
            <Col
              className="d-flex-center"
              span={24}
              style={{
                marginTop: "-12px",
                marginBottom: "12px"
              }}>
              <Link to={Router.FORGOT_PASSWORD}>Quên mật khẩu?</Link>
            </Col>
            <Col span={24}>
              <ButtonCustom
                className="primary submit-btn fs-18 mb-16"
                htmlType="submit"
                onClick={() => loginByForm()}
                id="login"
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
    </SpinCustom>
  )
}

export default LoginPage