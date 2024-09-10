import { Col, Row } from 'antd'
import CardItem from './CardItem'


const CardList = ({ data }) => {

  return (
    <Row gutter={[16, 16]}>
      {data?.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={6}>
          <CardItem {...item} />
        </Col>
      ))}
    </Row>
  )
}

export default CardList
