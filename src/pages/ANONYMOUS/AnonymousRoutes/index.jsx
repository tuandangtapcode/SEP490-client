import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import MainLayout from "src/components/Layout/MainLayout"
import { Roles } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"

const AnonymousRoutes = () => {

  const global = useSelector(globalSelector)

  return (

    <>
      {
        global?.user?.RoleID !== Roles.ROLE_ADMIN ?
          <MainLayout>
            <Outlet />
          </MainLayout>
          :
          <Navigate to={'/dashboard'} />
      }
    </>
  )
}

export default AnonymousRoutes