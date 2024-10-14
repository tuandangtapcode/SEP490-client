import { Col, Row } from "antd"
import ButtonCustom from "src/components/MyButton/ButtonCustom"



const FamoursTeacher = ({
  recommendSubjects,
  teachers,
  subject,
  setSubject
}) => {
  return (
    <Row gutter={[16]}>
      <Col span={24} className="d-flex-center">
        <div className="fs-36 fw-700">Khám phá các giáo viên nổi tiếng</div>
      </Col>
      <Col span={24} className="d-flex-center mb-45">
        <div
          style={{
            color: "#778088",
            fontSize: "16px"
          }}
        >
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit
        </div>
      </Col>
      <Col span={24} className="d-flex-sa mb-30">
        {
          recommendSubjects?.map((i, idx) =>
            <ButtonCustom
              key={idx}
              className={`${i?._id === subject?._id ? "primary" : "third"} submit-btn mr-8`}
              onClick={() => setSubject(i)}
            >
              {i?.SubjectName}
            </ButtonCustom>
          )
        }
      </Col>
      <Col span={24} className="d-flex-center">
        <img
          src={subject?.AvatarPath}
          alt=""
          style={{
            width: "60%",
            height: "400px"
          }}
        />
      </Col>
    </Row>
  )
}

export default FamoursTeacher