import { Col, Row, Typography } from "antd"
import ListIcons from "src/components/ListIcons"
import { FooterContainer } from "../styled"
import { Link } from "react-router-dom"

const { Title, Paragraph } = Typography

const Footer = () => {

  return (
    <>
      <FooterContainer>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Title level={3} className="fw-700">Get In Touch</Title>
            <Paragraph>
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
            <Title level={3} className="fw-700">Company info</Title>
            <div className="d-flex flex-column g-10">
              <Link className="black-text">About Us</Link>
              <Link className="black-text">Carrier</Link>
              <Link className="black-text">We are hiring</Link>
              <Link className="black-text">Blog</Link>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} xl={8}>
            <Title level={3} className="fw-700">Features</Title>
            <div className="d-flex flex-column g-10">
              <Link className="black-text">Business Marketing</Link>
              <Link className="black-text">User Analytic</Link>
              <Link className="black-text">Live Chat</Link>
              <Link className="black-text">Unlimited Support</Link>
            </div>
          </Col>
        </Row>
      </FooterContainer>
      <p className="p-10 center-text" style={{ backgroundColor: 'whitesmoke' }}>Copryright © TatuBoo. All Right Reserved. </p>
    </>
  )
}

export default Footer