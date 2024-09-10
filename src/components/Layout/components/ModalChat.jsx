import { FloatButton } from "antd"
import ListIcons from "src/components/ListIcons"
import logo from '/logo.png'
import { AiOutlineMinus } from "react-icons/ai"
import { useEffect, useState } from "react"
import { ChatBoxContainerStyled } from "../styled"
import InputCustom from "src/components/InputCustom"
import { BiSolidSend } from "react-icons/bi"
import SpinCustom from "src/components/SpinCustom"
import MessageService from "src/services/MessageService"
import socket from "src/utils/socket"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import ChatBox from "src/components/ChatBox"
import { ADMIN_ID } from "src/lib/constant"
import NotificationService from "src/services/NotificationService"

const ModalChat = () => {

  const { user } = useSelector(globalSelector)
  const [openChatBox, setOpenChatBox] = useState(false)
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
      const res = await MessageService.getChatWithUser({
        Receiver: ADMIN_ID
      })
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


  const handleSendMessage = async () => {
    try {
      setLoading(true)
      const bodyMessage = {
        Content: content,
        ChatID: !!chat ? chat?._id : undefined
      }
      const resMessage = MessageService.createMessage(bodyMessage)
      const bodyNotification = {
        Content: `${user?.FullName} gửi đã tin nhắn cho bạn`,
        Type: "inbox",
        Receiver: ADMIN_ID
      }
      const resNotification = NotificationService.createNotification(bodyNotification)
      const result = await Promise.all([resMessage, resNotification])
      if (result[0]?.isError || result[1]?.isError) return
      socket.emit("send-message", {
        ...bodyMessage,
        Receiver: ADMIN_ID,
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
          Receiver: ADMIN_ID,
          createdAt: result[1]?.data?.createdAt
        })
      setMessages(pre => [
        ...pre,
        {
          ...bodyMessage,
          Receiver: ADMIN_ID,
          Sender: {
            _id: user?._id,
            FullName: user?.FullName,
            AvatarPath: user?.AvatarPath
          },
          createdAt: Date.now
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    socket.on("get-message", data => {
      setMessages(pre => [
        ...pre,
        data
      ])
    })
  }, [])

  return (
    <FloatButton.Group
      open={openChatBox}
      trigger="click"
      type="primary"
      onClick={() => setOpenChatBox(!openChatBox)}
      icon={ListIcons.ICON_CHAT_DOT}
      style={{
        position: 'fixed',
        zIndex: 1000
      }}
    >
      <SpinCustom spinning={loading}>
        <ChatBoxContainerStyled>
          <div className="header d-flex-sb">
            <img
              className="cursor-pointer"
              src={logo}
              alt=""
              style={{ width: '20px', height: "30px" }}
            />
            <AiOutlineMinus
              onClick={() => setOpenChatBox(false)}
              className="cursor-pointer"
            />
          </div>
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
        </ChatBoxContainerStyled>
      </SpinCustom>
    </FloatButton.Group>
  )
}

export default ModalChat
