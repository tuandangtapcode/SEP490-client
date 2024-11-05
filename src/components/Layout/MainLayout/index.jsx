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
      <HeaderCommon />
      <Layout>
        <Content className="site-layout-background">
          {
            (!!tokenInfor && tokenInfor?.RoleID === Roles.ROLE_ADMIN) ?
              <LayoutAdmin>
                {children}
              </LayoutAdmin>
              : (!!tokenInfor && tokenInfor?.RoleID !== Roles.ROLE_ADMIN) ?
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
