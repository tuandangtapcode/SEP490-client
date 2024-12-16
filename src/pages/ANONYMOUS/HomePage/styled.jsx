import styled from 'styled-components'
import { Button } from "antd";

export const HomeContainerStyled = styled.div`
`

export const SearchContainerStyled = styled.div`
  width: 80%;
  background-color: white;
  padding: 24px 16px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
`

export const SearchByAIContainerStyled = styled.div`
  width: 80%;
  padding: 24px 16px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  .subject-item {
    color: #5f6061;
    font-size: 16px;
    &:hover{
      color: white
    }
  }
`
export const BackgroundImageStyled = styled.div`
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-repeat: no-repeat;
  height: 550px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

export const SubjectCareContainerStyled = styled.div`
  width: 80%;
`

// export const BecomeTeacherContainerStyled = styled.div`
//   width: 80%;
// `
export const ButtonCustom = styled(Button)`
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