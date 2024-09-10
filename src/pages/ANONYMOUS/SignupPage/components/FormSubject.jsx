import { Col, Form, Radio, Select } from "antd"
import { useEffect, useState } from "react"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import SubjectService from "src/services/SubjectService"

const { Option } = Select

const FormSubject = ({
  form,
  data,
  setData,
  handleRegister,
  loading
}) => {

  const [subjects, setSubjects] = useState([])
  const [loadingSpin, setLoadingSpin] = useState(false)

  const getListSubject = async () => {
    try {
      setLoadingSpin(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (res?.isError) return
      setSubjects(res?.data?.List)
    } finally {
      setLoadingSpin(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])

  return (
    <SpinCustom spinning={loadingSpin}>
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
          <Radio.Group onChange={e => setData(pre => ({ ...pre, RoleID: e.target.value }))}>
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
      {
        data?.RoleID === 3 &&
        <>
          <Col span={24}>
            <div className="center-text fs-16 mb-8">Chọn 1 môn học từ {subjects?.length} môn học</div>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Subject"
              rules={[
                { required: true, message: "Hãy môn học bạn muốn dạy bạn" },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn môn học"
                onChange={e => setData(pre => ({ ...pre, Subject: e }))}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
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
        </>
      }
      <Col span={24}>
        <ButtonCustom
          className="primary submit-btn fs-18"
          htmlType="submit"
          loading={loading}
          onClick={async () => {
            await form.validateFields()
            handleRegister(data)
          }}
        >
          Đăng ký
        </ButtonCustom>
      </Col>
    </SpinCustom>
  )
}

export default FormSubject