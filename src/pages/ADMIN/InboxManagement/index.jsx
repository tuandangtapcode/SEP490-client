import { Col, Empty, Row } from "antd"
import { useEffect, useState } from "react"
import SpinCustom from "src/components/SpinCustom"
import MessageService from "src/services/MessageService"
import socket from "src/utils/socket"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import ChatBox from "src/components/ChatBox"
import InputCustom from "src/components/InputCustom"
import { BiSolidSend } from "react-icons/bi"
import { ChatBoxWrapper, MessageItemStyled } from "./styled"

const InboxManagement = () => {

  const { user } = useSelector(globalSelector)
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [pagination, setPagination] = useState({
    PageSize: 7,
    CurrentPage: 1,
    ChatID: ""
  })

  const getChatOfAdmin = async () => {
    try {
      // setLoading(true)
      const res = await MessageService.getChatOfAdmin()
      if (res?.isError) return
      setChats(res?.data)
    } finally {
      // setLoading(false)
    }
  }

  const getListMessages = async () => {
    try {
      setLoading(true)
      const res = await MessageService.getMessageByChat(pagination)
      if (res?.isError) return
      setMessages(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  const seenMessage = async (ChatID) => {
    try {
      const res = await MessageService.seenMessage(ChatID)
      if (res?.isError) return
      getChatOfAdmin()
    } finally {
      console.log();
    }
  }

  useEffect(() => {
    getChatOfAdmin()
  }, [])

  useEffect(() => {
    if (!!pagination?.ChatID) {
      getListMessages()
    }
  }, [pagination])


  const handleSendMessage = async () => {
    try {
      setLoading(true)
      const body = {
        Content: content,
        ChatID: pagination?.ChatID
      }
      const res = await MessageService.createMessage(body)
      if (res?.isError) return
      socket.emit("send-message", {
        ...body,
        Receiver: chats?.find(i => i?._id === pagination?.ChatID)?.Members?.find(item => item?._id !== user?._id)?._id,
        Sender: {
          _id: user?._id,
          FullName: user?.FullName,
          AvatarPath: user?.AvatarPath
        },
        createdAt: Date.now
      })
      setMessages(pre => [
        ...pre,
        {
          ...body,
          Receiver: chats?.find(i => i?._id === pagination?.ChatID)?.Members?.find(item => item?._id !== user?._id)?._id,
          Sender: {
            _id: user?._id,
            FullName: user?.FullName,
            AvatarPath: user?.AvatarPath
          },
          createdAt: Date.now
        }
      ])
      getChatOfAdmin()
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
      getChatOfAdmin()
    })
  }, [])

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[16, 8]}>
        <Col span={6}>
          <div className="blue-text fs-18 fw-700 mb-16">Danh sách tin nhắn</div>
          {
            !!chats?.length ?
              chats?.map((i, idx) =>
                <MessageItemStyled
                  key={idx}
                  onClick={() => {
                    if (i?._id !== pagination?.ChatID) {
                      if (!i?.IsSeen) {
                        seenMessage(i?._id)
                      }
                      setPagination(pre => ({ ...pre, ChatID: i?._id }))
                    }
                  }}
                >
                  <div className="d-flex">
                    <img
                      src={i?.Members[0]?.AvatarPath}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        marginRight: "12px"
                      }}
                    />
                    <div>
                      <div className="fw-600 fs-16">{i?.Members[0]?.FullName}</div>
                      <div className={!i?.IsSeen ? "black-text fw-600" : "gray-text"}>{i?.LastMessage}</div>
                    </div>
                  </div>
                </MessageItemStyled>
              )
              : <Empty description="Chưa có tin nhắn nào" />
          }
        </Col>
        {
          !!chats?.length && !!pagination?.ChatID &&
          <Col span={18}>
            <div className="d-flex">
              <img
                src={
                  chats?.find(i => i?._id === pagination?.ChatID)?.Members?.find(item => item?._id !== user?._id)?.AvatarPath
                }
                alt=""
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "8px"
                }}
              />
              <div className="blue-text fs-18 fw-700 mb-16">
                {
                  chats?.find(i => i?._id === pagination?.ChatID)?.Members?.find(item => item?._id !== user?._id)?.FullName
                }
              </div>
            </div>
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
          </Col>
        }
      </Row>
    </SpinCustom>
  )
}

export default InboxManagement