import ListIcons from "src/components/ListIcons"
import { Col, Row, Select } from "antd"
import { useState } from "react"
import { SearchContainerStyled } from "../../styled"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { Link } from "react-router-dom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"

const { Option } = Select

const Search = ({ subjects }) => {

  const { listSystemKey } = useSelector(globalSelector)
  const [searchData, setSearchData] = useState({
    Subject: "",
    Level: [],
    LearnType: []
  })

  return (
    <SearchContainerStyled>
      <Row gutter={[16]} className="d-flex-sb">
        <Col span={7}>
          <div className="d-flex align-items-center mb-8">
            {ListIcons.ICON_SUBJECT_CATE_PRIMARY_COLOR}
            <p className="primary-text ml-8 fw-500 fs-17">Môn học</p>
          </div>
          <div className="ml-24">
            <Select
              style={{ width: "100%" }}
              showSearch
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
          <ButtonCustom className="yellow-btn medium-size mt-23">
            <Link>Tìm</Link>
          </ButtonCustom>
        </Col>
      </Row>
    </SearchContainerStyled>
  )
}

export default Search