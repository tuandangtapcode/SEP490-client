import { Col, Dropdown, Empty, Menu, Row } from "antd"
import { BadgeStyled, HeaderContainerStyled, HeaderStyled } from "../styled"
import logo from '/logo.png'
import { MenuCommon } from "../MenuItems"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import Router from "src/routers"
import ListIcons from "src/components/ListIcons"
import { handleLogout } from "src/lib/commonFunction"
import moment from "moment"
import { useEffect, useState } from "react"
import NotificationService from "src/services/NotificationService"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import socket from "src/utils/socket"
import { Roles } from "src/lib/constant"
import { toast } from "react-toastify"
import ButtonCustom from "src/components/MyButton/ButtonCustom"

const NotificationItem = ({
  data,
  navigate,
  seenNotification,
  user
}) => {

  return (
    <div
      onClick={() => {
        if (!data?.IsSeen) {
          seenNotification(data?._id)
        }
        navigate(`/${[Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(user?.RoleID) ? "dashboard" : "user"}/${data?.Type}`)
      }}
      style={{ margin: '8px 0' }}
      className={data?.IsSeen ? "gray-text" : "black-text not-seen-notify"}
    >
      <p>
        {data?.Content}
      </p>
      <p>
        {moment(data.createdAt).calendar()}
      </p>
    </div>
  )
}


const HeaderCommon = () => {

  const { user, isLogin } = useSelector(globalSelector)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [newNotifications, setNewNotification] = useState(0)
  const location = useLocation()

  const handleChangeStatusNotification = async () => {
    const res = await NotificationService.changeStatusNotification(user?._id)
    if (!!res?.isError) return toast.error(res?.msg)
    getNotifications()
  }

  const getNotifications = async () => {
    const res = await NotificationService.getListNotification(user?._id)
    if (!!res?.isError) return toast.error(res?.msg)
    setNotifications(res?.data?.List)
    setNewNotification(res?.data?.IsNew)
  }

  const seenNotification = async (NotificationID) => {
    const res = await NotificationService.seenNotification({
      NotificationID,
      ReceiverID: user?._id
    })
    if (!!res?.isError) return toast.error(res?.msg)
    getNotifications()
  }

  useEffect(() => {
    if (!!user?._id) {
      getNotifications()
    }
  }, [user])


  const menuAccoutUser = [
    {
      key: Router.PROFILE,
      isView: true,
      label: (
        <div>Hồ sơ</div>
      ),
      onClick: () => navigate(Router.PROFILE)
    },
    {
      label: (
        <div>Đăng xuất</div>
      ),
      onClick: () => handleLogout(user?._id, dispatch, navigate)
    },
  ]

  const itemsNotification = [
    {
      key: '1',
      label: (
        !!notifications?.length ?
          <div style={{ width: '300px', padding: '12px' }}>
            {
              notifications?.reverse()?.map((i, idx) =>
                <NotificationItem
                  key={idx}
                  data={i}
                  navigate={navigate}
                  seenNotification={seenNotification}
                  user={user}
                />
              )
            }
          </div>
          :
          <Empty description="Chưa có thông báo" />
      )
    }
  ]

  useEffect(() => {
    socket.on('get-notification', (data) => {
      setNotifications([...notifications, data])
      setNewNotification(newNotifications + 1)
    })
  }, [])


  return (
    <HeaderContainerStyled isHome={location.pathname === "/"}>
      <HeaderStyled>
        <Row gutter={[8]} className="d-flex-sb">
          <Col span={3} className="d-flex-center">
            <img
              className="cursor-pointer"
              onClick={() => navigate("/")}
              src={logo}
              alt=""
              style={{ width: '100%', height: "50px", marginTop: '5px', marginRight: "12px" }}
            />
          </Col>
          <Col span={18} className="d-flex-end">
            {
              ![Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(user?.RoleID) &&
              <div>
                <Menu
                  style={{
                    backgroundColor: "transparent",
                    color: "white"
                  }}
                  mode="horizontal"
                  items={MenuCommon()}
                  selectedKeys={location?.pathname}
                  onClick={(e) => navigate(e?.key)}
                />
              </div>
            }
          </Col>
          <Col span={3} className="d-flex-end">
            {
              !!user?._id &&
              <Dropdown
                menu={{ items: itemsNotification }}
                trigger={['click']}
                onOpenChange={() => {
                  if (!!newNotifications) handleChangeStatusNotification()
                }}
              >
                <BadgeStyled
                  size="small"
                  count={newNotifications}
                  style={{ fontSize: '10px' }}
                >
                  <ButtonCircle
                    className="transparent-btn"
                    icon={ListIcons.ICON_BELL}
                  />
                </BadgeStyled>
              </Dropdown>
            }
            <div className="ml-12">
              {
                user?._id ?
                  <Dropdown menu={{ items: ![Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(user?.RoleID) ? menuAccoutUser : [] }} trigger={['click']}>
                    <img
                      style={{
                        display: "block",
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        marginBottom: "2px"
                      }}
                      src={user?.AvatarPath}
                      alt=""
                    />
                  </Dropdown>
                  :
                  <ButtonCustom
                    className="yellow-btn medium-size"
                    onClick={() => navigate("/dang-nhap")}
                  >
                    Đăng nhập
                  </ButtonCustom>
              }
            </div>
          </Col>
        </Row>
      </HeaderStyled>
    </HeaderContainerStyled>
  )
}

export default HeaderCommon