import { ContentContainerStyled, ContentStyled, FooterStyled, LayoutStyled } from "../styled"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import ModalChat from "../components/ModalChat"
import { useLocation } from "react-router-dom"

const MainLayout = ({ children }) => {

  const { user } = useSelector(globalSelector)
  const location = useLocation()

  return (
    <LayoutStyled>
      <div>
        <Header />
      </div>
      <ContentContainerStyled>
        <ContentStyled ismeetingscreen={!!location.pathname.includes("meeting-room")}>
          {children}
        </ContentStyled>
      </ContentContainerStyled>
      {
        !location.pathname.includes("meeting-room") &&
        <FooterStyled>
          <Footer />
        </FooterStyled>
      }
      {
        (!!user?._id && !location.pathname.includes("meeting-room")) &&
        <ModalChat />
      }
    </LayoutStyled>
  )
}

export default MainLayout
