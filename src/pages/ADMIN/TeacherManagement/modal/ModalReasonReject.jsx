import { Form, Space } from "antd"
import { useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import UserService from "src/services/UserService"

const ModalReasonReject = ({ open, onCancel, onOk, cancelModalDetail }) => {

  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleRejectRegister = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.responseConfirmRegister({
        FullName: open?.FullName,
        TeacherID: open?._id,
        RegisterStatus: 4,
        Email: open?.Account?.Email,
        Reason: values?.Reason
      })
      if (!!res?.isError) return toast.error(res?.msg)
      onOk()
      onCancel()
      if (!!open?.isModalDetail) {
        cancelModalDetail()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Lý do không duyệt"
      width="50vw"
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
            onClick={() => handleRejectRegister()}
          >
            Gửi
          </ButtonCustom>
        </Space>
      }
    >
      <Form form={form}>
        <Form.Item
          name='Reason'
          rules={[
            { required: true, message: "Thông tin không được để trống" },
          ]}
        >
          <InputCustom placeholder="Nhập vào lý do không duyệt" />
        </Form.Item>
      </Form>
    </ModalCustom>
  )
}

export default ModalReasonReject