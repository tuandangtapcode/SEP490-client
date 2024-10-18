import { HomeContainerStyled } from "./styled"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SubjectService from "src/services/SubjectService"
import { Col, Row } from "antd"
import SpinCustom from "src/components/SpinCustom"
import Search from "./components/Search"
import FamoursTeacher from "./components/FamousTeacher"
import UserService from "src/services/UserService"
import BackgroundChooseTeacher from "./components/BackgroundChooseTeacher"
import SubjectCare from "./components/SubjectCare"
import BackgroundMobileApp from "./components/BackgroundMobileApp"
import BecomeTeacher from "./components/BecomeTeacher"

const HomePage = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [recommendSubjects, setRecommendSSubjects] = useState([])
  const [subject, setSubject] = useState()
  const [teachers, setTeachers] = useState([])

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  const getListRecommendSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListRecommendSubject()
      if (!!res?.isError) return toast.error(res?.msg)
      setRecommendSSubjects(res?.data)
      setSubject(res?.data[0])
    } finally {
      setLoading(false)
    }
  }

  const getListTopTeacherBySubject = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListTopTeacherBySubject(subject?._id)
      if (!!res?.isError) return toast.error(res?.msg)
      setTeachers(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
    getListRecommendSubject()
  }, [])

  useEffect(() => {
    if (!!subject)
      getListTopTeacherBySubject()
  }, [subject])

  return (
    <SpinCustom spinning={loading}>
      <HomeContainerStyled>
        <Row gutter={[0, 16]}>
          <Col span={24} className="d-flex-center mb-70">
            <Search subjects={subjects} />
          </Col>
          <Col span={24} className="d-flex-center mb-50">
            <FamoursTeacher
              recommendSubjects={recommendSubjects}
              teachers={teachers}
              subject={subject}
              setSubject={setSubject}
            />
          </Col>
          <Col span={24} className="mb-50">
            <BackgroundChooseTeacher />
          </Col>
          <Col span={24} className="d-flex-center mb-50">
            <SubjectCare />
          </Col>
          <Col span={24} className="d-flex-center mb-50">
            <BackgroundMobileApp />
          </Col>
          <Col span={24} className="d-flex-center mb-50">
            <BecomeTeacher />
          </Col>
        </Row>
      </HomeContainerStyled>
    </SpinCustom>
  )
}

export default HomePage