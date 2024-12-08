import { Col, Form, Rate, Row, Space } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { globalSelector } from "src/redux/selector"
import FeedbackService from "src/services/FeedbackService"
import socket from "src/utils/socket"

const ModalSendFeedback = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(globalSelector)

  const handleSendFeedback = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await FeedbackService.createFeedback({
        ...values,
        Teacher: open?.Teacher?._id,
        LearnHistory: open?._id
      })
      if (!!res?.isError) return toast.error(res?.msg)
      socket.emit("send-feedback", {
        ...values,
        User: {
          FullName: user?.FullName,
          AvatarPath: user?.AvatarPath
        },
        RoomID: open?._id,
        createdAt: Date.now
      })
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
      title="Gửi đánh giá giáo viên"
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
            onClick={() => handleSendFeedback()}
          >
            Gửi
          </ButtonCustom>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item
              label="Vote cho giáo viên"
              name="Rate"
              rules={[
                { required: true, message: "Chọn số lượng sao vote cho giáo viên" }
              ]}
            >
              <Rate />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Viết nội dung đánh giá"
              name="Content"
              rules={[
                { required: true, message: "Viết nội dung đánh giá giáo viên" }
              ]}
            >
              <InputCustom type="isTextArea" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalCustom>
  )
}

export default ModalSendFeedback
