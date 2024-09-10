import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ChatBox from "src/components/ChatBox"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import { ChatBoxWrapper } from "src/pages/ADMIN/InboxManagement/styled"
import { globalSelector } from "src/redux/selector"
import MessageService from "src/services/MessageService"
import socket from "src/utils/socket"
import { BiSolidSend } from "react-icons/bi"
import NotificationService from "src/services/NotificationService"

const ModalSendMessage = ({ open, onCancel, onOk }) => {

  const { user } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)
  const [chat, setChat] = useState()
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [content, setContent] = useState("")
  const [pagination, setPagination] = useState({
    PageSize: 7,
    CurrentPage: 1,
  })

  const getChat = async () => {
    try {
      setLoading(true)
      const res = await MessageService.getChatWithUser({ Receiver: open?._id })
      if (res?.isError) return
      setChat(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const getListMessages = async () => {
    try {
      setLoading(true)
      const res = await MessageService.getMessageByChat({
        ...pagination,
        ChatID: !!chat ? chat?._id : undefined
      })
      if (res?.isError) return
      setMessages(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getChat()
  }, [])

  useEffect(() => {
    if (!!chat) {
      getListMessages()
    }
  }, [pagination, chat])

  useEffect(() => {
    if (!!chat) {
      socket.emit("join-room", chat?._id)
    }
  }, [chat])

  const handleSendMessage = async () => {
    try {
      setLoading(true)
      const bodyMessage = {
        Content: content,
        ChatID: !!chat ? chat?._id : undefined,
        Receiver: open?._id
      }
      const resMessage = MessageService.createMessage(bodyMessage)
      const bodyNotification = {
        Content: `${user?.FullName} gửi đã tin nhắn cho bạn`,
        Type: "hop-thu-den",
        Receiver: open?._id
      }
      const resNotification = NotificationService.createNotification(bodyNotification)
      const result = await Promise.all([resMessage, resNotification])
      if (result[0]?.isError || result[1]?.isError) return
      socket.emit("send-message", {
        ...bodyMessage,
        Receiver: open?._id,
        Sender: {
          _id: user?._id,
          FullName: user?.FullName,
          AvatarPath: user?.AvatarPath
        },
        createdAt: Date.now
      })
      socket.emit('send-notification',
        {
          Content: result[1]?.data?.Content,
          IsSeen: result[1]?.IsSeen,
          _id: result[1]?.data?._id,
          Type: result[1]?.data?.Type,
          IsNew: result[1]?.data?.IsNew,
          Receiver: open?._id,
          createdAt: result[1]?.data?.createdAt
        })
      setMessages([...messages, {
        ...bodyMessage,
        Sender: {
          _id: user?._id,
          FullName: user?.FullName,
          AvatarPath: user?.AvatarPath
        },
        createdAt: Date.now
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title={
        <div className="d-flex">
          <img
            src={open?.AvatarPath}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "12px"
            }}
          />
          <div className="fw-600 fs-16">{open?.FullName}</div>
        </div>
      }
      footer={
        <div className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
        </div>
      }
    >
      <SpinCustom spinning={loading}>
        <ChatBoxWrapper>
          <div className="messages">
            <ChatBox
              messages={messages}
              total={total}
              setPagination={setPagination}
            />
          </div>
          <div className="input-message">
            <InputCustom
              placeholder="Nhập vào tin nhắn"
              value={content}
              onChange={e => setContent(e.target.value)}
              onPressEnter={() => {
                if (!!content) {
                  setContent("")
                  handleSendMessage()
                }
              }}
              suffix={
                <BiSolidSend
                  className="cursor-pointer"
                  onClick={() => {
                    if (!!content) {
                      setContent("")
                      handleSendMessage()
                    }
                  }}
                  color="#106ebe"
                />
              }
            />
          </div>
        </ChatBoxWrapper>
      </SpinCustom>
    </ModalCustom>
  )
}

export default ModalSendMessage