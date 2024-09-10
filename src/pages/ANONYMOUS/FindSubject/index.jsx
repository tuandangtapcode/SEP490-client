import { Button, Col, Row, Typography } from "antd"
import InputCustom from "src/components/InputCustom"
import CardList from "./components/Card/CardList"
import SubjectCateService from "src/services/SubjectCateService"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"
import { Link } from "react-router-dom"

const { Title, Paragraph } = Typography

const FindSubject = () => {

  const [loading, setLoading] = useState(false)
  const [listSubjectCate, setListSubjectCate] = useState([])


  const getListSubjectCate = async () => {
    try {
      setLoading(true)
      const res = await SubjectCateService.getListSubjectCateAndSubject()
      if (res?.isError) return toast.error(res?.msg)
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
        {/* <Col span={24} className="mt-60">
          <InputCustom
            type="isSearch"
          />
          <div className="d-flex mt-20 g-10">
            <p className=" blue-text fs-20">Môn học phổ biến: </p>
            <Button>Piano</Button>
            <Button>Violin</Button>
            <Button>Guitar</Button>
          </div>
        </Col> */}
        {listSubjectCate?.map(subject => (
          (subject?.Subjects.length === 0) ?
            <></>
            :
            <>
              <Col span={24} className="mt-60">
                <Title level={2}>{subject?.SubjectCateName}</Title>
                <Paragraph>
                  {subject?.Description}
                </Paragraph>
                <CardList
                  data={subject?.Subjects}
                />
              </Col>
              <Col span={24}>
                <Link className="fs-20" to={`/danh-muc/${subject?._id}`}>Xem tất cả {">>"}</Link>
              </Col>
            </>
        ))}
      </Row>
    </SpinCustom>
  )
}

export default FindSubject