import { Col, Row, Typography } from "antd"
import ListIcons from "src/components/ListIcons"
import { FooterContainer, FooterStyled } from "../styled"
import { Link } from "react-router-dom"

const { Title, Paragraph } = Typography

const Footer = () => {

  return (
    <FooterContainer>
      <FooterStyled>
        <Row gutter={[16, 16]} className="d-flex justify-content-space-aroun">
          <Col span={8}>
            <Title level={3} style={{ color: "white" }} className="fw-700">Liên hệ</Title>
            {/* <Paragraph className="white-text">
              The quick fox jumps over the lazy dog
            </Paragraph> */}
            <div className="d-flex">
              <div className="mr-10">
                {ListIcons?.ICON_FACEBOOK}
              </div>
              <div className="mr-10">
                {ListIcons?.ICON_INSTAGRAM}
              </div>
              <div className="mr-10">
                {ListIcons?.ICON_TWITTER}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} xl={8}>
            <Title level={3} style={{ color: "white" }} className="fw-700">Thông tin dự án</Title>
            <div className="d-flex flex-column g-10">
              <Link className="white-text">Về chúng tôi</Link>
              <Link className="white-text">Cách hoạt động</Link>
              <Link className="white-text">Blog</Link>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} xl={8}>
            <Title level={3} style={{ color: "white" }} className="fw-700">Tính năng</Title>
            <div className="d-flex flex-column g-10">
              <Link className="white-text">Bài đăng của học sinh</Link>
              <Link className="white-text">User Analytic</Link>
              <Link className="white-text">Live Chat</Link>
              <Link className="white-text">Unlimited Support</Link>
            </div>
          </Col>
        </Row>
      </FooterStyled>
      <div className="p-10 center-text white-text">Copryright © Talent LearningHub. All Right Reserved. </div>
    </FooterContainer>
  )
}

export default Footer