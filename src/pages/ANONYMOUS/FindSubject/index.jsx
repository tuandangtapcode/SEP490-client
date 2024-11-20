import { Card, Col, Empty, Row, Typography } from "antd"
import SubjectCateService from "src/services/SubjectCateService"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"
import { Link, useNavigate } from "react-router-dom"
import Router from "src/routers"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { MainProfileWrapper } from "../TeacherDetail/styled"

const { Title, Paragraph } = Typography
const { Meta } = Card

const FindSubject = () => {

  const [loading, setLoading] = useState(false)
  const [listSubjectCate, setListSubjectCate] = useState([])
  const navigate = useNavigate()

  const getListSubjectCate = async () => {
    try {
      setLoading(true)
      const res = await SubjectCateService.getListSubjectCateAndSubject()
      if (!!res?.isError) return toast.error(res?.msg)
      setListSubjectCate(res?.data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getListSubjectCate()
  }, [])

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[16, 16]}>
        {listSubjectCate?.map((i, idx) => (
          !!i?.Subjects.length ?
            <MainProfileWrapper key={idx}>
              <Col span={24} className="mb-12">
                <Title level={2}>{i?.SubjectCateName}</Title>
                <Paragraph>
                  {i?.Description}
                </Paragraph>
                <Row gutter={[16, 16]}>
                  {
                    i?.Subjects?.map((i, idx) =>
                      <Col
                        key={idx}
                        xs={24}
                        sm={12}
                        md={6}
                        onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${i?._id}`)}
                      >
                        <Card
                          hoverable
                          cover={
                            <img
                              alt={i?.SubjectName}
                              src={i?.AvatarPath}
                              style={{ width: "100%", height: "230px" }}
                            />
                          }
                        >
                          <Meta
                            title={i?.SubjectName}
                            className='center-text'
                          />
                        </Card>
                      </Col>
                    )
                  }
                </Row>
              </Col>
              <Col span={24}>
                <ButtonCustom
                  className="primary medium-size"
                  onClick={() => navigate(`${Router.DANH_MUC}/${i?._id}`)}
                >
                  Xem tất cả {">>"}
                </ButtonCustom>
              </Col>
            </MainProfileWrapper>
            : <Empty key={idx} description={`Danh mục môn học ${i?.SubjectCateName} chưa có môn học`} />
        ))}
      </Row>
    </SpinCustom>
  )
}

export default FindSubject