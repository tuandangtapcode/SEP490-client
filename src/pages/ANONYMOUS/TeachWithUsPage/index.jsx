import { Author, Button, Container, ContentContainer, IconContainer, ImageContainer, Item, ItemsContainer, ItemText, ItemTitle, Quote, SectionContainer, Title } from "./styled"

const TeachWithUsPage = () => {

  return (
    <>
      <Container>
        <ImageContainer>
          <img src="https://images.ctfassets.net/szez98lehkfm/5dZZa7qL262Syd6qp3SFX9/57408abc173bb10e515eb2646ebe1833/MyIC_Article_105842?fm=webp" alt="Piano lesson" />
        </ImageContainer>
        <ContentContainer>
          <Quote>Giáo dục là vũ khí mạnh mẽ nhất mà bạn có thể sử dụng để thay đổi thế giới.</Quote>
          <Author>--- Nelson Mandela ---</Author>
          <Button>Bắt đầu ngay!</Button>
        </ContentContainer>
      </Container>
      <SectionContainer>
        <Title>Tại sao nên chọn dạy học qua TatuBoo?</Title>
        <ItemsContainer>
          <Item>
            <IconContainer>
              {/* <CalendarOutlined /> */}
            </IconContainer>
            <ItemTitle>Dạy theo cách của bạn</ItemTitle>
            <ItemText>Hãy là ông chủ của riêng bạn! Cung cấp các bài học riêng, dạy các lớp nhóm và tạo nội dung được ghi sẵn – tất cả đều theo lịch trình của riêng bạn!</ItemText>
          </Item>
          <Item>
            <IconContainer>
              {/* <UserOutlined /> */}
            </IconContainer>
            <ItemTitle>Trở thành một phần của cộng đồng gia sư TatuBoo</ItemTitle>
            <ItemText>Chia sẻ ý tưởng và các phương pháp hay nhất với hàng nghìn gia sư khác trên khắp Việt Nam!</ItemText>
          </Item>
          <Item>
            <IconContainer>
              {/* <CreditCardOutlined /> */}
            </IconContainer>
            <ItemTitle>Nhận lương từ học viên</ItemTitle>
            <ItemText>Không giống như các công ty khác, TakeLessons thực hiện công việc nặng nhọc là giao trực tiếp cho bạn những học viên được trả lương đầy đủ</ItemText>
          </Item>
          <Item>
            <IconContainer>
              {/* <BarChartOutlined /> */}
            </IconContainer>
            <ItemTitle>Loại bỏ công việc bận rộn</ItemTitle>
            <ItemText>Là đối tác tích cực của bạn, chúng tôi xử lý tất cả hoạt động tiếp thị và thanh toán cho sinh viên để bạn có thể tập trung vào việc giảng dạy.</ItemText>
          </Item>
        </ItemsContainer>
        <Button>Bắt đầu ngay!</Button>
      </SectionContainer>
    </>
  )
}

export default TeachWithUsPage