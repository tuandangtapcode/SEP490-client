import styled from 'styled-components'

export const HomeContainerStyled = styled.div`
  /* text-align: center; */
  /* padding: 50px 20px; */
`

export const SearchContainerStyled = styled.div`
  width: 80%;
  background-color: white;
  padding: 24px 16px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
`

export const TopTeacherItemStyled = styled.div`
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 12px;
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

export const BecomeTeacherContainerStyled = styled.div`
  width: 80%;
`
