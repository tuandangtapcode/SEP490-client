


import { Row, Col, Tag, Space, Select } from "antd"
import { useEffect, useState } from "react"
import { globalSelector } from "src/redux/selector"
import { useSelector } from "react-redux"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import BlogService from "src/services/BlogService"
import { toast } from "react-toastify"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import TableCustom from "src/components/TableCustom"
import SubjectService from "src/services/SubjectService"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import dayjs from "dayjs"
import InputCustom from "src/components/InputCustom"
import SpinCustom from "src/components/SpinCustom"
import ModalInsertBlog from "./components/ModalInsertBlog"
import ModalBlogDetail from "./components/ModalBlogDetail"

const BlogPosting = () => {

  const [loading, setLoading] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [total, setTotal] = useState(0)
  const [subjects, setSubjects] = useState([])
  const [openModalInsertBlog, setOpenModalInsertBlog] = useState(false)
  const [openModalDetailBlog, setOpenModalDetailBlog] = useState(false)
  const { listSystemKey } = useSelector(globalSelector)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TextSearch: "",
    SubjectID: "",
    RegisterStatus: 0,
  })

  const getListBlogByUser = async () => {
    try {
      setLoading(true)
      const res = await BlogService.getListBlogByUser(pagination)
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
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      setLoading(true)
      const res = await BlogService.deleteBlog(id)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      getListBlogByUser()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])
  useEffect(() => {
    getListBlogByUser()
  }, [pagination])

  const listBtn = record => [
    {
      title: "Chi tiết",
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenModalDetailBlog(record)
    },
    {
      title: !!record?.IsDeleted ? "Hiển thị bài đăng" : "Ẩn bài đăng",
      icon: !!record?.IsDeleted ? ListIcons.ICON_UNBLOCK : ListIcons.ICON_BLOCK,
      onClick: () => {
        ConfirmModal({
          icon: "ICON_SUSCESS_MODAL",
          description: `Bạn có chắc chắn ${!!record?.IsDeleted ? "hiển thị bài đăng" : "ẩn bài đăng"} không?`,
          onOk: async close => {
            // disabledOrEnabledSubjectSetting(record, !record?.IsDisabled)
            close()
          }
        })
      }
    },
  ]

  const columns = [
    {
      title: "STT",
      align: "center",
      dataIndex: "index",
      width: 50,
      key: "index",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: "Tiêu đề",
      align: "center",
      width: 110,
      dataIndex: "Title",
      key: "Title"
    },
    {
      title: "Môn học",
      align: "center",
      width: 80,
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
      width: 80,
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Giáo viên nhận",
      align: "center",
      width: 30,
      dataIndex: "TeacherName",
      key: "TeacherName",
      render: (_, record) => (
        <div>{record?.TeacherReceive?.length}</div>
      )
    },
    {
      title: "Trạng thái",
      align: "center",
      width: 80,
      dataIndex: "RegisterStatus",
      key: "RegisterStatus",
      render: (val) => (
        <Tag color={["processing", "warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
    {
      title: "Trạng thái sử dụng",
      width: 60,
      dataIndex: "IsDeleted",
      align: "center",
      key: "IsDeleted",
      render: (val) => (
        <Tag color={!val ? "success" : "error"} className="p-5 fs-16">
          {
            !val ? "Đang sử dụng" : "Đã ẩn"
          }
        </Tag>
      )
    },
    {
      title: "Chức năng",
      align: "center",
      width: 70,
      render: (text, record) => (
        <Space direction="horizontal">
          {
            listBtn(record)?.map((i, idx) =>
              <ButtonCircle
                key={idx}
                title={i?.title}
                icon={i?.icon}
                disabled={i?.isDisabled}
                onClick={i?.onClick}
              />
            )
          }
        </Space>
      )

    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24} className="d-flex-sb">
          <div className="title-type-1">DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG</div>
          <ButtonCustom className="third-type-2" onClick={() => setOpenModalInsertBlog(true)}>
            Thêm mới
          </ButtonCustom>
        </Col>
        <Col span={16}>
          <InputCustom
            type="isSearch"
            placeholder="Nhập vào tiêu đề bài đăng"
            allowClear
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Chọn môn học"
            allowClear
            showSearch
            onChange={e => setPagination(pre => ({ ...pre, SubjectID: e }))}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              subjects?.map(i =>
                <Select.Option
                  key={i?._id}
                  value={i?._id}
                >
                  {i?.SubjectName}
                </Select.Option>
              )
            }
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="Tình trạng đăng ký"
            allowClear
            onChange={e => setPagination(pre => ({ ...pre, RegisterStatus: e }))}
          >
            {
              getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)?.map(i =>
                <Select.Option
                  key={i?.ParentID}
                  value={i?.ParentID}
                >
                  {i?.ParentName}
                </Select.Option>
              )
            }
          </Select>
        </Col>
        <Col span={24}>
          <TableCustom
            isPrimary
            bordered
            noMrb
            showPagination
            editableCell
            sticky={{ offsetHeader: -12 }}
            textEmpty="Không có dữ liệu"
            dataSource={blogs}
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

        {
          !!openModalInsertBlog &&
          <ModalInsertBlog
            open={openModalInsertBlog}
            onCancel={() => setOpenModalInsertBlog(false)}
            onOk={getListBlogByUser}
          />
        }

        {
          !!openModalDetailBlog &&
          <ModalBlogDetail
            open={openModalDetailBlog}
            onCancel={() => setOpenModalDetailBlog(false)}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default BlogPosting
