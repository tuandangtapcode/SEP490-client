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

const FamoursTeacher = ({ teachers, prompt }) => {

  const { listSystemKey, profitPercent } = useSelector(globalSelector)
  const navigate = useNavigate()

  return (
    <Row gutter={[16]} style={{ width: "80%" }}>
      <Col span={24} className="d-flex-center">
        <div className="fs-36 fw-700 mb-12">
          {
            !!prompt
              ? "Những giáo viên theo tìm kiếm của bạn"
              : "Những giáo viên được đánh giá tốt nhất"
          }
        </div>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 0]}>
          {
            teachers?.map((i, idx) =>
              <Col key={idx} span={6}>
                <TopTeacherItemStyled>
                  <Card
                    hoverable
                    cover={<img alt="example" src={i?.Teacher?.AvatarPath} />}
                    onClick={() => navigate(`${Router.GIAO_VIEN}/${i?.Teacher?._id}${Router.MON_HOC}/${i?.Subject?._id}`)}
                  >
                    <Meta title={i?.Teacher?.FullName} className="mb-8" />
                    <div className="d-flex align-items-center">
                      <span className="mt-6 mr-6">{ListIcons.ICON_SUBJECT_CATE}</span>
                      {i?.Subject?.SubjectName}
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="mt-6 mr-6">{ListIcons.ICON_LEVEL}</span>
                      {
                        getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)
                          ?.map((item, idx) => {
                            if (i?.Levels?.includes(item?.ParentID))
                              return <span key={idx} className="mr-4">{item?.ParentName}</span>
                          })
                      }
                    </div>
                    <div className="d-flex align-items-center mb-8">
                      <span className="mt-6 mr-6">{ListIcons.ICON_LEARN_TYPE}</span>
                      {
                        getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                          ?.map((item, idx) => {
                            if (i?.LearnTypes?.includes(item?.ParentID))
                              return <span key={idx} className="mr-4">{item?.ParentName}</span>
                          })
                      }
                    </div>
                    <Row className="d-flex-sb">
                      <Col span={12}>
                        <Rate
                          allowHalf
                          disabled
                          value={!!i?.Teacher?.TotalVotes ? i?.Teacher?.TotalVotes / i?.Teacher?.Votes?.length : 0}
                          style={{
                            fontSize: "15px"
                          }}
                        />
                      </Col>
                      <Col span={12} className="d-flex-end align-items-center">
                        <p className="primary-text fs-17 mt-4">{ListIcons.ICON_DOLLAR}</p>
                        <p className="primary-text fs-17 fw-700">
                          {formatMoney(getRealFee(i?.Price, profitPercent))}
                        </p>
                      </Col>
                      <Col span={12}>
                        <p>{i?.Teacher?.Votes?.length} đánh giá</p>
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