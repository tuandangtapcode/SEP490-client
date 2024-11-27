import { Col, Menu, Row } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { MenuUser } from "../MenuItems"
import { handleLogout } from "src/lib/commonFunction"
import { globalSelector } from "src/redux/selector"
import ListIcons from "src/components/ListIcons"
import dayjs from "dayjs"
import { LayoutUserStyled } from "../styled"

const LayoutUser = ({ children }) => {

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user, listTabs } = useSelector(globalSelector)

  const handleChangeMenu = (key) => {
    if (key !== "logout") {
      navigate(key)
    } else {
      handleLogout(user?._id, dispatch, navigate)
    }
  }


  return (
    <LayoutUserStyled>
      <Row>
        <Col span={5} className="menu-container">
          <div className="mb-20">
            <div className="d-flex-center mb-12">
              <img
                style={{
                  display: "block",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  marginBottom: "4px"
                }}
                src={user?.AvatarPath}
                alt=""
              />
            </div>
            <div className="d-flex-center mb-12">
              <p className="fw-700 fs-20">{user?.FullName}</p>
            </div>
            <div className="pl-8 pr-8">
              <div className="d-flex align-items-center mb-8">
                {ListIcons.ICON_LOCATION}
                <p className="ml-6">{user?.Address}</p>
              </div>
              <div className="d-flex align-items-center">
                {ListIcons.ICON_DATE_OF_BIRTH}
                <p className="ml-6">{dayjs(user?.DateOfBirth).format("DD/MM/YYYY")}</p>
              </div>
            </div>
          </div>
          <Menu
            mode="inline"
            className="menu-antd-user"
            onClick={e => handleChangeMenu(e.key)}
            items={MenuUser(user)?.filter(i => listTabs?.includes(i?.TabID))}
            selectedKeys={location?.pathname}
          />
        </Col>
        <Col
          span={19}
        >
          <div className="content-container">
            {children}
          </div>
        </Col>
      </Row>
    </LayoutUserStyled >
  )
}

export default LayoutUser