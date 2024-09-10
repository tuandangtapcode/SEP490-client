import { Avatar, Card, Col, Row, Tag, Typography } from "antd"
import { PrivateContainer } from "../../styled"

const tutors = [
  {
    title: "Koudetat à la Maison #1 (L'intégrale)",
    description: "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    image: 'https://thanhnien.mediacdn.vn/Uploaded/congthang/2016_03_11/biendao_DWIQ.jpg?width=500',
    instructor: 'Annette Black',
    instructorTitle: 'Director, Producer',
    isNew: true,
    courseTag: 'Biên đạo nhảy',
  },
  {
    title: "Koudetat à la Maison #1 (L'intégrale)",
    description: "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    image: 'https://studiovietnam.com/wp-content/uploads/2021/07/chup-anh-chan-dung-troi-nang-6.jpg',
    instructor: 'Annette Black',
    instructorTitle: 'Director, Producer',
    isNew: true,
    courseTag: 'Diễn xuất',
  },
  {
    title: "Koudetat à la Maison #1 (L'intégrale)",
    description: "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    image: 'https://thethaothienlong.vn/wp-content/uploads/2022/04/Cau-long-duoc-dua-vao-thi-dau-olympic-nam-nao-1.jpg',
    instructor: 'Annette Black',
    instructorTitle: 'Director, Producer',
    isNew: true,
    courseTag: 'Cầu lông',
  },
]

const { Title, Paragraph } = Typography

const PrivateLearning = () => {

  return (
    <PrivateContainer>
      <Title level={2} className="d-flex-center">Lớp học riêng tư với những giảng viên tốt nhất</Title>
      <Paragraph className="d-flex-center mb-55">Học tập 1:1 với giảng viên đáng tin cậy, trực tiếp hoặc trực tuyến.</Paragraph>
      <Row gutter={[16, 16]} justify="center">
        {tutors.map((tutor, index) => (
          <Col key={index} xs={24} sm={12} md={8} xl={8}>
            <Card
              hoverable
              cover={<img alt={tutor.title} src={tutor.image} style={{ height: '350px' }} />}
            >
              {tutor.isNew && <Tag color="magenta" style={{ position: 'absolute', top: 10, left: 10 }}>New</Tag>}
              <Tag color="orange" style={{ position: 'absolute', top: 10, right: 10 }}>{tutor.courseTag}</Tag>
              <Card.Meta
                title={tutor.title}
                description={tutor.description}
              />
              <div style={{ marginTop: 16 }}>
                <Avatar src={tutor.image} alt={tutor.instructor} />
                <div style={{ display: 'inline-block', marginLeft: 8 }}>
                  <Paragraph style={{ margin: 0 }}>{tutor.instructor}</Paragraph>
                  <Paragraph type="secondary" style={{ margin: 0 }}>{tutor.instructorTitle}</Paragraph>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </PrivateContainer>
  )
}

export default PrivateLearning