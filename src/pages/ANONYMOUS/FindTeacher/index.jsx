import { Button, Col, Row, Typography } from "antd"
import { FindTeacherContainer } from "./styled"
import InputCustom from "src/components/InputCustom"
import ListSubject from "./components/ListSubject"
import PrivateLearning from "../HomePage/components/PrivateLearning/PrivateLearning"
import { useParams } from "react-router-dom"
import SubjectCateService from "src/services/SubjectCateService"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"

const { Title } = Typography

const FindTeacher = () => {

  const id = useParams()
  const [loading, setLoading] = useState(false)
  const [listSubject, setListSubject] = useState([])
  const [subjectCate, setSubjectCate] = useState([])
  const [pagination, setPagination] = useState({
    TextSearch: "",
    SubjectCateID: id?.SubjectCateID,
    CurrentPage: 1,
    PageSize: 10
  })


  const getDetailSubjectCate = async () => {
    try {
      setLoading(true)
      const res = await SubjectCateService.getDetailSubjectCate(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListSubject(res?.data?.ListSubject)
      setSubjectCate(res?.data?.SubjectCate)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getDetailSubjectCate()
  }, [pagination])

  return (
    <SpinCustom spinning={loading}>
      <FindTeacherContainer>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={1} className="fw-700 center-text mb-20" style={{ maxWidth: '500px', margin: '0 auto' }}>
              Tìm kiếm giảng viên tốt nhất với giá cả phải chăng
            </Title>
          </Col>
          {/* <Col span={24} >
            <InputCustom
              type="isSearch"
              onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
            />
            <div className="d-flex mt-20 g-10">
              <p className=" blue-text fs-20">Môn học phổ biến: </p>
              <Button>Piano</Button>
              <Button>Violin</Button>
              <Button>Guitar</Button>
            </div>
          </Col> */}
          <Col span={24} className="mt-60">
            <ListSubject
              listSubject={listSubject}
              subjectCate={subjectCate}
            />
          </Col>
          {/* Lớp học riêng tư với những giảng viên tốt nhất
        <Col span={24} className="mt-60">
          <PrivateLearning />
        </Col> */}
        </Row>
      </FindTeacherContainer>
    </SpinCustom>
  )
}

export default FindTeacher