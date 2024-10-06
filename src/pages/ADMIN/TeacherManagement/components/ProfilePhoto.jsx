import { Col, Row } from "antd"
import dayjs from "dayjs"

const ProfilePhoto = ({ user }) => {

  return (
    <Row className="p-12" gutter={[16]}>
      <Col span={8}>
        <div className='fw-600 fs-18 mb-12'>Ảnh đại diện của {user?.FullName}</div>
        <div>
          <img style={{ width: "200px", height: "200px" }} src={user?.AvatarPath} alt="" />
        </div>
      </Col>
      <Col span={16}>
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
            <div className="fs-16">{user?.Account?.Email}</div>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        
      </Col>
    </Row>
  )
}

export default ProfilePhoto