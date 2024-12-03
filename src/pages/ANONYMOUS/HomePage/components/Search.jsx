import ListIcons from "src/components/ListIcons"
import { Col, Form, message, Row, Select } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { SearchContainerStyled } from "../styled"
import SubjectService from "src/services/SubjectService"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import { useNavigate } from "react-router-dom"
import Router from "src/routers"

const { Option } = Select

const Search = ({ setPrompt }) => {

  const { listSystemKey } = useSelector(globalSelector)
  const [subjects, setSubjects] = useState([])
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    Subject: "",
    Level: [],
    LearnType: []
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
      console.log()
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])


  return (
    <SearchContainerStyled>
      <Form form={form}>
        <Row gutter={[16, 16]} className="d-flex-center">
          <Col span={7}>
            <div className="d-flex align-items-center mb-8">
              {ListIcons.ICON_SUBJECT_CATE_PRIMARY_COLOR}
              <p className="primary-text ml-8 fw-500 fs-17">Môn học</p>
            </div>
            <div className="ml-24">
              <Select
                style={{ width: "100%" }}
                showSearch
                allowClear
                placeholder="Chọn môn học"
                onChange={e => setSearchData(pre => ({ ...pre, Subject: e }))}
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
            </div>
          </Col>
          <Col span={7}>
            <div className="d-flex align-items-center mb-8">
              {ListIcons.ICON_SUBJECT_CATE_PRIMARY_COLOR}
              <p className="primary-text ml-8 fw-500 fs-17">Trình độ của bạn</p>
            </div>
            <div className="ml-24">
              <Select
                style={{ width: "100%" }}
                mode="multiple"
                allowClear
                placeholder="Chọn môn học"
                onChange={e => setSearchData(pre => ({ ...pre, Level: e }))}
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
            </div>
          </Col>
          <Col span={7}>
            <div className="d-flex align-items-center mb-8">
              {ListIcons.ICON_SUBJECT_CATE_PRIMARY_COLOR}
              <p className="primary-text ml-8 fw-500 fs-17">Hình thức học bạn muốn</p>
            </div>
            <div className="ml-24">
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn hình thức học"
                onChange={e => setSearchData(pre => ({ ...pre, LearnType: e }))}
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
            </div>
          </Col>
          <Col span={3} className="d-flex-center">
            <ButtonCustom
              className="yellow-btn submit-btn mt-23"
              onClick={() => {
                if (!searchData?.Subject) {
                  return message.error("Hãy chọn môn học")
                }
                navigate(
                  `${Router.TIM_KIEM_GIAO_VIEN}/${searchData?.Subject}`,
                  { state: searchData }
                )
              }}
            >
              Tìm
            </ButtonCustom>
          </Col>
          <Col span={23}>
            <InputCustom
              type="isSearch"
              placeholder="Tìm theo nhu cầu của bạn..."
              allowClear
              onSearch={e => setPrompt(e)}
            />
          </Col>
        </Row>
      </Form>
    </SearchContainerStyled>
  )
}

export default Search