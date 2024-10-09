import { Col, Image, Row } from "antd"

const Certificates = ({ user }) => {

  return (
    <Row className="p-12" gutter={[16, 16]}>
      <Col span={24}>
        <div>Những bằng cấp/chứng chỉ/chứng nhận của {user?.FullName}</div>
      </Col>
      {
        user?.Certificates?.map((i, idx) =>
          <Col key={idx} span={8}>
            <Image
              src={i}
              alt=""
              style={{
                height: "250px"
              }}
            />
          </Col>
        )
      }
    </Row>
  )
}

export default Certificates