import { Col, Row } from "antd"
import { SearchByAIContainerStyled } from "../styled"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"
import InputCustom from "src/components/InputCustom"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay } from 'swiper/modules'
import TeacherItem from "../../MentorForSubject/components/TeacherItem"

const FamoursTeacher = ({ teachers, setPrompt, subjects }) => {

  const navigate = useNavigate()

  return (
    <Row gutter={[0, 16]} style={{ width: "80%" }}>
      <Col span={24} className="d-flex-center mb-20">
        <SearchByAIContainerStyled>
          <div className="fs-25 center-text fw-700 mb-12 primary-text">
            Tìm kiếm thông minh
          </div>
          <Row>
            <Col span={24}>
              <InputCustom
                type="isSearch"
                placeholder="Tìm kiếm theo nhu cầu của bạn..."
                allowClear
                onSearch={e => setPrompt(e)}
              />
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
                <TeacherItem teacherItem={i} />
              </SwiperSlide>
            )
          }
        </Swiper>
      </Col>
    </Row>
  )
}

export default FamoursTeacher