


import { Table, Button, Row, Col, Modal, Spin, Descriptions, Divider, Tag, List, } from "antd";
import { useEffect, useState } from "react";
import { globalSelector } from "src/redux/selector"
import { useSelector } from "react-redux"

import ButtonCustom from "src/components/MyButton/ButtonCustom";
import BlogService from "src/services/BlogService";
import { toast } from "react-toastify";
import ListIcons from "src/components/ListIcons";
import ConfirmModal from "src/components/ModalCustom/ConfirmModal";
import InsertUpdateBlog from "./components/InsertUpdateBlog";
import moment from "moment";
import TableCustom from "src/components/TableCustom";
import { TableCustomStyled } from "src/components/TableCustom/styled";
// import BlogDetail from "src/pages/USER/BlogPosting/components/BlogDetail"
import SubjectService from "src/services/SubjectService";
import BlogDetail from "./components/BlogDetail";
import { getListComboKey } from "src/lib/commonFunction"
import { ADMIN_ID, SYSTEM_KEY } from "src/lib/constant"


const BlogPosting = () => {
  const [loading, setLoading] = useState(false);
  const [modalBlog, setModalBlog] = useState(false);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [SubjectList, setSubjectList] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { profitPercent, listSystemKey } = useSelector(globalSelector)

  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
  });


  const getListBlogOfUser = async () => {
    try {
      setLoading(true);
      
      const res = await BlogService.getListBlogOfUser(pagination);
      console.log("Full Blog List Data:", res?.data?.List);
      if (!!res?.isError) return toast.error(res?.msg);

      const updatedList = res.data.List.map((blog, index) => {
       const subjectId = blog.Subject;  
      //  const getSubjectNameById = (id) => {
      //   const subject = subjects.find((item) => item._id === id);
      //   return subject ? subject.SubjectName : "Không xác định";
      // };
      //  const subjectName = getSubjectNameById(subjectId);
  // console.log(`Blog ${blog.Title} - SubjectID: ${subjectId} - SubjectName: ${subjectId.SubjectName}`);
        return {
          ...blog,
          index: index + 1,
          SubjectName: subjectId.SubjectName || "Không xác định",
        };
      });

      setListData(updatedList);
      setTotal(res?.data?.Total);
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
      // console.log("Subjects List:", res?.data?.List);
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      setLoading(true);
      const res = await BlogService.deleteBlog(id);
      if (!!res?.isError) return toast.error(res?.msg);
      toast.success(res?.msg);
      getListBlogOfUser();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewBlogDetail = (blogId) => {
    // console.log("Blog ID to view:", blogId); 
    setSelectedBlog(blogId);
  };
  
  useEffect(() => {
    getListSubject()
  }, []);
  useEffect(() => {
    getListSubject()
    getListBlogOfUser();

  }, [pagination]);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await getListSubject(); // Tải danh sách môn học trước
  //     await getListBlogOfUser(); // Sau đó mới tải danh sách blog
  //   };
  //   fetchData();
  // }, [pagination]);


  const columns = [
    { title: "STT", align: "center", dataIndex: "index", key: "index" },
    { title: "Tiêu đề", align: "center", dataIndex: "Title", key: "Title"    },
    {
      title: "Môn học",
      align: "center",
      dataIndex: "SubjectName",
      key: "SubjectName",
      render: (_, record) => (
        <div className="text-center">{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Ngày đăng",
      align: "center",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "RegisterStatus",
      key: "RegisterStatus",
      render: (val) => (
        <Tag color={["processing", "warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)
              ?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
    {
      title: "Giáo viên nhận",
      align: "center",
      dataIndex: "TeacherName",
      key: "TeacherName",
    },
    {
      title: "Chức năng",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <Button
              icon={ListIcons?.ICON_VIEW}
              onClick={() =>{
                // console.log("blog ID:", record._id)
               handleViewBlogDetail(record._id)
              }
                }
            />
            <Button
              type="link"
              danger
              icon={ListIcons?.ICON_DELETE}
              onClick={() => {
                ConfirmModal({
                  description: `Bạn có chắc chắn muốn xoá bài viết "${record.Title}" không?`,
                  okText: "Đồng ý",
                  cancelText: "Đóng",
                  onOk: async (close) => {
                    handleDeleteBlog(record._id);
                    close();
                  },
                });
              }}
            ></Button>
          </>
        );
      }

    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} className="d-flex-sb">
        <div className="title-type-1">DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG</div>
        <ButtonCustom className="third-type-2" onClick={() => setModalBlog(true)}>
          Thêm mới
        </ButtonCustom>
      </Col>
      <Col span={24}>
        <TableCustom
          loading={loading}
          isPrimary
          bordered
          noMrb
          showPagination
          editableCell
          sticky={{ offsetHeader: -12 }}
          textEmpty="Không có dữ liệu"
          dataSource={listData.map((blog) => ({ ...blog, key: blog._id }))}
          columns={columns}
          pagination={
            !!pagination?.PageSize
              ? {
                hideOnSinglePage: total <= 10,
                current: pagination?.CurrentPage,
                pageSize: pagination?.PageSize,
                responsive: true,
                total,
                showSizeChanger: total > 10,
                locale: { items_per_page: "" },
                onChange: (CurrentPage, PageSize) =>
                  setPagination((pre) => ({
                    ...pre,
                    CurrentPage,
                    PageSize,
                  })),
              }
              : false
          }
        />
      </Col>
      <Modal
         open={!!selectedBlog}
        onCancel={() => setSelectedBlog(null)} 
        footer={null}
        centered
        width={800}
      >
       {selectedBlog && <BlogDetail BlogID={selectedBlog} />}
      </Modal>
      {!!modalBlog && (
        <InsertUpdateBlog
          open={modalBlog}
          onCancel={() => setModalBlog(false)}
          onOk={async () => {
            await getListBlogOfUser();
            setModalBlog(false);
          }}
        />
      )}
    </Row>
  );
};

export default BlogPosting;
