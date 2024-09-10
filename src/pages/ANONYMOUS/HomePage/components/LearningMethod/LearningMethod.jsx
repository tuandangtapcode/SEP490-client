import { Card, Col, Row, Typography } from 'antd'
import { LearningMethodsContainer } from '../../styled'

const { Title, Paragraph } = Typography

const learningMethods = [
  {
    title: 'Học tập riêng tư',
    description: 'Học tập 1 kèm 1 với giảng viên chuyên môn',
    image: '/assets/private_tutoring.png',
    backGroundColor: 'blue',
    color: 'while',
  },
  {
    title: 'Lớp học online',
    description: 'Tham gia các lớp học online giảng viên tổ chức',
    image: '/assets/online_classes.png',
    backGroundColor: 'blue',
    color: 'while',
  },
  {
    title: 'Videos',
    description: 'Video hấp dẫn, chuyên biệt từ các chuyên gia',
    image: '/assets/videos.png',
    backGroundColor: 'blue',
    color: 'while',
  },
]

const LearningMethod = () => {

  return (
    <LearningMethodsContainer>
      <Title level={2} className='mb-40'>Rất nhiều cách để bạn có thể học tập</Title>
      <Row gutter={[16, 16]} justify="center">
        {learningMethods.map((method, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ backgroundColor: method?.backgroundColor, color: method?.color }}
            // cover={<img alt={method.title} src={method.image} />}
            >
              <Card.Meta title={method.title} description={method.description} />
            </Card>
          </Col>
        ))}
      </Row>
    </LearningMethodsContainer>
  )
}

export default LearningMethod
