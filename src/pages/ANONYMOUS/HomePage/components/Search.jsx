import ListIcons from "src/components/ListIcons"
import { Col, Row, Select } from "antd"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { Link, useNavigate } from "react-router-dom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { SearchContainerStyled } from "../styled"
import SubjectService from "src/services/SubjectService"
import { toast } from "react-toastify"
import Router from "src/routers"

const { Option } = Select

const Search = () => {

  const { listSystemKey } = useSelector(globalSelector)
  const [subjects, setSubjects] = useState([])
  const timeOutRef = useRef(null)
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10
  })
  const [searchData, setSearchData] = useState({
    Subject: "",
    Level: [],
    LearnType: []
  })

  const getListSubject = async () => {
    try {
      const res = await SubjectService.getListSubject(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      console.log()
    }
  }

  useEffect(() => {
    getListSubject()
  }, [pagination])


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
              onPopupScroll={e => {
                const target = e.currentTarget
                if (target.scrollHeight + target.scrollTop >= target.clientHeight) {
                  setPagination(pre => ({ ...pre, CurrentPage: pre.CurrentPage + 1 }))
                }
              }}
              onSearch={(e) => {
                if (timeOutRef.current) {
                  clearTimeout(timeOutRef.current)
                }
                timeOutRef.current = setTimeout(() => {
                  setPagination((pre) => ({ ...pre, TextSearch: e }))
                  timeOutRef.current = null
                }, 400)
              }}
              filterOption={false}
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
          <ButtonCustom
            className="yellow-btn submit-btn mt-23"
          // onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${Sear}`)}
          >
            Tìm
          </ButtonCustom>
        </Col>
      </Row>
    </SearchContainerStyled>
  )
}

export default Search