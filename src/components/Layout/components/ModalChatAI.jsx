import { Col, FloatButton, Row } from "antd"
import logo from '/logo.png'
import { AiOutlineMinus } from "react-icons/ai"
import { useEffect, useRef, useState } from "react"
import { ChatBoxContainerStyled } from "../styled"
import InputCustom from "src/components/InputCustom"
import { BiSolidSend } from "react-icons/bi"
import { toast } from "react-toastify"
import ListIcons from "src/components/ListIcons"
import CommonService from "src/services/CommonService"
import SpinCustom from "src/components/SpinCustom"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import ChatBox from "src/components/ChatBox"

const ModalChatAI = ({ open, onCancel }) => {

  const { user } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState("")
  const modalRef = useRef(null)

  const convertMessageData = (listMessages) => {
    let listMessage = []
    listMessages.forEach(i => {
      if (i?.role === "user") {
        listMessage.push({
          Sender: {
            _id: user?._id,
            AvatarPath: user?.AvatarPath
          },
          Content: i?.content
        })
      } else {
        listMessage.push({
          Sender: {
            _id: 1,
            AvatarPath: logo
          },
          Content: i?.content
        })
      }
    })
    return listMessage
  }

  console.log("message", messages);


  const handleSendMessage = async () => {
    if (!content) return
    try {
      setLoading(true)
      const res = await CommonService.chatbot({
        prompt: content,
        history: []
      })
      if (!!res?.isError) return
      setMessages(convertMessageData(res?.data?.updatedHistory))
    } catch (error) {
      toast.error("Lỗi khi gửi yêu cầu: " + error.message)
    } finally {
      setLoading(false)
    }
  }

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
      icon={ListIcons.ICON_MACHINE}
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

export default ModalChatAI
