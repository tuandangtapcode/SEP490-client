import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { MainProfileWrapper } from "src/pages/ANONYMOUS/TeacherDetail/styled"
import { useState } from "react"
import { Col, Row } from "antd"
import dayjs from "dayjs"
import ModalUpdateProfile from "./components/ModalUpdateProfile"

const UserProfile = () => {

  const { user } = useSelector(globalSelector)
  const [openModalUpdateProfile, setOpenModalUpdateProfile] = useState(false)

  return (
    <MainProfileWrapper className="p-20">
      <div className="d-flex-sb mb-30">
        <div className="fs-20 fw-600">Thông tin cá nhân</div>
        <div
          className="primary-text cursor-pointer"
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
          <div className="fw-600 fs-16">Ngày sinh</div>
        </Col>
        <Col span={20}>
          <div className="fs-16">{dayjs(user?.DateOfBirth).format("DD/MM/YYYY")}</div>
        </Col>
        <Col span={4}>
          <div className="fw-600 fs-16">Số điện thoại</div>
        </Col>
        <Col span={20}>
          <div className="fs-16">{user?.Phone}</div>
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
  )
}

export default UserProfile