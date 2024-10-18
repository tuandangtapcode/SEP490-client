import { Card, Col, Row, Typography } from "antd"
import { useNavigate, useParams } from "react-router-dom"
import SubjectCateService from "src/services/SubjectCateService"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"
import { ListSubjectContainer, SubjectcateDetailContainer } from "./styled"
import Router from "src/routers"
import InputCustom from "src/components/InputCustom"

const { Title, Paragraph } = Typography

const SubjectcateDetail = () => {

  const { SubjectCateID } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [listSubject, setListSubject] = useState([])
  const [subjectCate, setSubjectCate] = useState([])
  const [pagination, setPagination] = useState({
    TextSearch: "",
    SubjectCateID: SubjectCateID,
    CurrentPage: 1,
    PageSize: 10
  })


  const getDetailSubjectCate = async () => {
    try {
      setLoading(true)
      const res = await SubjectCateService.getDetailSubjectCate(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
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
      <SubjectcateDetailContainer>
        <Row>
          <Col span={24}>
            <ListSubjectContainer>
              <Row gutter={[16, 16]}>
                <Col span={24} className="mb-12">
                  <Title level={3}>
                    Danh sách môn học thuộc {subjectCate?.SubjectCateName}
                  </Title>
                  <InputCustom
                    type="isSearch"
                    placeHolder="Tìm kiếm tên môn học"
                    allowClear
                    onSearch={(e) => setPagination(pre => ({ ...pre, TextSearch: e }))}
                  />
                </Col>
                <Col span={24} className="center-text">
                  <Row gutter={[16, 16]}>
                    {listSubject.map(Subject => (
                      <Col key={Subject.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Card
                          className="cursor-pointer"
                          cover={<img alt={Subject?.SubjectName} src={Subject?.AvatarPath} />}
                          bordered={false}
                          onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${Subject?._id}`)}
                        >
                          <Card.Meta title={Subject.SubjectName} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </ListSubjectContainer>
          </Col>
        </Row>
      </SubjectcateDetailContainer>
    </SpinCustom>
  )
}

export default SubjectcateDetail