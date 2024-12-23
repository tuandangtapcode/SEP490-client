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
