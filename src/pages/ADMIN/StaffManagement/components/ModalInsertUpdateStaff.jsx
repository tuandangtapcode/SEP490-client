import { Col, Form, Row, Space } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getRegexEmail, getRegexPassowrd, getRegexPhoneNumber } from "src/lib/stringUtils"
import UserService from "src/services/UserService"

const ModalInsertUpdateStaff = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = !!open?._id
        ? await UserService.updateAccountStaff({
          FullName: values?.FullName,
          Phone: values?.Phone,
          UserID: open?._id
        })
        : await UserService.createAccountStaff(values)
      if (!!res?.isError) return
      toast.success(res?.msg)
      onOk()
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!open?._id) {
      form.setFieldsValue(open)
    }
  }, [open])

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title={!!open?._id ? "Chỉnh sửa tài khoản staff" : "Thêm mới tài khoản staff"}
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
            onClick={() => handleSubmit()}
          >
            Lưu
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
              <InputCustom
                placeholder="Email"
                disabled={!!open?._id ? true : false}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='Phone'
              rules={[
                { required: true, message: "Thông tin không được để trống" },
                { pattern: getRegexPhoneNumber(), message: "Số điện thoại sai định dạng" }
              ]}
            >
              <InputCustom placeholder="Số diện thoại" />
            </Form.Item>
          </Col>
          {
            !open?._id &&
            <Col span={24}>
              <Form.Item
                name="Password"
                rules={[
                  { required: true, message: "Hãy nhập vào mật khẩu mới của bạn" },
                  { pattern: getRegexPassowrd(), message: "Mật khẩu sai định dạng" }
                ]}
              >
                <InputCustom type="isPassword" placeholder="Mật khẩu" />
              </Form.Item>
            </Col>
          }
        </Row>
      </Form>
    </ModalCustom>
  )
}

export default ModalInsertUpdateStaff