import {  Card, Dropdown, Popover, Space, Button, Spin } from "antd"

import {
  CardContent,
  CardDescription,
  Container,
  Description,
  StyledButton,
  Title
} from "./styled"
import { useEffect, useState } from "react"
import BlogService from "src/services/BlogService"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import SpinCustom from "src/components/SpinCustom"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import InsertUpdateBlog from "src/pages/USER/BlogPosting/components/InsertUpdateBlog"
import CB1 from "src/components/Modal/CB1"
import SubjectService from "src/services/SubjectService"




const BlogPage = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [modalBlog, setModalBlog] = useState(false)
  const [listBlog, setListBlog] = useState([])
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10
  })
  const [subjects, setSubjects] = useState([]);

  const { user } = useSelector(globalSelector)

  const getListBlog = async () => {
    try {
      setLoading(true)
      const res = await BlogService.getListBlog(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setListBlog(res?.data?.List)
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
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListBlog(),
    getListSubject();
  }, [pagination])

  const getSubjectNameById = (id) => {
    const subject = subjects.find((sub) => sub._id === id); 
    return subject ? subject.SubjectName : "Không xác định"; 
  };
return (
  <Spin spinning={loading}>
    <Container>
      <Title>Talent LearningHub Blog</Title>
      <Description>
        Tại đây, bạn sẽ tìm thấy nhiều tài nguyên hữu ích để tham khảo khi học điều gì đó mới - từ hướng dẫn toàn diện đến hướng dẫn từng bước.
      </Description>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {listBlog.map((blog) => (
          <Card
            key={blog?._id}
            hoverable
            title={<span style={{ textTransform: 'uppercase', fontSize: '1.5em' }}>{blog?.Title}</span>}
            style={{ width: 300 }}
            actions={[
              <Button
                type="primary"
                onClick={() => navigate(`/blog/${blog?._id}`)}
              >
                Xem chi tiết
              </Button>
            ]}
          >
            <Card.Meta
              description={
                <>
                  <CardDescription>
                    <strong>Nội dung:</strong> {blog?.Content || 'Không xác định'}
                  </CardDescription>
                  <CardDescription>
                    <strong>Môn học:</strong> {getSubjectNameById(blog?.Subject)}
                  </CardDescription>
                  <CardDescription>
                    <strong>Học phí:</strong> {blog?.Price ? `${blog?.Price.toLocaleString()} VNĐ` : 'Miễn phí'} /Buổi
                  </CardDescription>
                  <CardDescription>
                    <strong>Hình thức học:</strong> {blog?.LearnType?.map((type) => (type === 1 ? 'Online' : 'Offline')).join(', ') || 'Không xác định'}
                  </CardDescription>
                </>
              }
            />
          </Card>
        ))}
      </div>
    </Container>
    {!!modalBlog && (
      <InsertUpdateBlog
        open={modalBlog}
        onCancel={() => setModalBlog(false)}
        onOk={() => getListBlog()}
      />
    )}
  </Spin>
)
}
export default BlogPage