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
import ModalViewBooking from "./components/ModalViewBooking"
import SpinCustom from "src/components/SpinCustom"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import NotificationService from "src/services/NotificationService"
import socket from "src/utils/socket"
import Router from "src/routers"
import ModalReasonReject from "./components/ModalReasonReject"


const BookingHistory = () => {

  const navigate = useNavigate()
  const { user, listSystemKey } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)
  const [confirms, setConfirms] = useState([])
  const [total, setTotal] = useState(0)
  const [openModalViewBooking, setOpenModalViewBooking] = useState(false)
  const [openModalReasonReject, setOpenModalReasonReject] = useState(false)
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

  const changeConfirmStatus = async (record, confirmStatus) => {
    try {
      setLoading(true)
      if (confirmStatus === 4) {
        const resNotiffication = await NotificationService.createNotification({
          Content: `Giáo viên ${user?.FullName} đã ghi nhận xác nhận booking của bạn`,
          Type: "lich-su-booking",
          Receiver: record?.Sender?._id
        })
        if (!!resNotiffication?.isError) return toast.error(res?.msg)
        socket.emit('send-notification',
          {
            Content: resNotiffication?.data?.Content,
            IsSeen: resNotiffication?.IsSeen,
            _id: resNotiffication?.data?._id,
            Type: resNotiffication?.data?.Type,
            IsNew: resNotiffication?.data?.IsNew,
            Receiver: resNotiffication?.data?.Receiver,
            createdAt: resNotiffication?.data?.createdAt
          })
      }
      const res = await ConfirmService.changeConfirmStatus({
        ConfirmID: record?._id,
        ConfirmStatus: confirmStatus,
        RecevierName: user?.FullName,
        SenderName: record?.Sender?.FullName,
        SenderEmail: record?.Sender?.Email
      })
      if (!!res?.isError) return toast.error(res?.msg)
      if (confirmStatus === 4) {
        socket.emit("send-noted-confirm", {
          ...res?.data,
          RoleID: user?.RoleID,
          IsReject: false
        })
      }
      getListConfirm()
      toast.success(res?.msg)
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
      isView: true,
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenModalViewBooking(record)
    },
    {
      title: !!record?.IsDisabledConfirm ? "Bạn đã có lịch trùng với booking này" : "Duyệt",
      isDisabled: record?.IsDisabledConfirm,
      isView: record?.IsConfirm,
      icon: ListIcons?.ICON_CONFIRM,
      onClick: () => {
        ConfirmModal({
          icon: "ICON_SUSCESS_MODAL",
          description: `Bạn có chắc chắn xác nhận booking không?`,
          onOk: async close => {
            changeConfirmStatus(record, 2)
            close()
          }
        })
      }
    },
    {
      title: "Thanh toán",
      isView: record?.IsPaid,
      icon: ListIcons?.ICON_PAYMENT_BOOKING,
      onClick: () => navigate(`${Router.CHECKOUT}/${record?._id}`)
    },
    {
      title: "Hủy",
      isView: record?.IsReject,
      icon: ListIcons?.ICON_CLOSE,
      onClick: () => setOpenModalReasonReject(record)
    },
    {
      title: "Ghi nhận",
      isView: record?.IsNoted,
      icon: ListIcons?.ICON_NOTED,
      onClick: () => changeConfirmStatus(record, 4)
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
            !!record?.Receiver?._id ? record?.Receiver?.FullName : record?.Sender?.FullName
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
        <div className="text-center">{dayjs(record?.createdAt).format("DD/MM/YYYY HH:mm")}</div>
      ),
    },
    {
      title: "Trạng thái",
      width: 100,
      key: "ConfirmStatus",
      dataIndex: "ConfirmStatus",
      align: "center",
      render: (val) => (
        <Tag color={["warning", "success", "error", "blue"][val - 1]} className="p-5 fs-16">
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
                disabled={i?.isDisabled}
                onClick={i?.onClick}
              />
            )
          }
        </Space>
      ),
    },
  ]

  useEffect(() => {
    socket.on("listen-noted-confirm", data => {
      setConfirms(pre => {
        const copyConfirms = [...pre]
        const index = copyConfirms?.findIndex((i) => i?._id === data?._id)
        if (index !== -1) {
          copyConfirms.splice(index, 1, data)
        } else {
          copyConfirms.push(data)
        }
        return copyConfirms
      })
    })
  }, [])


  return (
    <SpinCustom spinning={loading}>
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

        {
          !!openModalViewBooking &&
          <ModalViewBooking
            open={openModalViewBooking}
            onCancel={() => setOpenModalViewBooking(false)}
          />
        }

        {
          !!openModalReasonReject &&
          <ModalReasonReject
            open={openModalReasonReject}
            onCancel={() => setOpenModalReasonReject(false)}
            onOk={getListConfirm}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default BookingHistory