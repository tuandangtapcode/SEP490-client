import { Card, Col, Popover, Row, Select, Space } from "antd"
import { useEffect, useState } from "react"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import TableCustom from "src/components/TableCustom"
import InsertUpdateBlog from "./components/InsertUpdateBlog"
import BlogService from "src/services/BlogService"
import { toast } from "react-toastify"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ListIcons from "src/components/ListIcons"
import { CardContent, CardDescription, CardImage, StyledButton } from "src/pages/ANONYMOUS/BlogPage/styled"
import CB1 from "src/components/Modal/CB1"
import { useNavigate } from "react-router-dom"


const BlogPosting = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [modalBlog, setModalBlog] = useState(false)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
  })


  const getListBlogOfTeacher = async () => {
    try {
      setLoading(true)
      const res = await BlogService.getListBlogOfTeacher(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListData(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      setLoading(true)
      const res = await BlogService.deleteBlog(id)
      if (res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
    } catch (error) {
      console.log("Error:", error)
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    if (pagination.PageSize) getListBlogOfTeacher()
  }, [pagination])


  return (
    <Row gutter={[16, 16]}>
      <Col span={24} className="d-flex-sb">
        <div className="title-type-1">
          DANH SÁCH BÀI VIẾT
        </div>
        <ButtonCustom
          className="third-type-2"
          onClick={() => setModalBlog(true)}
        >
          Thêm mới
        </ButtonCustom>
      </Col>
      {listData?.map((blog) => (
        <>
          <Col span={12} className="mt-10">
            <Card
              className="mt-10"
              hoverable
              title={blog?.Title}
              extra={
                <Popover
                  placement="topRight"
                  trigger="click"
                  content={(
                    <Space>
                      < ButtonCircle
                        title="Xoá"
                        icon={ListIcons?.ICON_DELETE}
                        onClick={() => {
                          CB1({
                            title: `Bạn có chắc chắn muốn xoá bài viết "${blog?.Title}" không?`,
                            // icon: "trashRed",
                            okText: "Đồng ý",
                            cancelText: "Đóng",
                            onOk: async close => {
                              handleDeleteBlog(blog?._id)
                              getListBlogOfTeacher()
                              close()
                            },
                          })
                        }
                        }
                      />
                      < ButtonCircle
                        title="Chỉnh sửa"
                        icon={ListIcons?.ICON_EDIT}
                        onClick={() => setModalBlog(blog)}
                      />
                    </Space>
                  )}
                >
                  < ButtonCircle
                    icon={ListIcons?.ICON_ELLIP}

                  />
                </Popover>
              }
            >
              <CardImage src={blog?.AvatarPath} />
              <CardContent>
                <CardDescription>
                  {blog?.Description}
                </CardDescription>
                <StyledButton
                  type="primary"
                  onClick={() => navigate(`/blog/${blog?._id}`)}
                >
                  Đọc thêm
                </StyledButton>
              </CardContent>
            </Card>
          </Col>
        </>
      ))
      }
      {!!modalBlog && (
        <InsertUpdateBlog
          open={modalBlog}
          onCancel={() => setModalBlog(false)}
          onOk={() => getListBlogOfTeacher()}
        />
      )}
    </Row>
  )
}

export default BlogPosting;