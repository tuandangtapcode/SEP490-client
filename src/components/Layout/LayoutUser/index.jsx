import { Col, Menu, Row } from "antd"
import Header from "../components/Header"
import { LayoutUserStyled } from "./styled"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { MenuUser } from "../MenuItems"
import { handleLogout } from "src/lib/commonFunction"
import { ContentContainerStyled } from "../styled"
import { globalSelector } from "src/redux/selector"

const LayoutUser = ({ children }) => {

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(globalSelector)

  const handleChangeMenu = (key) => {
    if (key !== "logout") {
      navigate(key)
    } else {
      handleLogout(user?._id, dispatch, navigate)
    }
  }


  return (
    <LayoutUserStyled>
      <Header />
      <ContentContainerStyled>
        <Row>
          <Col span={5}>
            <div
              className="menu-container"
            >
              <Menu
                mode="inline"
                onClick={e => handleChangeMenu(e.key)}
                items={MenuUser(user)?.filter(i => !!i?.isview)}
                selectedKeys={location?.pathname}
              />
            </div>
          </Col>
          <Col span={19}>
            <div className="content-container">
              {children}
            </div>
          </Col>
        </Row>
      </ContentContainerStyled>
    </LayoutUserStyled>
  )
}

export default LayoutUser