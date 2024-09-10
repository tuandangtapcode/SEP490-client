import { useGoogleLogin } from "@react-oauth/google"
import { Col, Form, Radio } from "antd"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getRegexEmail } from "src/lib/stringUtils"
import UserService from "src/services/UserService"

const FormInfor = ({
  form,
  data,
  setData,
  current,
  setCurrent,
  loading
}) => {

  const validateByForm = async () => {
    const values = await form.validateFields()
    setData({ ...values, IsByGoogle: false })
    setCurrent(current + 1)
  }

  const validateByGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfor = await UserService.getInforByGoogleLogin(tokenResponse?.access_token)
      if (!!userInfor) {
        const dataFormGoogle = userInfor?.data
        const { email_verified, name, sub, ...remainUserInfor } = dataFormGoogle
        setData(pre => ({ ...pre, ...remainUserInfor, IsByGoogle: true }))
        setCurrent(current + 1)
      } else {
        return toast.error("Have something error")
      }
    },
  })

  return (
    <>
      <Col span={24}>
        <div className="center-text fs-16 mb-12">Điền thông tin của bạn</div>
      </Col>
      <Col span={24}>
        <Form.Item
          name="FullName"
          rules={[
            { required: !!data?.IsByGoogle ? false : true, message: "Hãy nhập vào tên của bạn" },
          ]}
        >
          <InputCustom
            onChange={e => setData(pre => ({ ...pre, FullName: e.target.value }))}
            placeholder="Họ và tên"
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name="Email"
          rules={[
            { required: !!data?.IsByGoogle ? false : true, message: "Hãy nhập vào email của bạn" },
            { pattern: getRegexEmail(), message: "Email sai định dạng" }
          ]}
        >
          <InputCustom
            onChange={e => setData(pre => ({ ...pre, Email: e.target.value }))}
            placeholder="Email"
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <ButtonCustom
          className="primary submit-btn fs-18"
          htmlType="submit"
          onClick={() => validateByForm()}
          loading={loading}
        >
          {
            data?.RoleID === 4
              ? "Đăng ký"
              : "Tiếp theo"
          }
        </ButtonCustom>
      </Col>
      <Col span={24}>
        <div className="center-text  gray-text fs-20 mt-10 mb-10">
          OR
        </div>
      </Col>
      <Col span={24}>
        <ButtonCustom
          className="d-flex-center login-google mb-15"
          onClick={() => {
            validateByGoogle()
          }}
        >
          <span className="icon-google"></span>
          <span className="ml-12">Sign up with Google</span>
        </ButtonCustom>
      </Col>
    </>
  )
}

export default FormInfor