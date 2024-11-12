import { Card, Col, Rate, Row } from "antd"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { TopTeacherItemStyled } from "../styled"
import ListIcons from "src/components/ListIcons"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"
import { formatMoney, getRealFee } from "src/lib/stringUtils"
const { Meta } = Card

const FamoursTeacher = ({
  recommendSubjects,
  teachers,
  subject,
  setSubject
}) => {

  const { listSystemKey, profitPercent } = useSelector(globalSelector)
  const navigate = useNavigate()

  return (
    <Row gutter={[16]} style={{ width: "80%" }}>
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
      <Col span={24} className="d-flex-center mb-20">
        <img
          src={subject?.AvatarPath}
          alt=""
          style={{
            width: "60%",
            height: "400px"
          }}
        />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 0]}>
          {
            teachers?.map((i, idx) =>
              <Col key={idx} span={6}>
                <TopTeacherItemStyled>
                  <Card
                    hoverable
                    cover={<img alt="example" src={i?.AvatarPath} />}
                    onClick={() => navigate(`${Router.GIAO_VIEN}/${i?._id}${Router.MON_HOC}/${subject?._id}`)}
                  >
                    <Meta title={i?.FullName} className="mb-8" />
                    <div className="d-flex align-items-center">
                      <span className="mt-6 mr-6">{ListIcons.ICON_LEVEL}</span>
                      {
                        getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)
                          ?.map((item, idx) => {
                            if (i?.SubjectSetting?.Levels?.includes(item?.ParentID))
                              return <span key={idx} className="mr-4">{item?.ParentName}</span>
                          })
                      }
                    </div>
                    <div className="d-flex align-items-center mb-8">
                      <span className="mt-6 mr-6">{ListIcons.ICON_LEARN_TYPE}</span>
                      {
                        getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                          ?.map((item, idx) => {
                            if (i?.SubjectSetting?.LearnTypes?.includes(item?.ParentID))
                              return <span key={idx} className="mr-4">{item?.ParentName}</span>
                          })
                      }
                    </div>
                    <Row className="d-flex-sb">
                      <Col span={12}>
                        <Rate
                          allowHalf
                          disabled
                          value={!!i?.TotalVotes ? i?.TotalVotes / i?.Votes?.length : 0}
                          style={{
                            fontSize: "15px"
                          }}
                        />
                      </Col>
                      <Col span={12} className="d-flex-end align-items-center">
                        <p className="primary-text fs-17 mt-4">{ListIcons.ICON_DOLLAR}</p>
                        <p className="primary-text fs-17 fw-700">
                          {formatMoney(getRealFee(i?.SubjectSetting?.Price, profitPercent))}
                        </p>
                      </Col>
                      <Col span={12}>
                        <p>{i?.Votes?.length} đánh giá</p>
                      </Col>
                      <Col span={12} className="d-flex-end">
                        <p>1 buổi</p>
                      </Col>
                    </Row>
                  </Card>
                </TopTeacherItemStyled>
              </Col>
            )
          }
        </Row>
      </Col>
    </Row>
  )
}

export default FamoursTeacher