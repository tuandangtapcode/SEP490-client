import { Form, Space } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { Roles } from "src/lib/constant"
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
      const values = await form.validateFields()
      const res = await ConfirmService.changeConfirmStatus({
        ConfirmID: open?._id,
        ConfirmStatus: 3,
        RecevierName: open?.Receiver?.FullName,
        RecevierEmail: open?.Receiver?.Email,
        SenderName: open?.Sender?.FullName,
        SenderEmail: open?.Sender?.Email,
        Reason: values?.Reason
      })
      if (!!res?.isError) return toast.error(res?.msg)
      const resNotiffication = await NotificationService.createNotification({
        Content: user?.RoleID === Roles.ROLE_TEACHER
          ? `Giáo viên ${user?.FullName} đã hủy xác nhận booking của bạn`
          : `Học sinh ${user?.FullName} đã hủy booking`,
        Type: "lich-su-booking",
        Receiver: user?.RoleID === Roles.ROLE_TEACHER
          ? open?.Sender?._id
          : open?.Receiver?._id
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
      toast.success(res?.msg)
      socket.emit("send-noted-confirm", {
        ...res?.data,
        RoleID: user?.RoleID,
        IsNoted: false
      })
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
      title={
        user?.RoleID === Roles.ROLE_STUDENT
          ? "Lý do hủy"
          : "Lý do khong duyệt"
      }
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
          <InputCustom
            placeholder={
              user?.RoleID === Roles.ROLE_STUDENT
                ? "Nhập vào lý do hủy"
                : "Nhập vào lý do khong duyệt"
            }
          />
        </Form.Item>
      </Form>
    </ModalCustom>
  )
}

export default ModalReasonReject