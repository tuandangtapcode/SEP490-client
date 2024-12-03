import { List, Button, Spin, Tag, Space, Card, Row, Col } from "antd"
import { useEffect, useState } from "react"
import BlogService from "src/services/BlogService"
import SubjectService from "src/services/SubjectService"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { Container, Description, Title, StyledListItem } from "./styled"
import SpinCustom from "src/components/SpinCustom"
import BlogItem from "./components/BlogItem"

const BlogPage = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [modalBlog, setModalBlog] = useState(false)
  const { user } = useSelector(globalSelector)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TextSearch: "",
    SubjectID: "",
    LearnType: 0,
    RoleID: !!user?.RoleID ? user?.RoleID : 0,
    UserID: !!user?._id ? user?._id : 0
  })
  const [subjects, setSubjects] = useState([])
  const [blogs, setBlogs] = useState()
  const [total, setTotal] = useState(0)

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

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0,
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])


  useEffect(() => {
    getListBlogByTeacher()
  }, [pagination])


  return (

    <SpinCustom spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24} className="mb-12">
          <Title>Bài đăng tìm kiếm giáo viên</Title>
          <Description style={{ textAlign: "center" }}>
            Tại đây, chúng tôi đang kết nối giữa bạn và các học sinh, học viên có nhu cầu học tập. Liên hệ ngay để cùng phát triển!.
          </Description>
        </Col>
        <Col span={24}>
          {
            blogs?.map((i, idx) =>
              <BlogItem
                key={idx}
                blog={i}
              />
            )
          }
        </Col>
      </Row>
    </SpinCustom>
  )
}

export default BlogPage
