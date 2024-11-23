import { Form, Space } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { globalSelector } from "src/redux/selector"
import ConfirmService from "src/services/ConfirmService"
import NotificationService from "src/services/NotificationService"
import socket from "src/utils/socket"

const ModalReasonReject = ({ open, onCancel, onOk }) => {

  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { user } = useSelector(globalSelector)

  const changeConfirmStatus = async () => {
    try {
      setLoading(true)
      const resNotiffication = await NotificationService.createNotification({
        Content: `Giáo viên ${user?.FullName} đã hủy xác nhận booking của bạn`,
        Type: "lich-su-booking",
        Receiver: open?.Sender?._id
      })
      if (!!resNotiffication?.isError) return toast.error(res?.msg)
      socket.emit('send-notification',
        {
          Content: resNotiffication?.data?.Content,
          IsSeen: resNotiffication?.IsSeen,
          _id: resNotiffication?.data?._id,
          Type: resNotiffication?.data?.Type,
          IsNew: resNotiffication?.data?.IsNew,
          Receiver: resNotiffication?.data?.Receiver,
          createdAt: resNotiffication?.data?.createdAt
        })
      const values = await form.validateFields()
      const res = await ConfirmService.changeConfirmStatus({
        ConfirmID: open?._id,
        ConfirmStatus: 3,
        Recevier: open?.Receiver,
        RecevierName: user?.FullName,
        SenderName: open?.Sender?.FullName,
        SenderEmail: open?.Sender?.Email,
        Reason: values?.Reason
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      onCancel()
      onOk()
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
            onClick={() => changeConfirmStatus()}
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