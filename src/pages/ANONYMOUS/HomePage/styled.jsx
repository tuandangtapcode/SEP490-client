import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const HeaderContainer = styled.div`
  /* text-align: center; */
  padding: 50px 20px;
`

export const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 16px;
`

export const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 16px;
`

export const Description = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
`

export const StyledLink = styled(Link)`
font-size: 16px;
`

export const LearningMethodsContainer = styled.div`
  padding: 50px 20px;
  text-align: center;

  .ant-card {
    border-radius: 15px;
  }

  .ant-card-cover {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    overflow: hidden;
  }

  .ant-card-meta-title {
    font-weight: bold;
  }
`

export const PrivateContainer = styled.div`
.private-tutoring-container {
  padding: 50px 20px;
  background-color: #eaf3ff;
  text-align: center;

  .ant-card {
    border-radius: 15px;
    position: relative;
  }

  .ant-card-cover {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    overflow: hidden;
  }

  .ant-card-meta-title {
    font-weight: bold;
  }
}
`

export const TestimonialsContainer = styled.div`
.swiper {
  width: 330px;
  height: 330px;
}

.swiper-slide {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  padding: 20px;
  border-radius: 18px;
  font-size: 22px;
  /* font-weight: bold; */
  color: #000000;
  background-color: #fff;
}

`

export const TeachWithUsContainer = styled.div`
  padding: 50px 20px;
  background-color: #f5f9ff;
`