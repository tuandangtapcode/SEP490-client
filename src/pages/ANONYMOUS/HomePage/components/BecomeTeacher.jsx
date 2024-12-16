// import ButtonCustom from "src/components/MyButton/ButtonCustom"
// import { BecomeTeacherContainerStyled } from "../styled"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"
import styled from "styled-components";
import { Button } from "antd";
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TextContainer = styled.div`
  max-width: 60%;
`;

const Title = styled.p`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const ButtonCustom = styled(Button)`
  background-color: #f7c600;
  color: #fff;
  font-weight: 600;
  width: 200px;
  height: 50px;
  border: none;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f7b700;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const BecomeTeacher = () => {

  const navigate = useNavigate()

  return (
    <Container>
      <TextContainer>
        <Title>Trở thành giáo viên của Tatuboo</Title>
        <Description>
          Trở thành giáo viên của Tatuboo là cơ hội để bạn chia sẻ kiến thức,
          truyền cảm hứng và giảng dạy cho học viên, đồng thời phát triển sự nghiệp
          giáo dục trong một môi trường chuyên nghiệp và sáng tạo.
        </Description>
      </TextContainer>
      <div>
        <ButtonCustom className="big-size fw-700"
          onClick={() => navigate(Router.DANG_KY)}
        >
          Đăng ký ngay
        </ButtonCustom>
      </div>
    </Container>
  )
}

export default BecomeTeacher