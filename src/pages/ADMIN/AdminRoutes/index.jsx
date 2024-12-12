import { Outlet } from "react-router-dom"
import MainLayout from "src/components/Layout/MainLayout"
import SpinCustom from "src/components/SpinCustom"
import { Roles } from "src/lib/constant"
import ForbiddenPage from "src/pages/ErrorPage/ForbiddenPage"

const AdminRoutes = ({ tokenInfor, loading }) => {

  return (
    <>
      {
        !loading
          ?
          !!tokenInfor &&
            [Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(tokenInfor?.RoleID) ?
            <MainLayout tokenInfor={tokenInfor}>
              <Outlet />
            </MainLayout>
            : <ForbiddenPage />
          :
          <div className="loading-center" style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
            <SpinCustom spinning={loading} />
          </div>

      }
    </>
  )
}

export default AdminRoutes