import { Col, Image, Row } from "antd"
import dayjs from "dayjs"

const Information = ({ user }) => {
  return (
    <Row gutter={[0, 8]} className="p-12">
      <Col span={5}>
        <div className="fw-600 fs-16">Họ và tên</div>
      </Col>
      <Col span={19}>
        <div className="fs-16">{user?.FullName}</div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Ngày sinh</div>
      </Col>
      <Col span={19}>
        <div className="fs-16">{dayjs(user?.DateOfBirth).format("DD/MM/YYYY")}</div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Số điện thoại</div>
      </Col>
      <Col span={19}>
        <div className="fs-16">{user?.Phone}</div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Địa chỉ</div>
      </Col>
      <Col span={19}>
        <div className="fs-16">{user?.Address}</div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Email</div>
      </Col>
      <Col span={19}>
        <div className="fs-16">{user?.Email}</div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Kinh nghiệm giảng dạy</div>
      </Col>
      <Col span={!!user?.Experiences?.length ? 24 : 19}>
        <div className="fs-16">
          {
            !!user?.Experiences?.length
              ? user?.Experiences?.map((i, idx) =>
                <p key={idx}>{i}</p>
              )
              : "Chưa bổ sung kinh nghiệm giảng dạy"
          }
        </div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Trình độ học vấn</div>
      </Col>
      <Col span={!!user?.Educations?.length ? 24 : 19}>
        <div className="fs-16">
          {
            !!user?.Educations?.length
              ? user?.Educations?.map((i, idx) =>
                <p key={idx}>{i}</p>
              )
              : "Chưa bổ sung trình độ học vấn"
          }
        </div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Môn học đăng ký</div>
      </Col>
      <Col span={!!user?.SubjectSettings?.length ? 24 : 19}>
        <div className="fs-16">
          {
            !!user?.SubjectSettings?.length
              ? user?.SubjectSettings?.map((i, idx) =>
                <p key={idx}>{i?.Subject?.SubjectName}</p>
              )
              : "Chưa bổ sung môn học đăng ký"
          }
        </div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Chứng nhận</div>
      </Col>
      <Col span={!!user?.Certificates?.length ? 24 : 19}>
        <div className="fs-16">
          {
            !!user?.Certificates?.length
              ? user?.Certificates?.map((i, idx) =>
                <Image
                  src={i}
                  alt="" key={idx}
                  style={{
                    width: "200px",
                    height: "200px",
                    marginRight: "12px"
                  }}
                />
              )
              : "Chưa bổ sung chứng nhận"
          }
        </div>
      </Col>
      <Col span={5}>
        <div className="fw-600 fs-16">Giới thiệu bản thân</div>
      </Col>
      <Col span={19}>
        <div className="fs-16">
          {
            !!user?.Description
              ? user?.Description
              : "Chưa bổ sung giới thiệu bản thân"
          }
        </div>
      </Col>
    </Row>
  )
}

export default Information