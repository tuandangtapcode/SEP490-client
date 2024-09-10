import { Col, Row } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { MainProfileWrapper } from "src/pages/ANONYMOUS/TeacherDetail/styled"
import { globalSelector } from "src/redux/selector"
import ModalUpdateProfile from "./components/ModalUpdateProfile"

const StudentProfile = () => {

  const { user } = useSelector(globalSelector)
  const [openModalUpdateProfile, setOpenModalUpdateProfile] = useState(false)

  return (
    <div>
      <MainProfileWrapper className="p-20">
        <div className="d-flex-sb mb-30">
          <div className="fs-20 fw-600">Thông tin cá nhân</div>
          <div
            className="blue-text cursor-pointer"
            onClick={() => setOpenModalUpdateProfile(true)}
          >
            Chỉnh sửa
          </div>
        </div>
        <div className="avatar mb-20">
          <img
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%"
            }}
            src={user?.AvatarPath}
            alt=""
          />
        </div>
        <Row gutter={[0, 16]}>
          <Col span={4}>
            <div className="fw-600 fs-16">Họ và tên</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{user?.FullName}</div>
          </Col>
          <Col span={4}>
            <div className="fw-600 fs-16">Địa chỉ</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{user?.Address}</div>
          </Col>
          <Col span={4}>
            <div className="fw-600 fs-16">Email</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{user?.Email}</div>
          </Col>
        </Row>

        {
          !!openModalUpdateProfile &&
          <ModalUpdateProfile
            open={openModalUpdateProfile}
            onCancel={() => setOpenModalUpdateProfile(false)}
          />
        }
      </MainProfileWrapper>
    </div>
  )
}

export default StudentProfile