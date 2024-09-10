import { Form } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getRegexPassowrd } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import UserService from "src/services/UserService"
import styled from "styled-components"

const AccountUserWrapper = styled.div`
  width: 40%;
  margin: auto;
  margin-top: 20px;
`

export const DotStyled = styled.img`
width: 5px;
height: 5px;
background-color: white;
display: inline-block;
border-radius: 50%;
margin-left: 6px;
margin-right: 6px;
margin-top: 10px;
`

const AccountUser = () => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(globalSelector)
  const navigate = useNavigate()

  const handleChangePassword = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.changePassword({
        OldPassword: values?.OldPassword,
        NewPassword: values?.NewPassword
      })
      if (res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!user?.IsByGoogle) navigate("/")
  }, [])

  return (
    <AccountUserWrapper>
      <div className="fs-20 fw-700 mb-20 center-text">Thay đổi mật khẩu</div>
      <Form form={form} layout="vertical">
        <Form.Item
          name="OldPassword"
          label="Mật khẩu cũ"
          rules={[
            { required: true, message: "Hãy nhập vào mật khẩu cũ của bạn" },
          ]}
        >
          <InputCustom type="isPassword" />
        </Form.Item>
        <Form.Item
          name="NewPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Hãy nhập vào mật khẩu mới của bạn" },
            { pattern: getRegexPassowrd(), message: "Mật khẩu sai định dạng" }
          ]}
        >
          <InputCustom type="isPassword" />
        </Form.Item>
        <div style={{ marginTop: "-12px", marginBottom: "16px" }}>
          <p className="gray-text">
            <DotStyled />
            Ký tự đầu tiên phải là một chữ cái in hoa (A-Z)
          </p>
          <p className="gray-text">
            <DotStyled />
            Các ký tự tiếp theo có thể là chữ cái (in hoa hoặc in thường) hoặc chữ số (0-9)
          </p>
          <p className="gray-text">
            <DotStyled />
            Ít nhất 5 ký tự
          </p>
        </div>
        <Form.Item
          name="ConfirmPassword"
          label="Nhập lại mật khẩu mới"
          rules={[
            { required: true, message: "Hãy xác nhận lại mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const newPassword = getFieldValue("NewPassword")
                if (!value || value === newPassword) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu nhập lại phải giống với mật khẩu mới!'))
              }
            })
          ]}
        >
          <InputCustom type="isPassword" />
        </Form.Item>
      </Form>
      <ButtonCustom
        className="primary submit-btn mt-12"
        onClick={() => handleChangePassword()}
        loading={loading}
      >
        Lưu lại
      </ButtonCustom>
    </AccountUserWrapper>
  )
}

export default AccountUser