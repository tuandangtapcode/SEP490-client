import { HomeContainerStyled } from "./styled"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Col, Row } from "antd"
import SpinCustom from "src/components/SpinCustom"
import Search from "./components/Search"
import FamoursTeacher from "./components/FamousTeacher"
import UserService from "src/services/UserService"
import BackgroundChooseTeacher from "./components/BackgroundChooseTeacher"
import SubjectCare from "./components/SubjectCare"
import BackgroundMobileApp from "./components/BackgroundMobileApp"
import BecomeTeacher from "./components/BecomeTeacher"
import CommonService from "src/services/CommonService"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { Roles } from "src/lib/constant"

const HomePage = () => {

  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [prompt, setPrompt] = useState("")
  const { user } = useSelector(globalSelector)

  const getListTeacherRecommend = async () => {
    try {
      setLoading(true)
      let res
      if (!!user?._id && user?.RoleID === Roles.ROLE_STUDENT) {
        res = await CommonService.teacherRecommendationByLearnHistory()
      } else if (!!prompt) {
        res = await CommonService.teacherRecommend({
          prompt: prompt
        })
      } else {
        res = await UserService.getListTopTeacher()
      }
      if (!!res?.isError) return toast.error(res?.msg)
      setTeachers(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListTeacherRecommend()
  }, [prompt, user])

  return (
    <SpinCustom spinning={loading}>
      <HomeContainerStyled>
        <Row gutter={[0, 16]}>
          <Col span={24} className="d-flex-center mb-70">
            <Search setPrompt={setPrompt} />
          </Col>
          <Col span={24} className="d-flex-center mb-50">
            <FamoursTeacher
              teachers={teachers}
              prompt={prompt}
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