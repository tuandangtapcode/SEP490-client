import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { BecomeTeacherContainerStyled } from "../styled"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"

const BecomeTeacher = () => {

  const navigate = useNavigate()

  return (
    <BecomeTeacherContainerStyled>
      <div className="d-flex-sb">
        <div>
          <p className="fs-30 fw-700 mb-8">Trở thành giáo viên của Tatuboo</p>
          <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit</p>
        </div>
        <div>
          <ButtonCustom
            className="yellow-btn medium-size fw-600"
            style={{
              width: "200px"
            }}
            onClick={() => navigate(Router.DANG_KY)}
          >
            Đăng ký ngay
          </ButtonCustom>
        </div>
      </div>
    </BecomeTeacherContainerStyled>
  )
}

export default BecomeTeacher