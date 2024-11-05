import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BlogService from "src/services/BlogService";
import { Card, Descriptions, Divider, Tag, Spin } from "antd";
import moment from "moment";
import {} from "./styled"
import SubjectService from "src/services/SubjectService"
import { Value } from "sass";

const BlogDetail = () => {
  const { BlogID } = useParams();
  const [loading, setLoading] = useState(false);
  const [detailBlog, setDetailBlog] = useState({});
  const [subjects, setSubjects] = useState([]);
  const getDetailBlog = async () => {
    try {
      setLoading(true);
      const res = await BlogService.getDetailBlog(BlogID);
      if (res?.isError) return toast.error(res?.msg);
      setDetailBlog(res?.data);
    } finally {
      setLoading(false);
    }
  };

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
    getDetailBlog();
    getListSubject();
  }, []);
  const getSubjectNameById = (id) => {
    const subject = subjects.find((sub) => sub._id === id); 
    return subject ? subject.SubjectName : "Không xác định"; 
  };

  if (loading) return <Spin size="large" className="center-spin" />;

  return (
    <Card className="title-type-2">
      {/* Tiêu đề bài viết */}
      <h2 style={{ textTransform: 'uppercase', fontSize: '2em', fontStyle: 'italic', textAlign: 'center' }}>
        {detailBlog?.Title}
      </h2>
  
      {/* Nội dung bài viết */}
      <Card style={{ marginTop: '1em', padding: '1em', backgroundColor: '#f9f9f9' }}>
        <div
          style={{
            textTransform: 'uppercase',
            fontSize: '1em',
            fontStyle: "italic",
            lineHeight: '1.6',
            color: '#333'
          }}
          dangerouslySetInnerHTML={{ __html: detailBlog?.Content }}
        />
      </Card>
  
      {/* Thông tin chi tiết */}
      <Descriptions bordered column={2} style={{ marginTop: '1.5em' }}>
        <Descriptions.Item label="Học phí mỗi buổi (VNĐ)">
          <strong style={{ color: '#1890ff' }}>{detailBlog?.Price} VND</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Số buổi học">
          <strong>{detailBlog?.NumberSlot}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian tạo">
          {moment(detailBlog?.createdAt).format("hh:mm A - DD/MM/YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {detailBlog?.Address}
        </Descriptions.Item>
        <Descriptions.Item label="Môn học">
          {getSubjectNameById(detailBlog?.Subject)}
        </Descriptions.Item>
        <Descriptions.Item label="Yêu cầu giáo viên:">
          {detailBlog?.Gender === "Male" ? "Nam" : "Nữ"}
        </Descriptions.Item>
        <Descriptions.Item label="Hình thức học">
  {detailBlog?.LearnTypes?.map((type, index) => (
    <Tag color="blue" key={index}>
      {type === 1 ? "Học Online" : type === 2 ? "Học Offline" : "Không xác định"}
    </Tag>
  ))}
</Descriptions.Item>

      </Descriptions>
  
      <Divider />
  
     {/* Lịch học */}
<Descriptions title="Lịch học" bordered column={1} style={{ marginTop: '1em' }}>
  {detailBlog?.schedules?.map((schedule, index) => (
    <Descriptions.Item label={schedule.day} key={index}>
      <div style={{ marginBottom: '0.5em' }}>
      <strong> Ngày:</strong> {moment(schedule.DateAt).format("DD-MM-YYYY")}
        <strong>Bắt đầu:</strong> {moment(schedule.StartTime).format("HH:mm")} - 
        <strong> Kết thúc:</strong> {moment(schedule.EndTime).format("HH:mm")}
      </div>
    </Descriptions.Item>
  ))}
</Descriptions>

  
      <Divider />
    </Card>
  );
  
};

export default BlogDetail;
