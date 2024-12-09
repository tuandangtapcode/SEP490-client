import { Checkbox, Col, Radio, Row, Slider } from "antd"
import {
  FilterSection,
  FilterTitle,
  MentorForSubjectContainer,
  Sidebar,
} from "./styled"

import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import { useEffect, useState } from 'react'
import SpinCustom from 'src/components/SpinCustom'
import UserService from 'src/services/UserService'
import { useNavigate, useParams } from 'react-router-dom'
import TeacherItem from './components/TeacherItem'
import SubjectService from "src/services/SubjectService"
import { toast } from "react-toastify"

const MentorForSubject = () => {

  const { SubjectID } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [total, setTotal] = useState([])
  const [subject, setSubject] = useState()
  const [pagination, setPagination] = useState({
    TextSearch: "",
    SubjectID: !!SubjectID ? SubjectID : "",
    CurrentPage: 1,
    PageSize: 10,
    LearnType: [],
    Level: [],
    FromPrice: 0,
    ToPrice: 500000,
    SortByPrice: 1,
    Gender: 0
  })

  const { listSystemKey } = useSelector(globalSelector)

  const getListTeacherByUser = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListTeacherByUser(pagination)
      if (!!res?.isError) return navigate("/not-found")
      setTeachers(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  const getDetailSubject = async () => {
    try {
      const res = await SubjectService.getDetailSubject(SubjectID)
      if (!!res?.isError) return toast.error(res?.msg)
      setSubject(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetailSubject()
  }, [SubjectID])

  useEffect(() => {
    if (!!subject) {
      getListTeacherByUser()
    }
  }, [pagination, subject])

  return (
    <SpinCustom spinning={loading}>
      <MentorForSubjectContainer>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Sidebar>
              <FilterSection className="mb-10">
                <InputCustom
                  type="isSearch"
                  allowClear
                  onSearch={(e) =>
                    setPagination({
                      ...pagination,
                      TextSearch: e,
                    })
                  }
                  placeholder="Nhập tên giáo viên cần tìm..."
                />
              </FilterSection>
              <FilterSection className="mb-10">
                <FilterTitle level={5}>Hình thức học tập</FilterTitle>
                <Checkbox.Group>
                  <Row>
                    <Col span={24}>
                      <Checkbox.Group
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            LearnType: e,
                          })
                        }
                      >
                        {
                          getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey).map(type => (
                            <Checkbox key={type?.ParentID} value={type?.ParentID}>
                              <div className="d-flex align-items-center">
                                <p>{type?.ParentName}</p>
                              </div>
                            </Checkbox>
                          ))
                        }
                      </Checkbox.Group>
                    </Col>

                  </Row>
                </Checkbox.Group>
              </FilterSection>
              <FilterSection className="mb-10">
                <FilterTitle level={5}>Học phí (VNĐ)</FilterTitle>
                <Slider
                  range
                  min={0}
                  max={2000000}
                  defaultValue={[0, 500000]}
                  tipFormatter={value => `${value} VNĐ`}
                  onChangeComplete={(e) =>
                    setPagination({
                      ...pagination,
                      FromPrice: e[0] / 1000,
                      ToPrice: e[1] / 1000,
                    })
                  }
                />
              </FilterSection>
              <FilterSection className="mb-10">
                <FilterTitle level={5}>Mức độ học tập</FilterTitle>
                <Checkbox.Group
                  onChange={(e) =>
                    setPagination({
                      ...pagination,
                      Level: e,
                    })
                  }
                >
                  {
                    getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey).map(level => (
                      <Checkbox key={level?.ParentID} value={level?.ParentID}>
                        {level?.ParentName}
                      </Checkbox>
                    ))
                  }
                </Checkbox.Group>
              </FilterSection>
              <FilterSection>
                <FilterTitle level={5}>Giới tính</FilterTitle>
                <Radio.Group
                  onChange={(e) =>
                    setPagination({
                      ...pagination,
                      Gender: e.target.value,
                    })
                  }
                >
                  {
                    getListComboKey(SYSTEM_KEY.GENDER, listSystemKey).map(level => (
                      <Radio key={level?.ParentID} value={level?.ParentID}>
                        {level?.ParentName}
                      </Radio>
                    ))
                  }
                </Radio.Group>
              </FilterSection>
            </Sidebar>
          </Col>
          <Col span={18}>
            <Sidebar>
              <div className="d-flex align-items-center mb-12">
                <div className="fs-17 fw-700 mr-4">{subject?.SubjectName}</div>
                <p className='gray-text'>({total} Kết quả tìm được)</p>
              </div>
              <div className="mb-12">{subject?.Description}</div>
              <div className="d-flex-center">
                <img src={subject?.AvatarPath} alt="" />
              </div>
            </Sidebar>
          </Col>
          <Col span={24}>
            <Row>
              {
                !!teachers.length ?
                  teachers?.map((i, idx) =>
                    <Col span={6} key={idx}>
                      <TeacherItem
                        teacherItem={i}
                        subjectID={SubjectID}
                      />
                    </Col>
                  )
                  :
                  <h2 className='center-text'>Không có giáo viên nào!</h2>
              }
            </Row>
          </Col>
        </Row>
      </MentorForSubjectContainer >
    </SpinCustom >
  )
}

export default MentorForSubject