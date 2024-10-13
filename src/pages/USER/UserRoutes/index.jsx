import { Outlet } from "react-router-dom"
import LayoutUser from "src/components/Layout/LayoutUser"
import { Roles } from "src/lib/constant"
import ForbiddenPage from "src/pages/ErrorPage/ForbiddenPage"

const UserRoutes = ({ tokenInfor }) => {

  return (
    <>
      {
        !!tokenInfor &&
          tokenInfor?.RoleID !== Roles.ROLE_ADMIN ?
          <LayoutUser>
            <Outlet />
          </LayoutUser>
          : <ForbiddenPage />
      }
    </>
  )
}

export default UserRoutes