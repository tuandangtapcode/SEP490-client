import ButtonCustom from "src/components/MyButton/ButtonCustom"
import ImageFindTeacher from "/group194.png"
import { BackgroundImageStyled } from "../styled"
import BackgroundChooseTeacherImage from "/group238.png"

const BackgroundChooseTeacher = () => {

  return (
    <BackgroundImageStyled bgImage={BackgroundChooseTeacherImage}>
      <img
        src={ImageFindTeacher}
        alt=""
        style={{
          width: "500px",
          height: "500px"
        }}
      />
      <div>
        <p className="white-text fs-25 fw-700 mb-12">Chọn cho mình một giáo viên thích hợp!</p>
        <div className="d-flex-center">
          <ButtonCustom
            className="yellow-btn big-size fw-700"
          >
            Book Now
          </ButtonCustom>
        </div>
      </div>
    </BackgroundImageStyled>
  )
}

export default BackgroundChooseTeacher