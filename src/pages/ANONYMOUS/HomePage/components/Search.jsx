import ListIcons from "src/components/ListIcons"
import { Col, Form, Row, Select } from "antd"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { SearchContainerStyled } from "../styled"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"
import ButtonCustom from "src/components/MyButton/ButtonCustom"

const { Option } = Select

const Search = ({ subjects }) => {

  const { listSystemKey } = useSelector(globalSelector)
  const [form] = Form.useForm()
  const navigate = useNavigate()


  return (
    <SearchContainerStyled>
      <Form form={form}>
        <Row gutter={[16, 16]} className="d-flex-center">
          <Col xxl={7} xl={7} lg={7} md={24} sm={24} xs={24}>
            <div className="d-flex align-items-center mb-8">
              {ListIcons.ICON_SUBJECT_CATE_PRIMARY_COLOR}
              <p className="primary-text ml-8 fw-500 fs-17">Môn học</p>
            </div>
            <div className="ml-24">
              <Form.Item
                name="Subject"
                rules={[
                  { required: true, message: "Hãy chọn 1 môn học" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  allowClear
                  placeholder="Chọn môn học"
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
            </div>
          </Col>
          <Col xxl={7} xl={7} lg={7} md={24} sm={24} xs={24}>
            <div className="d-flex align-items-center mb-8">
              {ListIcons.ICON_SUBJECT_CATE_PRIMARY_COLOR}
              <p className="primary-text ml-8 fw-500 fs-17">Trình độ của bạn</p>
            </div>
            <div className="ml-24">
              <Form.Item name="Level">
                <Select
                  style={{ width: "100%" }}
                  mode="multiple"
                  allowClear
                  placeholder="Chọn môn học"
                >
                  {
                    getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map(i =>
                      <Option
                        key={i?.ParentID}
                        value={i?.ParentID}
                      >
                        {i?.ParentName}
                      </Option>
                    )
                  }
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col xxl={7} xl={7} lg={7} md={24} sm={24} xs={24}>
            <div className="d-flex align-items-center mb-8">
              {ListIcons.ICON_SUBJECT_CATE_PRIMARY_COLOR}
              <p className="primary-text ml-8 fw-500 fs-17">Hình thức học bạn muốn</p>
            </div>
            <div className="ml-24">
              <Form.Item name="LearnType">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn hình thức học"
                >
                  {
                    getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.map(i =>
                      <Option
                        key={i?.ParentID}
                        value={i?.ParentID}
                      >
                        {i?.ParentName}
                      </Option>
                    )
                  }
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col xxl={3} xl={3} lg={3} md={24} sm={24} xs={24} className="d-flex-center">
            <ButtonCustom
              className="yellow-btn medium-size"
              onClick={async () => {
                const values = await form.validateFields()
                navigate(
                  `${Router.TIM_KIEM_GIAO_VIEN}/${values?.Subject}`,
                  { state: values }
                )
              }}
            >
              Tìm kiếm
            </ButtonCustom>
          </Col>
        </Row>
      </Form>
    </SearchContainerStyled>
  )
}

export default Search