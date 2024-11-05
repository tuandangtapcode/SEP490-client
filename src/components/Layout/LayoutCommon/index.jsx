import { useSelector } from "react-redux"
import Footer from "../components/Footer"
import ModalChat from "../components/ModalChat"
import { ContentContainerStyled, ContentStyled, LayoutStyled } from "../styled"
import { globalSelector } from "src/redux/selector"

const LayoutCommon = ({ children }) => {

  const { user } = useSelector(globalSelector)

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
      {
        (!!user?._id && !location.pathname.includes("meeting-room")) &&
        <ModalChat />
      }
    </LayoutStyled>
  )
}

export default LayoutCommon