import { Col, Menu, Row } from "antd"
import Header from "../components/Header"
import { LayoutAdminStyled } from "./styled"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ListIcons from "src/components/ListIcons"
import { MenuAdmin } from "../MenuItems"
import { globalSelector } from "src/redux/selector"
import { handleLogout } from "src/lib/commonFunction"

const LayoutAdmin = ({ children }) => {

  const navigate = useNavigate()
  const { user } = useSelector(globalSelector)
  const location = useLocation()
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false)

  const handleChangeMenu = (key) => {
    if (key !== "logout") {
      navigate(key)
    } else {
      handleLogout(user?._id, dispatch, navigate)
    }
  }

  return (
    <LayoutAdminStyled>
      <Header />
      <Row>
        <Col span={collapsed ? 2 : 4}>
          <div
            className="menu-container"
            style={{
              width: collapsed ? "90px" : "100%"
            }}
          >
            <Menu
              inlineCollapsed={collapsed}
              mode="inline"
              onClick={e => handleChangeMenu(e.key)}
              items={MenuAdmin()?.filter(i => i?.RoleID?.includes(user?.RoleID))}
              selectedKeys={location?.pathname}
            />
            <div
              className="collapsed-menu cursor-pointer d-flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              <div className="mr-8">
                {collapsed ? ListIcons.ICON_MENUUNFOLD : ListIcons.ICON_MENUFOLD}
              </div>
              {/* <p style={{ display: collapsed ? "none" : "block" }}>Collapsed</p> */}
            </div>
          </div>
        </Col>
        <Col span={collapsed ? 22 : 20}>
          <div className="content-container">
            {children}
          </div>
        </Col>
      </Row>
    </LayoutAdminStyled>
  )
}

export default LayoutAdmin