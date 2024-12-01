import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BlogService from "src/services/BlogService";
import SubjectService from "src/services/SubjectService";
import { Card, Descriptions, Divider, Tag, Spin, Button, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";

const BlogDetail = ({ BlogID }) => {
//   const { BlogID } = useParams();
  const [loading, setLoading] = useState(false);
  const [detailBlog, setDetailBlog] = useState({});
  const [subjects, setSubjects] = useState([]);

//   const getDetailBlog = async (id) => {
//     try {
//       setLoading(true);
//       console.log("Calling API with BlogID:", id);
//       const res = await BlogService.getDetailBlog(id); 
//       console.log("API Response:", res);
//       if (res?.isError) {
//         toast.error(res?.msg);
//       } else {
//         setDetailBlog(res?.data); 
//       }
//     } catch (error) {
//       toast.error("Không thể tải dữ liệu blog.");
//     } finally {
//       setLoading(false);
//     }
//   };
const getDetailBlog = async (id) => {
    try {
      setLoading(true);
    //   console.log("Calling API with BlogID:", id);
      const res = await BlogService.getDetailBlog(id); // Đây phải là Promise
    //   console.log("API Response:", res); // Log để kiểm tra dữ liệu
      if (res?.isError) {
        toast.error(res?.msg);
      } else {
        setDetailBlog(res?.data || {}); // Đảm bảo không để undefined
      }
    } catch (error) {
      console.error("Error fetching blog detail:", error); 
      toast.error("Không thể tải dữ liệu blog.");
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

  useEffect(() => {
    if (BlogID) {
      getDetailBlog(BlogID); 
      getListSubject();
    }
  }, [BlogID]);
  const getSubjectNameById = (id) => {
    const subject = subjects.find((sub) => sub._id === id);
    return subject ? subject.SubjectName : "Không xác định";
  };

  const renderSchedules = () => {
    if (!detailBlog?.Schedules || detailBlog.Schedules.length === 0) {
      return "Không có lịch học.";
    }
    return detailBlog.Schedules.map((schedule, index) => (
      <Tag color="blue" key={index}>
        {moment(schedule.StartTime).format("DD/MM/YYYY")}: {moment(schedule.StartTime).format("HH:MM")} - {moment(schedule.EndTime).format("HH:MM")}
      </Tag>
    ));
  };

  if (!detailBlog) return null;
  if (loading) return <Spin size="large" className="center-spin" />;

  return (
    <div>
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
        <Descriptions.Item label="Môn học">
          {getSubjectNameById(detailBlog?.Subject)}
        </Descriptions.Item>
        <Descriptions.Item label="Yêu cầu giáo viên:">
          {detailBlog?.Gender === 1 ? "Nữ" : "Nam"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Số buổi học">
          <strong>{detailBlog?.NumberSlot}</strong>
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
        {detailBlog?.LearnType === 1 && (
          <Descriptions.Item label="Địa chỉ">
            {detailBlog?.Address || "Không có thông tin địa chỉ"}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Lịch học">
          {renderSchedules()}
        </Descriptions.Item>
        <Descriptions.Item label="Học phí mỗi buổi (VNĐ)">
          <strong style={{ color: "#1890ff" }}>
            {detailBlog?.Price} VND
          </strong>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default BlogDetail;
