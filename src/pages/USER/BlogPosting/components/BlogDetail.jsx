import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BlogService from "src/services/BlogService";
import SubjectService from "src/services/SubjectService";
import { Card, Descriptions, Divider, Tag, Spin, Button, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import ModalCustom from "src/components/ModalCustom";
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { useSelector } from "react-redux"



const BlogDetail = ({ BlogID, open, onCancel }) => {
//   const { BlogID } = useParams();
  const [loading, setLoading] = useState(false);
  const [detailBlog, setDetailBlog] = useState({});
  const [subjects, setSubjects] = useState([]);
  const { listSystemKey, user, profitPercent } = useSelector(globalSelector)

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
    // <ModalCustom>
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
        {
                  detailBlog?.LearnType?.map(i =>
                    <div key={i} value={i}>
                      {
                        getListComboKey(SYSTEM_KEY.GENDER, listSystemKey)?.find(item =>
                          item?.ParentID === i)?.ParentName
                      }
                    </div>
                  )
                }
        </Descriptions.Item>
        
        <Descriptions.Item label="Số buổi học">
          <strong>{detailBlog?.NumberSlot}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Hình thức học">
            {
                  detailBlog?.LearnType?.map(i =>
                    <Tag key={i} value={i}>
                      {
                        getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.find(item =>
                          item?.ParentID === i)?.ParentName
                      }
                    </Tag>
                  )
                }
        </Descriptions.Item>
        {detailBlog?.LearnType === 2 && (
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
  //  </ModalCustom>
  );
};

export default BlogDetail;
