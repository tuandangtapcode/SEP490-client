import { Col, Dropdown, Empty, Menu, Row, Tooltip } from "antd"
import { BadgeStyled, HeaderContainerStyled, HeaderStyled } from "../styled"
import logo from '/logo.png'
import tatuboo from '/tatuboo.png'
import { MenuCommon } from "../MenuItems"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import Router from "src/routers"
import ListIcons from "src/components/ListIcons"
import InputCustom from "src/components/InputCustom"
import { handleLogout } from "src/lib/commonFunction"
import moment from "moment"
import { useEffect, useState } from "react"
import NotificationService from "src/services/NotificationService"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import socket from "src/utils/socket"
import { Roles } from "src/lib/constant"

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
        navigate(`/${user?.RoleID === Roles.ROLE_ADMIN ? "dashboard" : "user"}/${data?.Type}`)
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


const Header = () => {

  const global = useSelector(globalSelector)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [newNotifications, setNewNotification] = useState(0)
  const location = useLocation()

  const handleChangeStatusNotification = async () => {
    const res = await NotificationService.changeStatusNotification(global?.user?._id)
    if (res?.isError) return
    getNotifications()
  }

  const getNotifications = async () => {
    const res = await NotificationService.getListNotification(global?.user?._id)
    if (res?.isError) return
    setNotifications(res?.data?.List)
    setNewNotification(res?.data?.IsNew)
  }

  const seenNotification = async (NotificationID) => {
    const res = await NotificationService.seenNotification({
      NotificationID,
      ReceiverID: global?.user?._id
    })
    if (res?.isError) return
    getNotifications()
  }

  useEffect(() => {
    if (!!global?.user?._id) {
      getNotifications()
    }
  }, [global?.user])

  const menuAccoutUser = [
    {
      key: Router.PROFILE,
      isView: true,
      label: (
        <div>Quản trị</div>
      ),
      onClick: () => navigate(Router.PROFILE)
    },
    {
      label: (
        <div>Đăng xuất</div>
      ),
      onClick: () => handleLogout(global?.user?._id, dispatch, navigate)
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
                  user={global?.user}
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
    <HeaderContainerStyled>
      <HeaderStyled>
        <Row>
          <Col span={3} className="d-flex-center">
            <img
              className="cursor-pointer"
              onClick={() => navigate("/")}
              src={logo}
              alt=""
              style={{ width: '35px', height: "50px", marginTop: '5px', marginRight: "12px" }}
            />
            <img
              className="cursor-pointer"
              onClick={() => navigate("/")}
              src={tatuboo}
              alt=""
              style={{ width: '115px', height: "25px", marginTop: '5px' }}
            />
          </Col>
          <Col span={18} className="d-flex-center">
            {
              ![Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(global?.user?.RoleID) &&
              <div
              // style={{ flex: 1 }}
              >
                <Menu
                  mode="horizontal"
                  items={MenuCommon()}
                  selectedKeys={location?.pathname}
                  onClick={(e) => navigate(e?.key)}
                />
              </div>
            }
          </Col>
          <Col span={3} className="d-flex-end mt-16">
            {
              global?.user?.RoleID !== Roles.ROLE_ADMIN &&
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                arrow
                overlay={
                  <>
                    <InputCustom
                      type="isSearch"
                      placeholder="Nhập vào mã phòng"
                      style={{ width: "500px" }}
                      onSearch={e => navigate(`/meeting-room/${e}`)}
                    />
                  </>
                }
              >
                <div>{ListIcons.ICON_SEARCH}</div>
              </Dropdown>
            }
            {
              !!global?.user?._id &&
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
                    icon={ListIcons.ICON_BELL}
                  />
                </BadgeStyled>
              </Dropdown>
            }
            <div className="ml-12 mb-10">
              {
                global?.user?._id ?
                  <Dropdown menu={{ items: global?.user?.RoleID !== Roles.ROLE_ADMIN ? menuAccoutUser : [] }} trigger={['click']}>
                    <img
                      style={{
                        display: "block",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%"
                      }}
                      src={global?.user?.AvatarPath}
                      alt=""
                    />
                  </Dropdown>
                  :
                  <div
                    className="d-flex-end cursor-pointer"
                    onClick={() => navigate("/dang-nhap")}
                  >
                    <img
                      src="https://takelessons.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ficon-avatar.95340bc0.png&w=1920&q=75"
                      alt=""
                      style={{
                        // width: '32px',
                        height: "35px"
                      }}
                    />
                    <span className="ml-12 fs-16">Đăng nhập</span>
                  </div>
              }
            </div>
          </Col>
        </Row>
      </HeaderStyled>
    </HeaderContainerStyled>
  )
}

export default Header