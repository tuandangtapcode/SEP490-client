import { Card, Col, Rate, Row } from "antd"
import { useSelector } from "react-redux"
import ListIcons from "src/components/ListIcons"
import { formatMoney } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"
import { TopTeacherItemStyled } from "../styled"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"

const { Meta } = Card

const TeacherItem = ({ teacherItem, subjectID }) => {

  const { listSystemKey } = useSelector(globalSelector)
  const navigate = useNavigate()

  return (
    <TopTeacherItemStyled>
      <Card
        hoverable
        cover={<img alt="example" style={{ width: "100%", height: "300px" }} src={teacherItem?.Teacher?.AvatarPath} />}
        onClick={() => navigate(`${Router.GIAO_VIEN}/${teacherItem?.Teacher?._id}${Router.MON_HOC}/${teacherItem?.Subject?._id}`)}
      >
        <Meta title={teacherItem?.Teacher?.FullName} className="mb-8" />
        <div className="d-flex align-items-center">
          <span className="mt-6 mr-6">{ListIcons.ICON_SUBJECT_CATE}</span>
          {teacherItem?.Subject?.SubjectName}
        </div>
        <div className="d-flex align-items-center">
          <span className="mt-6 mr-6">{ListIcons.ICON_LEVEL}</span>
          {
            getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)
              ?.map((item, idx) => {
                if (teacherItem?.Levels?.includes(item?.ParentID))
                  return <span key={idx} className="mr-4">{item?.ParentName}</span>
              })
          }
        </div>
        <div className="d-flex align-items-center mb-8">
          <span className="mt-6 mr-6">{ListIcons.ICON_LEARN_TYPE}</span>
          {
            getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
              ?.map((item, idx) => {
                if (teacherItem?.LearnTypes?.includes(item?.ParentID))
                  return <span key={idx} className="mr-4">{item?.ParentName}</span>
              })
          }
        </div>
        <Row className="d-flex-sb">
          <Col span={12}>
            <Rate
              allowHalf
              disabled
              value={!!teacherItem?.TotalVotes ? teacherItem?.TotalVotes / teacherItem?.Votes?.length : 0}
              style={{
                fontSize: "15px"
              }}
            />
          </Col>
          <Col span={12} className="d-flex-end align-items-center">
            <p className="primary-text fs-17 fw-700 mr-2">
              {formatMoney(teacherItem?.Price)}
            </p>
            <p className="primary-text">VNĐ</p>
          </Col>
          <Col span={12}>
            <p>{teacherItem?.Votes?.length} đánh giá</p>
          </Col>
          <Col span={12} className="d-flex-end">
            <p>1 buổi</p>
          </Col>
        </Row>
      </Card>
    </TopTeacherItemStyled>
  )
}

export default TeacherItem