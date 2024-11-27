import { Col, Form, Row, Space } from "antd"
import { useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getRegexEmail } from "src/lib/stringUtils"
import UserService from "src/services/UserService"

const ModalInsertStaff = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const createAccountStaff = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.createAccountStaff(values)
      if (!!res?.isError) return
      toast.success(res?.msg)
      onOk()
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Thêm mới staff"
      width="30vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            loading={loading}
            onClick={() => createAccountStaff()}
          >
            Gửi
          </ButtonCustom>
        </Space>
      }
    >
      <Form form={form}>
        <Row gutter={[8]}>
          <Col span={24}>
            <Form.Item
              name="FullName"
              rules={[
                { required: true, message: "Hãy nhập vào tên của bạn" },
              ]}
            >
              <InputCustom placeholder="Họ và tên" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Email"
              rules={[
                { required: true, message: "Hãy nhập vào email của bạn" },
                { pattern: getRegexEmail(), message: "Email sai định dạng" }
              ]}
            >
              <InputCustom placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalCustom>
  )
}

export default ModalInsertStaff