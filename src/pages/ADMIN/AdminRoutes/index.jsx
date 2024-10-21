import { Outlet } from "react-router-dom"
import LayoutAdmin from "src/components/Layout/LayoutAdmin"
import { Roles } from "src/lib/constant"
import ForbiddenPage from "src/pages/ErrorPage/ForbiddenPage"

const AdminRoutes = ({ tokenInfor }) => {

  return (
    <>
      {
        !!tokenInfor &&
          tokenInfor?.RoleID === Roles.ROLE_ADMIN ?
          <LayoutAdmin>
            <Outlet />
          </LayoutAdmin>
          : <ForbiddenPage />
      }
    </>
  )
}

export default AdminRoutes