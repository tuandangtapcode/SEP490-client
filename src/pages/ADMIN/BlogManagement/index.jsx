import { Col, Row, Select, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import InputCustom from "src/components/InputCustom"
import socket from "src/utils/socket"
import SpinCustom from "src/components/SpinCustom"
import { toast } from "react-toastify"
import SubjectService from "src/services/SubjectService"
import BlogService from "src/services/BlogService"
import moment from "moment";

import { formatMoney } from "src/lib/stringUtils"
import ModalViewBlogPosting from "./components/ModalViewBlogRequest"
import ModalReasonReject from "./components/ModalReasonReject"

const { Option } = Select

const BlogManagement = () => {

  const [loading, setLoading] = useState(false)
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0)
  const [openViewBlogPosting, setOpenViewBlogPosting] = useState(false)
  const [openModalReasonReject, setOpenModalReasonReject] = useState(false)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10,
    SubjectID: "",
    Level: [],
    LearnType: 0,
  })
  const { listSystemKey } = useSelector(globalSelector)
  const [subjects, setSubjects] = useState([])

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
    getListSubject()
  }, [])

  const getListBlogs = async () => {
    try {
      setLoading(true);
      const res = await BlogService.getListBlog({
        TextSearch: pagination.TextSearch,
        CurrentPage: pagination.CurrentPage,
        PageSize: pagination.PageSize,
        SubjectID: pagination.SubjectID,
      });
      if (res?.isError) {
        message.error(res?.msg);
      } else {
        setBlogs(res?.data?.List);
        setTotal(res?.data?.Total);
      }
    } catch (error) {
      message.error("Không thể tải danh sách blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListBlogs();
  }, [pagination]);

  const handleApprove = async (record) => {
    try {
      setLoading(true)
      const res = await BlogService.changeRegisterStatus({
        BlogID: record?._id,
        RegisterStatus: 3,
        FullName: record?.User?.FullName,
        Email: record?.User?.Email
      });
      console.log(res)
      if (res?.isError) return toast.error(res?.msg)
      getListBlogs();
    } finally {
      setLoading(false)

    }
  };
  const listBtn = record => [
    {
      title: "Xem chi tiết",
      disabled: false,
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenViewBlogPosting(record)
    },
    {
      title: "Duyệt",
      icon: ListIcons?.ICON_CONFIRM,
      disabled: record?.IsConfirm,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn duyệt bài viết của học sinh ${record?.User?.FullName} không?`,
          onOk: async close => {
            handleApprove(record)
            close()
          }
        })
      }
    },
    {
      title: "Không duyệt",
      icon: ListIcons?.ICON_CLOSE,
      disabled: record?.IsReject,
      onClick: () => setOpenModalReasonReject(record)
    },
  ]

  const column = [
    {
      title: "STT",
      width: 30,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: "Tên học sinh",
      width: 70,
      dataIndex: "FullName",
      align: "center",
      key: "FullName",
      render: (_, record, index) => (
        <div className="text-center">{record?.User?.FullName}</div>
      ),
    },
    {
      title: "Tiêu đề",
      width: 70,
      dataIndex: "FullName",
      align: "center",
      key: "FullName",
      render: (_, record, index) => (
        <div className="text-center">{record?.Title}</div>
      ),
    },
    {
      title: "Môn học",
      width: 40,
      align: "center",
      key: "SubjectName",
      dataIndex: "SubjectName",
      render: (_, record, index) => (
        <div className="text-center">{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Ngày đăng",
      align: "center",
      width: 40,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giá",
      width: 80,
      align: "center",
      key: "Price",
      dataIndex: "Price",
      render: (_, record, index) => (
        <div className="text-center">
          {
            !!record?.Price
              ? `${formatMoney(record?.Price)} VNĐ`
              : ""
          }
        </div>
      ),
    },
    {
      title: "Trạng thái duyệt",
      width: 60,
      dataIndex: "RegisterStatus",
      align: "center",
      key: "RegisterStatus",
      render: (val, record) => (
        <Tag color={["processing", "warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)
              ?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
    {
      title: "Chức năng",
      width: 50,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space direction="horizontal">
          {
            listBtn(record)?.map((i, idx) =>
              <ButtonCircle
                key={idx}
                disabled={i?.disabled}
                title={i?.title}
                icon={i?.icon}
                onClick={i?.onClick}
              />
            )
          }
        </Space>
      ),
    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 16]}>
        <Col span={24} className="mb-16">
          <div className="title-type-1"> QUẢN LÝ BÀI ĐĂNG CỦA HỌC SINH</div>
        </Col>
        <Col span={12}>
          <InputCustom
            type="isSearch"
            placeholder="Nhập vào tên học sinh"
            allowClear
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Chọn môn học"
            allowClear
            onChange={e => setPagination(pre => ({ ...pre, SubjectID: e }))}
          >
            {
              subjects?.map(i =>
                <Option
                  key={i?._id}
                  value={i?._id}
                >
                  {i?.SubjectName}
                </Option>
              )
            }
          </Select>
        </Col>
        <Col span={4}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn level"
            onChange={e => setPagination(pre => ({ ...pre, Level: e }))}
          >
            {
              getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map(i =>
                <Option
                  key={i?.ParentID}
                  value={i?.ParentID}
                >
                  {i?.ParentName}
                </Option>
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
                <Option
                  key={i?.ParentID}
                  value={i?.ParentID}
                >
                  {i?.ParentName}
                </Option>
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
            dataSource={blogs}
            columns={column}
            editableCell
            sticky={{ offsetHeader: -12 }}
            textEmpty="Không có dữ liệu"
            rowKey="key"
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
                    setPagination({
                      ...pagination,
                      CurrentPage,
                      PageSize,
                    }),
                }
                : false
            }
          />
        </Col>

        {
          !!openViewBlogPosting &&
          <ModalViewBlogPosting
            open={openViewBlogPosting}
            onCancel={() => setOpenViewBlogPosting(false)}
          />
        }

        {
          !!openModalReasonReject &&
          <ModalReasonReject
            open={openModalReasonReject}
            onCancel={() => setOpenModalReasonReject(false)}
            onOk={getListBlogs}
          />
        }

      </Row>

    </SpinCustom>
  )
}

export default BlogManagement