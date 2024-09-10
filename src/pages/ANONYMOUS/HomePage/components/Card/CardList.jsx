import { Col, Row } from 'antd'
import CardItem from './CardItem'


const CardList = ({ listSubjectCate }) => {
  
  return (
    <Row gutter={[16, 16]}>
      {listSubjectCate.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={6}>
          <CardItem {...item} />
        </Col>
      ))}
    </Row>
  )
}

export default CardList
