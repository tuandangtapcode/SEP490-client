import { Outlet } from "react-router-dom"
import MainLayout from "src/components/Layout/MainLayout"
import { Roles } from "src/lib/constant"
import ForbiddenPage from "src/pages/ErrorPage/ForbiddenPage"

const UserRoutes = ({ tokenInfor }) => {

  return (
    <>
      {
        !!tokenInfor &&
          ![Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(tokenInfor?.RoleID) ?
          <MainLayout tokenInfor={tokenInfor}>
            <Outlet />
          </MainLayout>
          : <ForbiddenPage />
      }
    </>
  )
}

export default UserRoutes