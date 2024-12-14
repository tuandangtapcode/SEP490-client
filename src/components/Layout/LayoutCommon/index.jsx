import { useSelector } from "react-redux"
import Footer from "../components/Footer"
import { ContentContainerStyled, ContentStyled, LayoutStyled } from "../styled"
import { globalSelector } from "src/redux/selector"
import ModalChat from "../components/ModalChat"
import ModalChatAI from "../components/ModalChatAI"
import { FloatButton } from "antd"
import ListIcons from "src/components/ListIcons"
import { useState } from "react"

const LayoutCommon = ({ children }) => {

  const { user } = useSelector(globalSelector)
  const [openChatBox, setOpenChatBox] = useState(false)
  const [openChatBoxAI, setOpenChatBoxAI] = useState(false)


  return (
    <LayoutStyled>
      <ContentContainerStyled>
        <ContentStyled isFullScreen={!!["meeting-room", "/"].includes(location.pathname)}>
          {children}
        </ContentStyled>
      </ContentContainerStyled>
      {
        !location.pathname.includes("meeting-room") &&
        <Footer />
      }
      <FloatButton.Group
        icon={ListIcons.ICON_CHAT_DOT}
        trigger="click"
        type="primary"
      >
        <FloatButton
          icon={ListIcons.ICON_MACHINE}
          tooltip="Chat bot"
          onClick={() => setOpenChatBoxAI(true)}
        />
        {
          !!user?._id &&
          <FloatButton
            icon={ListIcons.ICON_ADMIN}
            tooltip="Liên hệ với quản trị viên"
            onClick={() => setOpenChatBox(true)}
          />
        }
      </FloatButton.Group>

      {
        !!openChatBox &&
        <ModalChat
          open={openChatBox}
          onCancel={() => setOpenChatBox(false)}
        />
      }

      {
        !!openChatBoxAI &&
        <ModalChatAI
          open={openChatBoxAI}
          onCancel={() => setOpenChatBoxAI(false)}
        />
      }

    </LayoutStyled>
  )
}

export default LayoutCommon