import { BackgroundImageStyled } from "../styled"
import BackgroundMobileAppImage from "/rectangle159.png"
import ImageMobileApp from "/group243.png"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { Col, Row } from "antd"

const BackgroundMobileApp = () => {

  return (
    <BackgroundImageStyled bgImage={BackgroundMobileAppImage}>
      <Row className="d-flex-sa">
        <Col span={8}>
          <img
            src={ImageMobileApp}
            alt=""
            style={{
              width: "300px",
              height: "400px"
            }}
          />
        </Col>
        <Col span={12}>
          <div>
            <p className="white-text fs-36 fw-700 mb-12">Tatuboo Mobile App</p>
            <p className="white-text fs-20 fw-600 mb-12">Available on Android</p>
            <p className="white-text mb-12">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
            <div className="d-flex-center">
              <ButtonCustom
                className="yellow-btn big-size fw-700"
              >
                Dowload For Android
              </ButtonCustom>
            </div>
          </div>
        </Col>
      </Row>
    </BackgroundImageStyled>
  )
}

export default BackgroundMobileApp