import { Col, Row } from "antd"

const FamoursTeacher = () => {
  return (
    <Row gutter={[16]}>
      <Col span={24} className="d-flex-center">
        <div className="fs-36 fw-700">Khám phá các giáo viên nổi tiếng</div>
      </Col>
      <Col span={24} className="d-flex-center">
        <div
          style={{
            color: "#778088",
            fontSize: "16px"
          }}
        >
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit
        </div>
      </Col>
    </Row>
  )
}

export default FamoursTeacher