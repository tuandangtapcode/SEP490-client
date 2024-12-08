import { Card, Col, Rate, Row } from "antd"
import { SearchByAIContainerStyled, TopTeacherItemStyled } from "../styled"
import ListIcons from "src/components/ListIcons"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"
import { formatMoney } from "src/lib/stringUtils"
import InputCustom from "src/components/InputCustom"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay } from 'swiper/modules'

const { Meta } = Card

const FamoursTeacher = ({ teachers, setPrompt, subjects }) => {

  const { listSystemKey } = useSelector(globalSelector)
  const navigate = useNavigate()

  return (
    <Row gutter={[0, 16]} style={{ width: "80%" }}>
      <Col span={24} className="d-flex-center mb-20">
        <SearchByAIContainerStyled>
          <div className="fs-25 center-text fw-700 mb-12 primary-text">
            Tìm kiếm giáo viên
          </div>
          <Row>
            <Col span={12}>
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <div className="fs-17 fw-600 primary-text">
                    Tìm kiếm theo môn học
                  </div>
                </Col>
                <Col span={12}>
                  {
                    subjects?.slice(0, 4)?.map((i, idx) =>
                      <div
                        className="cursor-pointer subject-item ml-12"
                        style={{
                          color: "#333333"
                        }}
                        key={idx}
                        onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${i?._id}`)}
                      >
                        {i?.SubjectName}
                      </div>
                    )
                  }
                </Col>
                <Col span={12}>
                  {
                    subjects?.slice(4, 8)?.map((i, idx) =>
                      <div
                        className="cursor-pointer subject-item ml-12"
                        style={{
                          color: "#333333"
                        }}
                        key={idx}
                        onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${i?._id}`)}
                      >
                        {i?.SubjectName}
                      </div>
                    )
                  }
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <div className="fs-17 fw-600 primary-text">
                    Tìm kiếm theo nhu cầu
                  </div>
                </Col>
                <Col span={24}>
                  <InputCustom
                    type="isSearch"
                    placeholder="Tìm theo nhu cầu của bạn..."
                    allowClear
                    onSearch={e => setPrompt(e)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </SearchByAIContainerStyled>
      </Col>
      <Col span={24}>
        <div className="fs-25 fw-700 primary-text">Giáo viên</div>
      </Col>
      <Col span={24}>
        <Swiper
          spaceBetween={50}
          slidesPerView={4}
          modules={[Autoplay]}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        >
          {
            teachers?.map((i, idx) =>
              <SwiperSlide key={idx}>
                <TopTeacherItemStyled>
                  <Card
                    hoverable
                    cover={<img alt="example" style={{ width: "100%", height: "300px" }} src={i?.Teacher?.AvatarPath} />}
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
                          value={!!i?.TotalVotes ? i?.TotalVotes / i?.Votes?.length : 0}
                          style={{
                            fontSize: "15px"
                          }}
                        />
                      </Col>
                      <Col span={12} className="d-flex-end align-items-center">
                        <p className="primary-text fs-17 mt-4">{ListIcons.ICON_DOLLAR}</p>
                        <p className="primary-text fs-17 fw-700">
                          {formatMoney(i?.Price)}
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
              </SwiperSlide>
            )
          }
        </Swiper>
      </Col>
    </Row>
  )
}

export default FamoursTeacher