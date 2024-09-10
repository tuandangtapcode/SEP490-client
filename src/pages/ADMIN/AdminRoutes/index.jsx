import { useLayoutEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import LayoutAdmin from "src/components/Layout/LayoutAdmin"
import { decodeData, getCookie } from "src/lib/commonFunction"
import { Roles } from "src/lib/constant"
import ForbiddenPage from "src/pages/ErrorPage/ForbiddenPage"
import Router from "src/routers"

const AdminRoutes = () => {

  const isLogin = getCookie("token")
  const [isAdmin, setIsAdmin] = useState(false)

  useLayoutEffect(() => {
    if (!!isLogin) {
      const data = decodeData(isLogin)
      if (data?.RoleID === Roles.ROLE_ADMIN) setIsAdmin(true)
    }
  }, [isLogin])

  return (
    <>
      {
        !!isLogin ?
          !!isAdmin ?
            <LayoutAdmin>
              <Outlet />
            </LayoutAdmin>
            : <ForbiddenPage />
          : <Navigate to={Router.TRANG_CHU} />
      }
    </>
  )
}

export default AdminRoutes