import { List, Button, Spin, Tag, Space, Card } from "antd";
import { useEffect, useState } from "react";
import BlogService from "src/services/BlogService";
import SubjectService from "src/services/SubjectService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { globalSelector } from "src/redux/selector";
import InsertUpdateBlog from "src/pages/USER/BlogPosting/components/InsertUpdateBlog";
import { Container, Description, Title, StyledListItem} from "./styled";

const BlogPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalBlog, setModalBlog] = useState(false);
  const [listBlog, setListBlog] = useState([]);
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
  });
  const [subjects, setSubjects] = useState([]);
  const { user } = useSelector(globalSelector);

  const getListBlogByTeacher = async () => {
    try {
      setLoading(true);
      const res = await BlogService.getListBlogByTeacher(pagination);
      if (!!res?.isError) return toast.error(res?.msg);
      setListBlog(res?.data?.List);
    } finally {
      setLoading(false);
    }
  };

  const getListSubject = async () => {
    try {
      setLoading(true);
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0,
      });
      if (!!res?.isError) return toast.error(res?.msg);
      setSubjects(res?.data?.List);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() =>{
    getListSubject();
  }, [])


  useEffect(() => {
    // getListSubject();
    getListBlogByTeacher();
  }, [pagination]);

  const getSubjectNameById = (id) => {
    const subject = subjects.find((sub) => sub._id === id);
    return subject ? subject.SubjectName : "Không xác định";
  };

  return (
    <Spin spinning={loading}>
    <Title>Bài đăng tìm kiếm giáo viên</Title>
        <Description style={{textAlign :"center"}}>
        Tại đây, chúng tôi đang kết nối giữa bạn và các học sinh, học viên có nhu cầu học tập. Liên hệ ngay để cùng phát triển!.
        </Description>
      <Container>
        <List
          itemLayout="vertical"
          dataSource={listBlog}
          renderItem={(blog) => (
             <StyledListItem>
              <Card
                style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "16px",
                }}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span
                        style={{
                          textTransform: "uppercase",
                          fontSize: "1.5em",
                          fontWeight: "bold",
                        }}
                      >
                        {blog?.Title}
                      </span>
                      {blog?.LearnType?.includes(1) && <Tag color="blue">Online</Tag>}
                      {blog?.LearnType?.includes(2) && <Tag color="green">Offline</Tag>}
                    </Space>
                  }
                  description={
                    <>
                      <div>
                        <strong>Môn học:</strong>{" "}
                        {getSubjectNameById(blog?.Subject.SubjectName)}
                      </div>
                      <div>
                        <strong>Học phí:</strong>{" "}
                        {blog?.Price
                          ? `${blog?.Price.toLocaleString()} VNĐ`
                          : "Miễn phí"}{" "}
                        /Buổi
                      </div>
                      {blog?.LearnType?.includes(2) && (
                        <div>
                          <strong>Địa chỉ:</strong> {blog?.Address || "Không xác định"}
                        </div>
                      )}
                      <div>
                        <strong>Yêu cầu giới tính giáo viên:</strong>{" "}
                        {blog?.GenderRequirement === 1
                          ? "Nam"
                          : blog?.GenderRequirement === 2
                          ? "Nữ"
                          : "Không yêu cầu"}
                      </div>
                      <div>
                        <strong>Tổng buổi học:</strong>{" "}
                        {blog?.TotalSessions || "Không xác định"}
                      </div>
                      <div>
                        <strong>Lịch học:</strong> {blog?.Schedule || "Không xác định"}
                      </div>
                      <div>
                        <strong>Thời gian tạo:</strong>{" "}
                        {new Date(blog?.CreatedAt).toLocaleDateString("vi-VN") ||
                          "Không xác định"}
                      </div>
                    </>
                  }
                />
                <div style={{ textAlign: "right", marginTop: "16px" }}>
                  <Button
                    type="primary"
                    // onClick={() => navigate(`/register-teaching/${blog?._id}`)}
                  >
                    Đăng ký dạy
                  </Button>
                </div>
              </Card>
            </StyledListItem>
          )}
        />
      </Container>
      {!!modalBlog && (
        <InsertUpdateBlog
          open={modalBlog}
          onCancel={() => setModalBlog(false)}
          onOk={() => getListBlogByTeacher()}
        />
      )}
    </Spin>
  );
};

export default BlogPage;
