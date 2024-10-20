import { Col, Menu, Row } from "antd"
import Header from "../components/Header"
import { LayoutUserStyled } from "./styled"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { MenuUser } from "../MenuItems"
import { handleLogout } from "src/lib/commonFunction"
import { ContentContainerStyled } from "../styled"
import { globalSelector } from "src/redux/selector"
import ListIcons from "src/components/ListIcons"
import dayjs from "dayjs"

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
            <div className="mb-12">
              <div className="d-flex-center mb-12">
                <img
                  style={{
                    display: "block",
                    width: "120px",
                    height: "120px",
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
              <div className="d-flex justify-content-space-around">
                <div className="d-flex-sb">
                  {ListIcons.ICON_LOCATION}
                  <p className="ml-6">{user?.Address}</p>
                </div>
                <div className="d-flex-sb">
                  {ListIcons.ICON_DATE_OF_BIRTH}
                  <p className="ml-6">{dayjs(user?.DateOfBirth).format("DD/MM/YYYY")}</p>
                </div>
              </div>
            </div>
            <div
              className="menu-container"
            >
              <Menu
                mode="inline"
                onClick={e => handleChangeMenu(e.key)}
                items={MenuUser(user)?.filter(i => !!i?.isView)}
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
    </LayoutUserStyled >
  )
}

export default LayoutUser