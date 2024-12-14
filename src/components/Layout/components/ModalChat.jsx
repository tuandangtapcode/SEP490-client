import { Col, FloatButton, Row } from "antd"
import ListIcons from "src/components/ListIcons"
import logo from '/logo.png'
import { AiOutlineMinus } from "react-icons/ai"
import { useEffect, useRef, useState } from "react"
import { ChatBoxContainerStyled } from "../styled"
import InputCustom from "src/components/InputCustom"
import { BiSolidSend } from "react-icons/bi"
import MessageService from "src/services/MessageService"
import socket from "src/utils/socket"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import ChatBox from "src/components/ChatBox"
import { STAFF_ID } from "src/lib/constant"
import NotificationService from "src/services/NotificationService"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"

const ModalChat = ({ open, onCancel }) => {

  const { user } = useSelector(globalSelector)
  const modalRef = useRef(null)
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
        Receiver: STAFF_ID
      })
      if (!!res?.isError) return toast.error(res?.msg)
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
      if (!!res?.isError) return toast.error(res?.msg)
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
        Receiver: STAFF_ID
      }
      const resNotification = NotificationService.createNotification(bodyNotification)
      const result = await Promise.all([resMessage, resNotification])
      if (!!result[0]?.isError || !!result[1]?.isError) return
      socket.emit("send-message", {
        ...bodyMessage,
        Receiver: STAFF_ID,
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
          Receiver: STAFF_ID,
          createdAt: result[1]?.data?.createdAt
        })
      setMessages(pre => [
        ...pre,
        {
          ...bodyMessage,
          Receiver: STAFF_ID,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onCancel])


  return (
    <FloatButton.Group
      open={open}
      trigger="click"
      type="primary"
      onClick={() => onCancel()}
      icon={ListIcons.ICON_ADMIN}
      tooltip="Liên hệ với quản trị viên"
    >
      <ChatBoxContainerStyled ref={modalRef}>
        <div className="header d-flex-sb">
          <img
            className="cursor-pointer"
            src={logo}
            alt=""
            style={{ width: '50px', height: "20px", objectFit: "fill" }}
          />
          <AiOutlineMinus
            onClick={() => onCancel()}
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
          <Row className="d-flex-sb">
            <Col span={23}>
              <InputCustom
                placeholder="Nhập vào tin nhắn"
                type="isTextArea"
                style={{
                  width: "100%",
                  marginRight: "12px"
                }}
                autoSize={{ minRows: 1, maxRows: 5 }}
                value={content}
                onChange={e => setContent(e.target.value)}
                onPressEnter={(e) => {
                  e.preventDefault()
                  if (!!content) {
                    setContent("")
                    handleSendMessage()
                  }
                }}
              />
            </Col>
            <Col span={1}>
              {
                !!loading
                  ? <SpinCustom />
                  : <BiSolidSend
                    className="cursor-pointer fs-23 mt-5"
                    onClick={() => {
                      if (!!content) {
                        setContent("")
                        handleSendMessage()
                      }
                    }}
                    color="#106ebe"
                  />
              }
            </Col>
          </Row>
        </div>
      </ChatBoxContainerStyled>
    </FloatButton.Group>
  )
}

export default ModalChat

