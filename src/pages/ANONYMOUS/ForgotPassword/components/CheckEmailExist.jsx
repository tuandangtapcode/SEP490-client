import { Col, Form, Row, Space } from "antd"
import { useState } from "react"
import { Router, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getRegexEmail } from "src/lib/stringUtils"
import UserService from "src/services/UserService"

const CheckEmailExist = ({ setCurrent, setEmail }) => {

  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.forgotPassword({
        ...values,
        Step: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      if (!!res?.data?.Email) {
        setCurrent(1)
        setEmail(res?.data?.Email)
      }
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
          <Space className="d-flex-end">
            <ButtonCustom
              className="third"
              onClick={() => navigate(`${Router.DANG_NHAP}`)}
            >
              Hủy
            </ButtonCustom>
            <ButtonCustom
              className="primary"
              htmlType="submit"
              loading={loading}
              onClick={() => handleSubmit()}
            >
              Tìm kiếm
            </ButtonCustom>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default CheckEmailExist