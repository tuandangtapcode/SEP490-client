import { useNavigate } from "react-router-dom"
import {
  ActionButton,
  Container,
  Description,
  GuaranteeContainer,
  GuaranteeDescription,
  GuaranteeItem,
  GuaranteeList,
  GuaranteeTitle,
  Image,
  Step,
  StepsContainer,
  Title
} from "./styled"

const HowWorkPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <Title>Bắt đầu học với ba bước đơn giản</Title>
      <Container>
        <StepsContainer>
          <Step>
            <p className="center-text fs-20 mb-10 fw-500">1. Chọn môn học</p>
            <Image src="https://trungcaptruongson.edu.vn/images/files/trungcaptruongson.edu.vn/tktr.jpg" alt="Step 1" />
            <Description>
              Từ nhạc cụ, ngoại ngữ, các môn tự chọn, hơn 100 môn học được cung cấp bởi hơn 1000 gia sư
            </Description>
          </Step>
          <Step>
            <p className="center-text fs-20 mb-10 fw-500">2. Chọn cách học</p>
            <Image src="https://dca.edu.vn/wp-content/uploads/2023/03/cac-mon-nang-khieu-cho-tre.jpg" alt="Step 2" />
            <Description>
              Cam kết kết nối với bạn với các gia sư chất lượng, học 1-1 trực tiếp tại nhà hoặc online
            </Description>
          </Step>
          <Step>
            <p className="center-text fs-20 mb-10 fw-500">3. Bắt đầu học</p>
            <Image src="https://vuanem.com/blog/wp-content/uploads/2023/03/mon-nang-khieu-dan-1125x750.jpg" alt="Step 3" />
            <Description>
              Đưa kỹ năng của bạn lên một tầm cao mới với gia sư được chứng nhận. Các bài học tùy chỉnh của bạn được hỗ trợ bởi Đảm bảo sự hài lòng của chúng tôi
            </Description>
          </Step>
        </StepsContainer>
        <ActionButton type="primary" onClick={() => navigate("/tim-kiem-mon-hoc")}>Bắt đầu học ngay bây giờ!</ActionButton>
      </Container>
      <GuaranteeContainer>
        <div style={{ width: "60%", margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>
          <i style={{ marginLeft: "40%" }}>Bài học riêng</i>
          <GuaranteeList>
            <GuaranteeItem>Học các bài học 1:1 với gia sư đáng tin cậy</GuaranteeItem>
            <GuaranteeItem>Học trực tuyến với gia sư hoặc tại nhà</GuaranteeItem>
            <GuaranteeItem>Tùy chọn gói 1, 5, 10 hoặc 15 bài học mỗi khóa</GuaranteeItem>
            <GuaranteeItem>Video, tài liệu và bài tập miễn phí theo yêu cầu của bạn</GuaranteeItem>
          </GuaranteeList>

        </div>
        <GuaranteeTitle>Đảm bảo sự hài lòng 100%!</GuaranteeTitle>
        <GuaranteeDescription>
          Hãy thử những bài học đầu tiên và nếu bạn không hài lòng, chúng tôi sẽ tìm cho bạn một bài học phù hợp hơn đi kèm với các gia sư chất lượng nhất.
        </GuaranteeDescription>
        <div className="d-flex-center">
          <ActionButton type="primary" onClick={() => navigate("/tim-kiem-mon-hoc")} >Bắt đầu học ngay bây giờ!</ActionButton>
        </div>
      </GuaranteeContainer>
    </>
  )
}

export default HowWorkPage