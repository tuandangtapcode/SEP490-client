import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import MainLayout from "src/components/Layout/MainLayout"
import { Roles } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import Router from "src/routers"

const AnonymousRoutes = () => {

  const { user } = useSelector(globalSelector)

  return (

    <>
      {
        ![Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(user?.RoleID) ?
          <MainLayout>
            <Outlet />
          </MainLayout>
          : user?.RoleID === Roles.ROLE_ADMIN
            ? <Navigate to={'/dashboard'} />
            : <Navigate to={Router.QUAN_LY_GIAO_VIEN} />
      }
    </>
  )
}

export default AnonymousRoutes