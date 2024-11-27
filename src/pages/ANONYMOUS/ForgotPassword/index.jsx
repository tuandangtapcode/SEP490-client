import { Steps } from "antd"
import { MainProfileWrapper } from "../TeacherDetail/styled"
import { ForgotPasswordStyled } from "./styled"
import { useState } from "react"
import CheckEmailExist from "./components/CheckEmailExist"
import VerifyEmailWithGoogle from "./components/VerifyEmailWithGoogle"
import EnterNewPassword from "./components/EnterNewPassword"

const ForgotPassword = () => {

  const [current, setCurrent] = useState(0)
  const [email, setEmail] = useState("")

  const steps = [
    {
      title: "Tìm tài khoản của bạn",
      content: (
        <CheckEmailExist
          setCurrent={setCurrent}
          setEmail={setEmail}
        />
      )
    },
    {
      title: "Xác thực với Google",
      content: (
        <VerifyEmailWithGoogle
          email={email}
          setCurrent={setCurrent}
        />
      )
    },
    {
      title: "Nhập mật khẩu với",
      content: (
        <EnterNewPassword email={email} />
      )
    },
  ]

  const items = steps.map((item) => ({
    key: item.title,
  }))

  return (
    <ForgotPasswordStyled>
      <MainProfileWrapper>
        <Steps
          current={current}
          items={items}
          progressDot={true}
        />
        {steps[current].content}
        {/* <Form form={form}>
          <Row>
            <Col span={24}>
              <div className="fw-600 fs-25 mb-24">Tìm tài khoản của bạn</div>
            </Col>
            <Col span={24} className="mb-16">
              <div className="fs-16">Vui lòng nhập email để tìm kiếm tài khoản của bạn.</div>
            </Col>
            <Col span={24}>
              <Form.Item
                name="Email"
                rules={[
                  { required: true, message: "Hãy nhập vào email của bạn" },
                  { pattern: getRegexEmail(), message: "Email sai định dạng" }
                ]}
              >
                <InputCustom
                  placeholder="Email"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Space className="d-flex-end">
                <ButtonCustom
                  className="third"
                  onClick={() => navigate(`${Router.DANG_NHAP}`)}
                >
                  Hủy
                </ButtonCustom>
                <ButtonCustom
                  className="primary"
                  htmlType="submit"
                  loading={loading}
                  onClick={() => handleSubmit()}
                >
                  Tìm kiếm
                </ButtonCustom>
              </Space>
            </Col>
          </Row>
        </Form> */}
      </MainProfileWrapper>
    </ForgotPasswordStyled>
  )
}

export default ForgotPassword