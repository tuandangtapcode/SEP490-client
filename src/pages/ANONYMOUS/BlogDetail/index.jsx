import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BlogService from "src/services/BlogService";
import { Card, Descriptions, Divider, Tag, Spin, Button, EyeOutlined } from "antd";
import moment from "moment";
import {} from "./styled"
import SubjectService from "src/services/SubjectService"
import { Value } from "sass";

const BlogDetail = () => {
  const { BlogID } = useParams();
  const [loading, setLoading] = useState(false);
  const [detailBlog, setDetailBlog] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getDetailBlog = async () => {
    try {
      setLoading(true)
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


  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  if (loading) return <Spin size="large" className="center-spin" />;

  return (
    <Card className="title-type-2">
    {/* Tiêu đề bài viết */}
    <h2
      style={{
        textTransform: "uppercase",
        fontSize: "2em",
        fontStyle: "italic",
        textAlign: "center",
      }}
    >
      {detailBlog?.Title}
    </h2>

    {/* Nút hiển thị chi tiết */}
    <Button
      type="primary"
      icon={<EyeOutlined />}
      style={{ marginTop: "1em", marginBottom: "1em" }}
      onClick={showModal}
    >
      Xem chi tiết
    </Button>

    {/* Modal hiển thị thông tin */}
    <Modal
      visible={isModalVisible}
      title="Chi tiết bài viết"
      onCancel={handleCancel}
      footer={null}
      centered
      width={800}
    >
      <Descriptions bordered column={2} style={{ marginTop: "1.5em" }}>
        <Descriptions.Item label="Tiêu đề">
          {detailBlog?.Title}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <div
            dangerouslySetInnerHTML={{ __html: detailBlog?.Content }}
            style={{ color: "#333" }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Học phí mỗi buổi (VNĐ)">
          <strong style={{ color: "#1890ff" }}>{detailBlog?.Price} VND</strong>
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
          {detailBlog?.Gender === 1 ? "Nữ" : "Nam"}
        </Descriptions.Item>
        <Descriptions.Item label="Hình thức học">
          {detailBlog?.LearnType?.map((type, index) => (
            <Tag color="blue" key={index}>
              {type === 1
                ? "Học Online"
                : type === 2
                ? "Học Offline"
                : "Không xác định"}
            </Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions title="Lịch học" bordered column={1}>
        {detailBlog?.schedules?.map((schedule, index) => (
          <Descriptions.Item label={schedule.day} key={index}>
            <div style={{ marginBottom: "0.5em" }}>
              <strong>Ngày:</strong>{" "}
              {moment(schedule.DateAt).format("DD-MM-YYYY")}
              <br />
              <strong>Bắt đầu:</strong>{" "}
              {moment(schedule.StartTime).format("HH:mm")} -{" "}
              <strong>Kết thúc:</strong>{" "}
              {moment(schedule.EndTime).format("HH:mm")}
            </div>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Modal>
  </Card>
  );
  
};

export default BlogDetail;
