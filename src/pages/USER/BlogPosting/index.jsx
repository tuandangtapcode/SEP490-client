import { Table, Button, Row, Col, Slider } from "antd"
import { useEffect, useState } from "react"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import BlogService from "src/services/BlogService"
import { toast } from "react-toastify"
import ListIcons from "src/components/ListIcons"
import CB1 from "src/components/Modal/CB1"
import { useNavigate } from "react-router-dom"
import InsertUpdateBlog from "./components/InsertUpdateBlog" 
import moment from 'moment';
import TableCustom from "src/components/TableCustom"
import { TableCustomStyled } from "src/components/TableCustom/styled"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"


const BlogPosting = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [modalBlog, setModalBlog] = useState(false)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [detailBlogModal, setDetailBlogModal] = useState(false);
const [selectedBlog, setSelectedBlog] = useState(null);
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10
  })
  const getListBlogOfUser = async () => {
    try {
      setLoading(true);
      const res = await BlogService.getListBlogOfUser(pagination);
      if (!!res?.isError) return toast.error(res?.msg);

      const updatedList = res.data.List.map((blog, index) => ({
        ...blog,
        index: index + 1,
      }));

      setListData(updatedList);
      setTotal(res?.data?.Total);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      setLoading(true)
      const res = await BlogService.deleteBlog(id)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      getListBlogOfUser() 
    } catch (error) {
      console.log("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewBlogDetail = async (blogId) => {
    setLoading(true);
    const res = await BlogService.getDetailBlog(blogId); // Lấy thông tin chi tiết của blog
    if (res?.isError) {
      toast.error(res?.msg);
    } else {
      setSelectedBlog(res.data); 
      setDetailBlogModal(true); 
    }
  };

  useEffect(() => {
    getListBlogOfUser(pagination)
  }, [])

  const columns = [
    { title: 'STT',align: "center", dataIndex: 'index', key: 'index' },
    { title: 'Tiêu đề',align: "center", dataIndex: 'Title', key: 'Title' },
    { title: 'Ngày đăng',align: "center", dataIndex: 'createdAt', key: 'createdAt', render: date => moment(date).format('DD/MM/YYYY') }, // Đảm bảo đã import moment
    { title: 'Ngày nhận',align: "center", dataIndex: 'receiveDate', key: 'receiveDate', render: date => moment(date).format('DD/MM/YYYY') }, // Giả sử bạn có trường này trong dữ liệu
    {
          title: 'Chức năng',
          align: "center",
          render: (text, record) => (
            <>
            <Button icon={ListIcons?.ICON_VIEW} onClick={() => handleViewBlogDetail(record._id)}></Button>
                
              <Button type="link" icon={ListIcons?.ICON_EDIT} onClick={() => setModalBlog(record)}></Button>
              <Button
                type="link"
                danger
                icon={ListIcons?.ICON_DELETE}
                onClick={() => {
                  ConfirmModal({
                    description: `Bạn có chắc chắn muốn xoá bài viết "${record.Title}" không?`,
                    okText: "Đồng ý",
                    cancelText: "Đóng",
                    onOk: async close => {
                      handleDeleteBlog(record._id)
                      close()
                    },
                  })
                }}
              >
              </Button>
            </>
          ),
        },
  ];


return (
  <Row gutter={[16, 16]}>
    <Col span={24} className="d-flex-sb">
      <div className="title-type-1">
        DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG
      </div>
      <ButtonCustom
        className="third-type-2"
        onClick={() => setModalBlog(true)}
      >
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
        dataSource={listData.map(blog => ({ ...blog, key: blog._id }))} 
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
                  setPagination(pre => ({
                    ...pre,
                    CurrentPage,
                    PageSize,
                  })),
              }
              : false
          }
      />
    </Col>
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
