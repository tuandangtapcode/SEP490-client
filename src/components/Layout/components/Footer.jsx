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
            <Title level={3} style={{ color: "white" }} className="fw-700">Get In Touch</Title>
            <Paragraph className="white-text">
              The quick fox jumps over the lazy dog
            </Paragraph>
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
            <Title level={3} style={{ color: "white" }} className="fw-700">Company info</Title>
            <div className="d-flex flex-column g-10">
              <Link className="white-text">About Us</Link>
              <Link className="white-text">Carrier</Link>
              <Link className="white-text">We are hiring</Link>
              <Link className="white-text">Blog</Link>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} xl={8}>
            <Title level={3} style={{ color: "white" }} className="fw-700">Features</Title>
            <div className="d-flex flex-column g-10">
              <Link className="white-text">Business Marketing</Link>
              <Link className="white-text">User Analytic</Link>
              <Link className="white-text">Live Chat</Link>
              <Link className="white-text">Unlimited Support</Link>
            </div>
          </Col>
        </Row>
      </FooterStyled>
      <div className="p-10 center-text white-text">Copryright © TatuBoo. All Right Reserved. </div>
    </FooterContainer>
  )
}

export default Footer