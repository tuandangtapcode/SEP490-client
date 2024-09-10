import { Button, Col, Row, Typography } from "antd"
import { TeachWithUsContainer } from "../../styled"

const { Title, Paragraph } = Typography

const TeachWithUs = () => {
  
  return (
    <TeachWithUsContainer>
      <Row>
        <Col span={24}>
          <Title level={3}>Giảng dạy với chúng tôi</Title>
          <Paragraph>Chia sẻ kiến thức của bạn và phát triển mạng lưới học viên của bạn với TaTuBoo.</Paragraph>
        </Col>
        <Col span={24}>
          <Button type="primary">Bắt đầu ngay</Button>
        </Col>
      </Row>
    </TeachWithUsContainer>
  )
}

export default TeachWithUs