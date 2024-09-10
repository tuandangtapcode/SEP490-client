import { UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Rate, Row, Typography } from 'antd'
import { EffectCards } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TestimonialsContainer } from '../../styled'

// Import Swiper styles
import ListIcons from 'src/components/ListIcons'
import 'swiper/css'
import 'swiper/css/effect-cards'
import Meta from 'antd/es/card/Meta'

const { Title, Paragraph } = Typography

const testimonialsData = [
  {
    _id: "1",
    text: "The gradual accumulation of information about atomic and small-scale behaviour...",
    rating: 4,
    author: "Annette Black",
    authorTitle: "Director, Producer",
    authorImage: <Avatar icon={<UserOutlined />} />
  },
  {
    _id: "2",
    text: "The gradual accumulation of information about atomic and small-scale behaviour...",
    rating: 4,
    author: "Annette Black",
    authorTitle: "Director, Producer",
    authorImage: <Avatar icon={<UserOutlined />} />
  },
  {
    _id: "3",
    text: "The gradual accumulation of information about atomic and small-scale behaviour...",
    rating: 4,
    author: "Annette Black",
    authorTitle: "Director, Producer",
    authorImage: <Avatar icon={<UserOutlined />} />
  },
]


const Testimonials = () => {

  return (
    <TestimonialsContainer >
      <Row gutter={[16, 16]} className='d-flex-sb'>
        <div className="testimonials-header">
          <Title level={2}>Nhận xét từ những học viên và giảng viên</Title>
          <Paragraph>Nhận xét từ những học viên và giảng viên</Paragraph>
        </div>
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
        >
          {testimonialsData.map(testimonial => (
            <SwiperSlide key={testimonial?._id}>
              <Col span={24}>
                {ListIcons?.ICON_PINNOTE}
              </Col>
              <Col span={24} className='mt-45'>
                <Paragraph>
                  {testimonial?.text}
                </Paragraph>
              </Col>
              <Col span={24}>
                <Rate disabled defaultValue={testimonial.rating} />
              </Col>
              {/* <Col span={24}
                style={{ border: '1px solid EC5C2E' }}
                className='mt-15'
              ></Col> */}
              <Col span={24} className='mt-15'>
                <Card>
                  <Meta
                    avatar={testimonial.authorImage}
                    title={testimonial.author}
                    description={testimonial.authorTitle}
                  />
                </Card>
              </Col>
            </SwiperSlide>
          ))}
        </Swiper>
      </Row>
    </TestimonialsContainer >
  )
}

export default Testimonials
