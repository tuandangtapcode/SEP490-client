import { useLayoutEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import LayoutUser from "src/components/Layout/LayoutUser"
import { decodeData, getCookie } from "src/lib/commonFunction"
import { Roles } from "src/lib/constant"
import ForbiddenPage from "src/pages/ErrorPage/ForbiddenPage"
import Router from "src/routers"

const UserRoutes = () => {

  const isLogin = getCookie("token")
  const [isUser, setIsUser] = useState(false)

  useLayoutEffect(() => {
    if (!!isLogin) {
      const data = decodeData(isLogin)
      if (data?.RoleID !== Roles.ROLE_ADMIN) setIsUser(true)
    }
  }, [isLogin])

  return (
    <>
      {
        !!isLogin ?
          !!isUser ?
            <LayoutUser>
              <Outlet />
            </LayoutUser>
            : <ForbiddenPage />
          : <Navigate to={Router.TRANG_CHU} />
      }
    </>
  )
}

export default UserRoutes