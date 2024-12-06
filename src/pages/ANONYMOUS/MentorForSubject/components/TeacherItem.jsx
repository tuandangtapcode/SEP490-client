import { Col, Rate, Row } from "antd"
import { useSelector } from "react-redux"
import ListIcons from "src/components/ListIcons"
import { formatMoney } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import { MainProfileWrapper } from "../../TeacherDetail/styled"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"

const TeacherItem = ({ teacherItem, subjectID }) => {

  const { profitPercent } = useSelector(globalSelector)
  const navigate = useNavigate()

  return (
    <MainProfileWrapper
      className="mb-10 cursor-pointer"
      onClick={() => navigate(`${Router.GIAO_VIEN}/${teacherItem?.Teacher?._id}${Router.MON_HOC}/${subjectID}`)}
    >
      <Row>
        <Col span={22}>
          <Row gutter={[8, 0]}>
            <Col span={4}>
              <img
                src={teacherItem?.Teacher?.AvatarPath}
                style={{
                  width: "100%",
                  height: "100$",
                  borderRadius: "8px"
                }}
              />
            </Col>
            <Col span={20}>
              <div className="mb-16">
                <Rate
                  allowHalf
                  disabled
                  value={
                    !!teacherItem?.Teacher?.TotalVotes
                      ? teacherItem?.Teacher?.TotalVotes / teacherItem?.Teacher?.Votes?.length
                      : 0
                  }
                  style={{
                    fontSize: "15px"
                  }}
                />
                <span className="ml-8">({teacherItem?.Teacher?.Votes?.length} Đánh giá)</span>
              </div>
              <p className="fs-17 fw-700 mb-16">{teacherItem?.Teacher?.FullName}</p>
              <p>{teacherItem?.Teacher?.Address}</p>
            </Col>
          </Row>
        </Col>
        <Col span={2}>
          <div className="d-flex-end align-items-center">
            <p className="primary-text fs-17 mt-4">{ListIcons.ICON_DOLLAR}</p>
            <p className="primary-text fs-17 fw-700">
              {formatMoney(teacherItem?.Price * 1000)}
            </p>
          </div>
          <p>mỗi buổi</p>
        </Col>
      </Row>
    </MainProfileWrapper>
  )
}

export default TeacherItem