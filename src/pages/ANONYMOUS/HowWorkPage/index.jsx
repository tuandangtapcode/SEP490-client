import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Typography, Divider } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import styled,  { keyframes } from "styled-components";

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 50px 20px;
  background: #f0f5ff;
`;

const StepCard = styled(Card)`
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 20px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  img {
    border-radius: 15px;
    margin-bottom: 15px;
    width: 100%;
    height: 200px; 
    object-fit: cover; 
  }
`;
const fadeInSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedTitle = styled(Title)`
  animation: ${fadeInSlide} 1s ease-out;
  text-align: center;
  margin-bottom: 40px;
`;
const StyledButton = styled(Button)`
  margin-top: 25px;
  height: 50px;
  font-size: 18px;
  background-color: #40a9ff;
  border: none;
  border-radius: 25px;
  transition: transform 0.3s;

  &:hover {
    background-color: #1890ff;
    transform: scale(1.05);
  }
`;

const GuaranteeContainer = styled.div`
  background: #e6f7ff;
  padding: 40px 20px;
  border-radius: 20px;
  text-align: center;
  margin-top: 30px;

  .ant-divider-horizontal {
    border-top: 1px solid #d9d9d9;
  }
`;

const HowWorkPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "1. Chọn môn học",
      image:
        "https://genk.mediacdn.vn/thumb_w/640/2013/Untitled-66dd9.png",
      description:
        "Hơn 100 môn học đa dạng, được hướng dẫn bởi đội ngũ hơn 1.000 gia sư giàu kinh nghiệm và chuyên môn, đảm bảo đáp ứng mọi nhu cầu học tập và sở thích cá nhân của bạn.",
    },
    {
      title: "2. Chọn lịch học",
      image:
        "https://tmetric.com/media/qfwptni2/work-schedules-header-banner.png",
      description:
        "Hãy lựa chọn lịch học của bạn sao cho phù hợp nhất với lịch trình cá nhân và thời gian giảng dạy của giáo viên, đảm bảo sự thuận tiện cho cả hai bên trong việc sắp xếp thời gian học tập và giảng dạy.",
    },
    {
      title: "3. Chọn cách học",
      image:
        "https://st3.depositphotos.com/1005979/18807/i/450/depositphotos_188072390-stock-photo-online-offline-communication-venn-diagram.jpg",
      description:
        "Cam kết mang đến cho bạn cơ hội kết nối với đội ngũ giáo viên chất lượng cao, đáp ứng nhu cầu học tập thông qua các buổi học 1 kèm 1, diễn ra trực tiếp tại nhà hoặc thông qua hình thức học online.",
    },
    {
      title: "4. Xác nhận đặt lịch",
      image:
        "https://img.freepik.com/vecteurs-premium/icone-marque-controle-verte-isolee-fond-blanc-sign-symbolvector-designeps-10_1224031-925.jpg?semt=ais_hybrid",
      description:
        "Xác nhận đặt lịch là bước tiếp theo để hoàn tất quá trình lựa chọn thời gian học, đảm bảo rằng lịch học đã được thống nhất và ghi nhận chính xác giữa bạn và giáo viên.",
    },
    {
      title: "5. Chờ duyệt và thanh toán",
      image:
        "https://thumbs.dreamstime.com/b/conceptual-caption-confirm-pay-concept-meaning-check-out-your-purchases-make-payment-confirmation-important-news-writing-254080747.jpg",
      description:
        "Chờ duyệt và thanh toán là giai đoạn bạn cần đợi sự xác nhận từ phía giáo viên, sau đó tiến hành thanh toán để hoàn tất quá trình đăng ký và chuẩn bị cho buổi học.",
    },
    {
      title: "6. Bắt đầu học",
      image:
        "https://vuanem.com/blog/wp-content/uploads/2023/03/mon-nang-khieu-dan-1125x750.jpg",
      description:
        "Bạn chính thức tham gia vào buổi học, nơi bạn sẽ tiếp thu kiến thức và tương tác trực tiếp với giáo viên để đạt được những mục tiêu học tập đã đề ra.",
    },
  ];

  return (
    <Container>
      <AnimatedTitle level={2}>Bắt đầu học với ba bước đơn giản</AnimatedTitle>
      <Row gutter={[16, 16]} justify="center">
        {steps.map((step, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <StepCard hoverable>
              <img src={step.image} alt={step.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <Title level={4}>{step.title}</Title>
              <Text>{step.description}</Text>
            </StepCard>
          </Col>
        ))}
      </Row>
      <GuaranteeContainer>
        <SmileOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
        <Title level={3} style={{ marginTop: "10px" }}>
          Đảm bảo sự hài lòng 100%!
        </Title>
        <Divider />
        <Text>
          Hãy thử những bài học đầu tiên và nếu bạn không hài lòng, chúng tôi sẽ tìm cho bạn một bài học phù hợp hơn đi
          kèm với các gia sư chất lượng nhất.
        </Text>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <StyledButton type="primary" onClick={() => navigate("/tim-kiem-mon-hoc")}>
            Bắt đầu học ngay bây giờ!
          </StyledButton>
        </div>
      </GuaranteeContainer>
    </Container>
  );
};

export default HowWorkPage;
