import { Button, Card, Checkbox, Space, Typography } from "antd"
import styled from "styled-components"

const { Title } = Typography

export const MentorForSubjectContainer = styled.div`
  /* text-align: center; */
  padding: 50px 20px;
`

export const Sidebar = styled.div`
  padding: 20px;
  background-color: #eaf3ff;
`

export const FilterTitle = styled(Title)`
  font-size: 16px !important;
`

export const FilterSection = styled.div`
  margin-bottom: 20px;
`

export const StyledCard = styled(Card)`
  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
  }
`

export const DayButton = styled(Button)`
  width: 25px;
  height: 25px;
  /* margin: 5px; */
  padding: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TimeSlotButton = styled(Button)`
  width: 100px;
  margin-bottom: 10px;
  /* padding: 5px 10px; */
  border-radius: 8px;
`

export const DayContainer = styled(Space)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 10px;
`