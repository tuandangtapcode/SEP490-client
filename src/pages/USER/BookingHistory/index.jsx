import { Col, Row, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import ConfirmService from "src/services/ConfirmService"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { Roles, SYSTEM_KEY } from "src/lib/constant"
import dayjs from "dayjs"
import { getListComboKey } from "src/lib/commonFunction"
import TableCustom from "src/components/TableCustom"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"


const BookingHistory = () => {

  const { user, listSystemKey } = useSelector(globalSelector)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [confirms, setConfirms] = useState([])
  const [total, setTotal] = useState(0)
  const [openModalViewOrUpdate, setOpenModalViewOrUpdate] = useState(false)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TextSearch: ""
  })

  const getListConfirm = async () => {
    try {
      setLoading(true)
      const res = await ConfirmService.getListConfirm(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setConfirms(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListConfirm()
  }, [pagination])

  const listBtn = record => [
    {
      title: "Xem chi tiết",
      isView: record?.IsView,
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenModalViewOrUpdate({
        isUpdate: false,
        data: record
      })
    },
    {
      title: "Chỉnh sửa",
      isView: record?.IsUpdate,
      icon: ListIcons?.ICON_EDIT,
      onClick: () => setOpenModalViewOrUpdate({
        isUpdate: true,
        data: record
      })
    },
    {
      title: "Duyệt",
      isView: record?.IsAccept,
      icon: ListIcons?.ICON_CONFIRM,
      onClick: () => setOpenModalViewOrUpdate({
        isUpdate: true,
        data: record
      })
    },
    {
      title: "Hủy",
      isView: record?.IsReject,
      icon: ListIcons?.ICON_CLOSE,
      onClick: () => setOpenModalViewOrUpdate({
        isUpdate: true,
        data: record
      })
    },
  ]

  const columns = [
    {
      title: "STT",
      width: 20,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: user?.RoleID === Roles.ROLE_STUDENT ? "Giáo viên" : "Học sinh",
      width: 100,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">
          {
            !!record?.Receiver ? record?.Receiver?.FullName : record?.Sender?.FullName
          }
        </div>
      ),
    },
    {
      title: "Môn học",
      width: 80,
      align: "center",
      render: (_, record) => (
        <div className="text-center">{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Số buổi học",
      width: 40,
      align: "center",
      render: (_, record) => (
        <div className="text-center">{record?.Schedules?.length}</div>
      ),
    },
    {
      title: "Hình thức học",
      width: 80,
      key: "LearnType",
      dataIndex: "LearnType",
      align: "center",
      render: (val, record) => (
        <div className="text-center">
          {
            getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.find(i => i?.ParentID === val)?.ParentName
          }
        </div>
      ),
    },
    {
      title: "Ngày đăng ký",
      width: 70,
      align: "center",
      render: (_, record) => (
        <div className="text-center">{dayjs(record?.createdAt).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      title: "Trạng thái",
      width: 100,
      key: "ConfirmStatus",
      dataIndex: "ConfirmStatus",
      align: "center",
      render: (val) => (
        <Tag color={["warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.CONFIRM_STATUS, listSystemKey)?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      ),
    },
    {
      title: "Chức năng",
      width: 70,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space direction="horizontal">
          {
            listBtn(record)?.map((i, idx) =>
              !!i?.isView &&
              <ButtonCircle
                key={idx}
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
    <Row gutter={[16, 16]}>
      <Col span={24} className="d-flex-sb mb-12">
        <div className="title-type-1">
          Lịch sử booking
        </div>
      </Col>
      <Col>
        <TableCustom
          isPrimary
          bordered
          noMrb
          showPagination
          loading={loading}
          dataSource={confirms}
          columns={columns}
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
    </Row>
  )
}

export default BookingHistory