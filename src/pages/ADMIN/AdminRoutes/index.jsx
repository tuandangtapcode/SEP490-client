import { Outlet } from "react-router-dom"
import MainLayout from "src/components/Layout/MainLayout"
import { Roles } from "src/lib/constant"
import ForbiddenPage from "src/pages/ErrorPage/ForbiddenPage"

const AdminRoutes = ({ tokenInfor }) => {

  return (
    <>
      {
        !!tokenInfor &&
          tokenInfor?.RoleID === Roles.ROLE_ADMIN ?
          <MainLayout tokenInfor={tokenInfor}>
            <Outlet />
          </MainLayout>
          : <ForbiddenPage />
      }
    </>
  )
}

export default AdminRoutes