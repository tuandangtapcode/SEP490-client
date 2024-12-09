import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Card, Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import Router from 'src/routers'
import ListIcons from 'src/components/ListIcons'
import { Navigation } from 'swiper/modules'
import { useState } from 'react'

const { Meta } = Card

const Subject = ({ subjects }) => {

  const navigate = useNavigate()
  const [swiperInstance, setSwiperInstance] = useState()

  return (
    <Row gutter={[0, 16]} style={{ width: "80%" }}>
      <Col span={24} className='d-flex-sb'>
        <div className="fs-25 fw-700 primary-text">Môn học</div>
        <div className='d-flex'>
          <div
            className='cursor-pointer swiper-button-prev'
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slidePrev()
              }
            }}
          >
            {ListIcons.ICON_BACK}
          </div>
          <div
            className='ml-8 cursor-pointer swiper-button-next'
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slideNext()
              }
            }}
          >
            {ListIcons.ICON_NEXT}
          </div>
        </div>
      </Col>
      <Col span={24}>
        <Swiper
          spaceBetween={50}
          slidesPerView={4}
          modules={[Navigation]}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        // navigation={{
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // }}
        >
          {
            subjects.slice(0, 10)?.map((i, idx) =>
              <SwiperSlide
                key={idx}
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                }}>

                <Card
                  hoverable
                  cover={<img alt="example" style={{ width: "100%", height: "300px" }} src={i?.AvatarPath} />}
                  onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${i?._id}`)}
                >
                  <Meta title={i?.SubjectName} className="mb-8" />
                </Card>
              </SwiperSlide>
            )
          }
        </Swiper>
      </Col>
    </Row >
  )
}

export default Subject