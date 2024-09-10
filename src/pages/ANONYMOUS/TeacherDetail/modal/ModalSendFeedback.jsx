import { Col, Form, Rate, Row, Space } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { globalSelector } from "src/redux/selector"
import CommentService from "src/services/CommentService"
import socket from "src/utils/socket"

const ModalSendFeedback = ({ open, onCancel }) => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(globalSelector)

  const handleSendComment = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await CommentService.createComment({
        ...values,
        Teacher: !!open?.Teacher?._id ? open?.Teacher?._id : open?._id
      })
      if (res?.isError) return
      socket.emit("send-comment", {
        ...values,
        User: {
          FullName: user?.FullName,
          AvatarPath: user?.AvatarPath
        },
        RoomID: open?._id,
        createdAt: Date.now
      })
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
        <div className="d-flex-end">
          <Space>
            <ButtonCustom
              className="third"
              onClick={() => onCancel()}
            >
              Đóng
            </ButtonCustom>
            <ButtonCustom
              className="primary"
              loading={loading}
              onClick={() => handleSendComment()}
            >
              Gửi
            </ButtonCustom>
          </Space>
        </div>
      }
    >
      <Form form={form}>
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
