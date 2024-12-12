import { Layout } from "antd"
import HeaderCommon from "../components/HeaderCommon"
import { Roles } from "src/lib/constant"
import LayoutAdmin from "../LayoutAdmin"
import LayoutUser from "../LayoutUser"
import LayoutCommon from "../LayoutCommon"

const { Content } = Layout

const MainLayout = ({ children, tokenInfor }) => {

  return (
    <Layout>
      {
        !!tokenInfor
          ? <HeaderCommon />
          : <div></div>
      }
      <Layout>
        <Content className="site-layout-background">
          {
            (!!tokenInfor && [Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(tokenInfor?.RoleID)) ?
              <LayoutAdmin>
                {children}
              </LayoutAdmin>
              : (!!tokenInfor && ![Roles.ROLE_ADMIN, Roles.ROLE_STAFF].includes(tokenInfor?.RoleID)) ?
                <LayoutUser>
                  {children}
                </LayoutUser>
                : <LayoutCommon>
                  {children}
                </LayoutCommon>
          }
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
