import { Col, DatePicker, Row, Select, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import BlogService from "src/services/BlogService"
import SubjectService from "src/services/SubjectService"
import dayjs from "dayjs"
import ModalBlogDetail from "../BlogPosting/components/ModalBlogDetail"
import NotificationService from "src/services/NotificationService"
import socket from "src/utils/socket"

const BlogApproval = () => {

  const { listSystemKey, user } = useSelector(globalSelector)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [subjects, setSubjects] = useState([])
  const [openModalDetailBlog, setOpenModalDetailBlog] = useState(false)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    SubjectID: "",
    ReceiveStatus: 0,
    ReceiveDate: ""
  })

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

  const getListBlogApproval = async () => {
    try {
      setLoading(true)
      const res = await BlogService.getListBlogApproval(pagination)
      if (!!res?.isError) return
      setBlogs(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  const changeReceiveStatus = async (record) => {
    try {
      setLoading(true)
      const res = await BlogService.changeReceiveStatus({
        BlogID: record?._id,
        TeacherID: user?._id,
        ReceiveStatus: 2
      })
      if (!!res?.isError) return
      // const bodyNotification = {
      //   Content: `${user?.FullName} hủy đăng ký lớp học của bạn`,
      //   Type: "dang-bai-viet",
      //   Receiver: record?.User
      // }
      // const resNotification = NotificationService.createNotification(bodyNotification)
      // if (!!resNotification?.isError) return toast.error(resNotification?.msg)
      // socket.emit('send-notification',
      //   {
      //     Content: resNotification?.data?.Content,
      //     IsSeen: resNotification?.IsSeen,
      //     _id: resNotification?.data?._id,
      //     Type: resNotification?.data?.Type,
      //     IsNew: resNotification?.data?.IsNew,
      //     Receiver: resNotification?.data?.Receiver,
      //     createdAt: resNotification?.data?.createdAt
      //   })
      toast.success(res?.msg)
      socket.emit("send-change-receive-status", {
        ...res?.data,
        Receiver: res?.data?.User,
      })
      getListBlogApproval()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])

  useEffect(() => {
    getListBlogApproval()
  }, [pagination])

  const listBtn = record => [
    {
      isDisabled: false,
      title: "Chi tiết",
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenModalDetailBlog(record)
    },
    {
      isDisabled: record?.IsCancel,
      title: "Hủy đăng ký",
      icon: ListIcons?.ICON_CLOSE,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn hủy đăng ký lớp học không?`,
          onOk: async close => {
            changeReceiveStatus(record)
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
      title: "Học sinh",
      align: "center",
      width: 90,
      dataIndex: "FullName",
      key: "FullName",
      render: (_, record) => (
        <div className="text-center">{record?.User?.FullName}</div>
      ),
    },
    {
      title: "Tiêu đề",
      align: "center",
      width: 130,
      dataIndex: "Title",
      key: "Title"
    },
    {
      title: "Môn học",
      align: "center",
      width: 60,
      dataIndex: "SubjectName",
      key: "SubjectName",
      render: (_, record) => (
        <div className="text-center">{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Trạng thái đăng ký",
      align: "center",
      width: 70,
      dataIndex: "ReceiveStatus",
      key: "ReceiveStatus",
      render: (val) => (
        <Tag color={["processing", "error", "success"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.RECEIVE_STATUS, listSystemKey)?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
    {
      title: "Ngày đăng ký",
      align: "center",
      width: 60,
      dataIndex: "ReceiveDate",
      key: "ReceiveDate",
      render: (val) => (
        <div>{dayjs(val).format("DD/MM/YYYY")}</div>
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

  useEffect(() => {
    socket.on("listen-change-receive-status", data => {
      setBlogs(pre => {
        const copyBlogs = [...pre]
        const index = copyBlogs?.findIndex((i) => i?._id === data?._id)
        if (index !== -1) {
          const teacher = data?.TeacherReceive?.find(i => i.Teacher?._id === user?._id)
          copyBlogs.splice(index, 1, {
            ...data,
            ReceiveStatus: teacher?.ReceiveStatus,
            ReceiveDate: teacher?.ReceiveDate,
            IsCancel: teacher?.ReceiveStatus === 1 ? false : true
          })
        } else {
          copyBlogs.push(data)
        }
        return copyBlogs
      })
    })
  }, [])


  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24} className="d-flex-sb mb-12">
          <div className="title-type-1">DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG KÝ</div>
        </Col>
        <Col span={8}>
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
        <Col span={8}>
          <Select
            placeholder="Tình trạng đăng ký"
            allowClear
            onChange={e => setPagination(pre => ({ ...pre, ReceiveStatus: e }))}
          >
            {
              getListComboKey(SYSTEM_KEY.RECEIVE_STATUS, listSystemKey)?.map(i =>
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
        <Col span={8}>
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            onChange={e => setPagination(pre => ({ ...pre, ReceiveDate: dayjs(e) }))}
          />
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

export default BlogApproval