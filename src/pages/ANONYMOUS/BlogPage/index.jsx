import { Row, Col, Select, Rate } from "antd"
import { useEffect, useState } from "react"
import BlogService from "src/services/BlogService"
import SubjectService from "src/services/SubjectService"
import { toast } from "react-toastify"
import { Description, Title, FilterTitleStyled, SubjectItemStyled } from "./styled"
import SpinCustom from "src/components/SpinCustom"
import BlogItem from "./components/BlogItem"
import { MainProfileWrapper } from "../TeacherDetail/styled"
import InputCustom from "src/components/InputCustom"
import UserService from "src/services/UserService"
import Router from "src/routers"
import { useNavigate } from "react-router-dom"

const BlogPage = () => {

  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TextSearch: "",
    SubjectID: ""
  })
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [blogs, setBlogs] = useState()
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  const getListBlogByTeacher = async () => {
    try {
      setLoading(true)
      const res = await BlogService.getListBlogByTeacher(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setBlogs(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  const getListTopSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListTopSubject()
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const getListTopTeacher = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListTopTeacher({
        IsBlogPage: true
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setTeachers(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListTopSubject()
    getListTopTeacher()
  }, [])


  useEffect(() => {
    getListBlogByTeacher()
  }, [pagination])


  return (

    <SpinCustom spinning={loading}>
      <div className="d-flex-center">
        <Row gutter={[8, 8]} style={{ width: "85%" }}>
          <Col span={24} className="mb-12">
            <Title>Bài đăng tìm kiếm giáo viên</Title>
            <Description style={{ textAlign: "center" }}>
              Tại đây, chúng tôi đang kết nối giữa bạn và các học sinh, học viên có nhu cầu học tập. Liên hệ ngay để cùng phát triển!.
            </Description>
          </Col>
          <Col span={17}>
            {
              blogs?.map((i, idx) =>
                <BlogItem
                  key={idx}
                  blog={i}
                />
              )
            }
          </Col>
          <Col span={7}>
            <MainProfileWrapper>
              <InputCustom
                type="isSearch"
                placeholder="Tìm kiếm..."
                allowClear
                className="mb-20"
                onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
              />
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <FilterTitleStyled className="fs-16 fw-600">Môn học hot</FilterTitleStyled>
                </Col>
                {
                  subjects?.map((i, idx) =>
                    <Col span={24} key={idx}>
                      <SubjectItemStyled
                        key={idx}
                        className={i?._id === pagination?.SubjectID ? "active" : ""}
                        onClick={() => {
                          if (i?._id !== pagination?.SubjectID) {
                            setPagination(pre => ({ ...pre, SubjectID: i?._id }))
                          } else {
                            setPagination(pre => ({ ...pre, SubjectID: "" }))
                          }
                        }}
                      >
                        {i?.SubjectName}
                      </SubjectItemStyled>
                    </Col>
                  )
                }
                <Col span={24} className="mt-20">
                  <FilterTitleStyled className="fs-16 fw-600">Giáo viên hot</FilterTitleStyled>
                </Col>
                {
                  teachers?.map((i, idx) =>
                    <Col span={24} key={idx}>
                      <SubjectItemStyled
                        key={idx}
                        onClick={() => navigate(`${Router.GIAO_VIEN}/${i?.Teacher?._id}${Router.MON_HOC}/${i?.Subject?._id}`)}
                      >
                        <div className="d-flex align-items-center">
                          <div className="mr-6">
                            <img
                              src={i?.Teacher?.AvatarPath}
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%"
                              }}
                            />
                          </div>
                          <div>
                            <div className="fs-14">{i?.Teacher?.FullName}</div>
                            <div className="fs-14">{i?.Subject?.SubjectName}</div>
                            <div className="d-flex align-items-center">
                              <Rate
                                allowHalf
                                disabled
                                value={!!i?.TotalVotes ? i?.TotalVotes / i?.Votes?.length : 0}
                                style={{
                                  fontSize: "12px",
                                  marginRight: "3px"
                                }}
                              />
                              <p>({i?.Votes?.length} đánh giá)</p>
                            </div>
                          </div>
                        </div>
                      </SubjectItemStyled>
                    </Col>
                  )
                }
              </Row>
            </MainProfileWrapper>
          </Col>
        </Row>
      </div>
    </SpinCustom >
  )
}

export default BlogPage
