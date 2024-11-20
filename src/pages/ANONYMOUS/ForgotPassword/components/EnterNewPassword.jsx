import { Col, Form, Row, Space } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import Router from "src/routers"
import UserService from "src/services/UserService"

const EnterNewPassword = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.forgotPassword({
        ...values,
        Step: 2
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      navigate(Router.DANG_NHAP)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form}>
      <Row>
        <Col span={24}>
          <div className="fw-600 fs-25 mb-24">Tìm tài khoản của bạn</div>
        </Col>
        <Col span={24} className="mb-16">
          <div className="fs-16">Vui lòng nhập email để tìm kiếm tài khoản của bạn.</div>
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
          <Space className="d-flex-end">
            <ButtonCustom
              className="primary"
              htmlType="submit"
              loading={loading}
              onClick={() => handleSubmit()}
            >
              Lưu
            </ButtonCustom>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default EnterNewPassword