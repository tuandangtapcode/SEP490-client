import { Col, DatePicker, Form, Radio, Row, Select } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignupContainerStyled } from "./styled"
import UserService from "src/services/UserService"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import { getRegexEmail, getRegexPhoneNumber } from "src/lib/stringUtils"
import SubjectService from "src/services/SubjectService"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { useGoogleLogin } from "@react-oauth/google"
import { disabledBeforeDate } from "src/lib/dateUtils"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"

const { Option } = Select

const SignupPage = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [roleID, setRoleID] = useState()
  const { user } = useSelector(globalSelector)

  const handleRegister = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.register(values)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      navigate('/dang-nhap')
    } finally {
      setLoading(false)
    }
  }

  const validateByGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfor = await UserService.getInforByGoogleLogin(tokenResponse?.access_token)
      if (!!userInfor) {
        const dataFromGoogle = userInfor?.data
        form.setFieldsValue({
          Email: dataFromGoogle.email,
          FullName: dataFromGoogle.given_name,
          AvatarPath: dataFromGoogle.picture,
          IsByGoogle: true
        })
      } else {
        return toast.error("Have something error")
      }
    },
  })

  const getListSubject = async () => {
    try {
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      console.log("")
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])

  useEffect(() => {
    if (!!user?._id) navigate("/")
  }, [])

  return (
    <SignupContainerStyled>
      <Form form={form}>
        <Row gutter={[8]}>
          <Col span={24}>
            <div className="center-text fw-600 fs-25 mb-8">Đăng ký tài khoản</div>
            <div className="center-text">
              <span className="mr-4 mb-8 fs-16">Đã có tài khoản?</span>
              <span className="fs-16 primary-text cursor-pointer" onClick={() => navigate("/dang-nhap")}>Đăng nhập</span>
            </div>
          </Col>
          <Col span={24}>
            <div className="center-text fs-16 mb-12">Vai trò bạn muốn gia nhập với TaTuboo?</div>
          </Col>
          <Col span={24} className="d-flex-center">
            <Form.Item
              name="RoleID"
              rules={[
                { required: true, message: "Hãy chọn vai trò của bạn" },
              ]}
            >
              <Radio.Group onChange={e => setRoleID(e.target.value)}>
                <Radio
                  className="border-radio"
                  key={3}
                  value={3}
                >
                  Giáo viên
                </Radio>
                <Radio
                  className="border-radio"
                  key={4}
                  value={4}
                >
                  Học sinh
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="FullName"
              rules={[
                { required: true, message: "Hãy nhập vào tên của bạn" },
              ]}
            >
              <InputCustom placeholder="Họ và tên" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Email"
              rules={[
                { required: true, message: "Hãy nhập vào email của bạn" },
                { pattern: getRegexEmail(), message: "Email sai định dạng" }
              ]}
            >
              <InputCustom placeholder="Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Phone"
              rules={[
                { required: true, message: "Hãy nhập vào số diện thoại của bạn" },
                { pattern: getRegexPhoneNumber(), message: "Số điện thoại sai định dạng" }
              ]}
            >
              <InputCustom style={{ width: "100%" }} placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="DateOfBirth"
              rules={[
                { required: true, message: "Hãy nhập vào số diện thoại của bạn" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày sinh của bạn"
                format="DD/MM/YYYY"
                disabledDate={current => { disabledBeforeDate(current) }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Address"
              rules={[
                { required: true, message: "Hãy nhập vào địa chỉ của bạn" },
              ]}
            >
              <InputCustom placeholder="Địa chỉ" />
            </Form.Item>
          </Col>
          {
            roleID === 4 &&
            <Col Col span={24}>
              <Form.Item name="Subjects">
                <Select
                  mode="multiple"
                  placeholder="Chọn môn học mà bạn quan tâm"
                  style={{ width: "100%" }}
                >
                  {
                    subjects?.map(i =>
                      <Option
                        key={i?._id}
                        value={i?._id}
                      >
                        {i?.SubjectName}
                      </Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
          }
          {
            roleID === 3 &&
            <Col Col span={24}>
              <Form.Item name="Subject">
                <Select
                  placeholder="Chọn môn học mà bạn dạy"
                  style={{ width: "100%" }}
                >
                  {
                    subjects?.map(i =>
                      <Option
                        key={i?._id}
                        value={i?._id}
                      >
                        {i?.SubjectName}
                      </Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
          }
          <Col span={24}>
            <ButtonCustom
              className="primary submit-btn fs-18"
              htmlType="submit"
              onClick={() => handleRegister()}
              loading={loading}
            >
              Đăng ký
            </ButtonCustom>
          </Col>
          <Col span={24}>
            <div className="center-text  gray-text fs-20 mt-10 mb-10">
              OR
            </div>
          </Col>
          <Col span={24}>
            <ButtonCustom
              className="d-flex-center login-google mb-15"
              onClick={() => {
                validateByGoogle()
              }}
            >
              <span className="icon-google"></span>
              <span className="ml-12">Sign up with Google</span>
            </ButtonCustom>
          </Col>
        </Row>
        <Form.Item name="IsByGoogle"></Form.Item>
        <Form.Item name="AvatarPath"></Form.Item>
      </Form>
    </SignupContainerStyled >
  )
}

export default SignupPage