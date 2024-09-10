import { Card, Col, Row, Typography } from "antd"
import { ListSubjectContainer } from "../styled"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"

const { Title, Paragraph } = Typography


const ListSubject = ({ listSubject, subjectCate }) => {

  const navigate = useNavigate()

  return (
    <ListSubjectContainer>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>
            Danh sách môn học thuộc {subjectCate?.SubjectCateName}
          </Title>
          <Paragraph >
            {subjectCate?.Description}
          </Paragraph>
        </Col>
        <Col span={24} className="center-text">
          <Row gutter={[16, 16]}>
            {listSubject.map(Subject => (
              <Col key={Subject.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card
                  className="cursor-pointer"
                  cover={<img alt={Subject?.SubjectName} src={Subject?.AvatarPath} />}
                  bordered={false}
                  onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${Subject?._id}`)}
                >
                  <Card.Meta title={Subject.SubjectName} />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </ListSubjectContainer>
  )
}

export default ListSubject