import { Button, Col, Row, Typography } from "antd"
import CardList from "./components/Card/CardList"
import LearningMethod from "./components/LearningMethod/LearningMethod"
import { HeaderContainer, StyledLink } from "./styled"
import PrivateLearning from "./components/PrivateLearning/PrivateLearning"
import Testimonials from "./components/Testimonials/Testimonials"
import TeachWithUs from "./components/TeachWithUs/TeachWithUs"
import SubjectCateService from "src/services/SubjectCateService"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const { Title, Paragraph } = Typography

const HomePage = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [listSubjectCate, setListSubjectCate] = useState([])
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 4,
  })

  const getListSubjectCate = async () => {
    try {
      setLoading(true)
      const res = await SubjectCateService.getListSubjectCate(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListSubjectCate(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (pagination.PageSize)
      getListSubjectCate()
  }, [pagination])

  return (
    <HeaderContainer>
      <Row gutter={[16, 16]}>
        <Col span={11}>
          <div>
            <Title level={1} className="fw-700">It`s a Big World Out There, Go explore</Title>
            <Title level={2}>It`s a Big World Out There, Go explore</Title>
            <Paragraph>
              Embrace life`s vastness, venture forth, and discover the wonders waiting beyond. The world beckons; seize its grand offerings now!
            </Paragraph>
            <Button type="primary" size="large" onClick={() => navigate("/tim-kiem-mon-hoc")}>Bát đầu học ngay</Button>
          </div>
        </Col>
        <Col span={13}></Col>
        <Col span={24} className="mt-60">
          <CardList
            listSubjectCate={listSubjectCate}
          />
          <StyledLink to={"/tim-kiem-mon-hoc"}>Học tập với hơn 300 môn học </StyledLink>
        </Col>
        {/* Rất nhiều cách để bạn có thể học tập  */}
        <Col span={24} className="mt-60">
          <LearningMethod />
        </Col>
        {/* Lớp học riêng tư với những giảng viên tốt nhất */}
        <Col span={24} className="mt-60">
          <PrivateLearning />
        </Col>
        {/* Nhận xét từ những học viên và giảng viên */}
        <Col span={24} className="mt-60">
          <Testimonials />
        </Col>
        <Col span={24} className="mt-60">
          <TeachWithUs />
        </Col>
      </Row>
    </HeaderContainer>
  )
}

export default HomePage