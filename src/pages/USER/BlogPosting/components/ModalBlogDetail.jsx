import { useEffect, useState } from "react"
import { Tag, Space, Row, Col, Table } from "antd"
import { Roles, SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { useSelector } from "react-redux"
import { defaultDays } from "src/lib/dateUtils"
import dayjs from "dayjs"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { formatMoney } from "src/lib/stringUtils"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import socket from "src/utils/socket"
import BlogService from "src/services/BlogService"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import Router from "src/routers"


const ModalBlogDetail = ({
  open,
  onCancel,
  setOpenModalDetailBlog,
  onOk
}) => {

  const [loading, setLoading] = useState(false)
  const { listSystemKey, user } = useSelector(globalSelector)

  const changeReceiveStatus = async (record, ReceiveStatus) => {
    try {
      setLoading(true)
      const res = await BlogService.changeReceiveStatus({
        BlogID: open?._id,
        TeacherID: record?.Teacher?._id,
        ReceiveStatus: ReceiveStatus
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
      onOk()
      if (ReceiveStatus === 3) {
        res?.data?.TeacherReceive?.forEach(i => {
          socket.emit("send-change-receive-status", {
            ...res?.data,
            Receiver: i?.Teacher?._id,
          })
        })
      } else {
        socket.emit("send-change-receive-status", {
          ...res?.data,
          Receiver: record?.Teacher?._id,
        })
      }
      setOpenModalDetailBlog(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const listBtn = record => [
    {
      title: "Duyệt",
      icon: ListIcons?.ICON_CONFIRM,
      isDisabled: record?.IsConfirm,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn duyệt giáo viên này không?`,
          onOk: async close => {
            changeReceiveStatus(record, 3)
            close()
          }
        })
      }
    },
    {
      title: "Không duyệt",
      icon: ListIcons?.ICON_CLOSE,
      isDisabled: record?.IsReject,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn hủy duyệt giáo viên này không?`,
          onOk: async close => {
            changeReceiveStatus(record, 2)
            close()
          }
        })
      }
    },
  ]

  const defaultColumns = [
    {
      title: "STT",
      align: "center",
      dataIndex: "index",
      width: 50,
      key: "index",
      render: (_, record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: "Giáo viên",
      align: "center",
      width: 100,
      dataIndex: "FullName",
      key: "FullName",
      render: (_, record) => (
        <Link to={`${Router.GIAO_VIEN}/${record?.Teacher?._id}${Router.MON_HOC}/${open?.Subject?._id}`}>
          {record?.Teacher?.FullName}
        </Link>
      )
    },
    {
      title: "Trạng thái",
      align: "center",
      width: 80,
      dataIndex: "ReceiveStatus",
      key: "ReceiveStatus",
      render: (val) => (
        <Tag color={["processing", "error", "success"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.RECEIVE_STATUS, listSystemKey)
              ?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    }
  ]

  const actionColums = [
    {
      title: "Chức năng",
      width: 70,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space direction="horizontal">
          {
            listBtn(record)?.map((i, idx) =>
              <ButtonCircle
                key={idx}
                disabled={i?.isDisabled}
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

  useEffect(() => {
    socket.on("listen-change-receive-status", data => {
      console.log("data", data);
      setOpenModalDetailBlog(data)
    })
  }, [])

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết bài đăng"
      width="60vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom btntype="cancel" onClick={onCancel}>
            Đóng
          </ButtonCustom>
        </Space>
      }
    >
      <div className="d-flex-center">
        <Row style={{ width: "80%" }} gutter={[16, 0]}>
          <Col span={3}>
            <div>Tiêu đề:</div>
          </Col>
          <Col span={21}>
            <div>{open?.Title}</div>
          </Col>
          <Col span={12} className="mb-12">
            <Row>
              <Col span={5}>
                <div>Môn học:</div>
              </Col>
              <Col span={19}>
                <div>{open?.Subject?.SubjectName}</div>
              </Col>
            </Row>
          </Col>
          <Col span={12} className="mb-12">
            {
              user?.RoleID !== Roles.ROLE_TEACHER &&
              <Row>
                <Col span={5}>
                  <div>Trạng thái:</div>
                </Col>
                <Col span={19}>
                  <div>
                    {
                      getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)
                        ?.find(i => i?.ParentID === open?.RegisterStatus)?.ParentName
                    }
                  </div>
                </Col>
              </Row>
            }
          </Col>
          <Col span={12} className="mb-12">
            <Row>
              <Col span={5}>
                <div>Trình độ:</div>
              </Col>
              <Col span={19}>
                <div>
                  {
                    getListComboKey(SYSTEM_KEY.PROFESSIONAL_LEVEL, listSystemKey)
                      ?.find(i => i?.ParentID === open?.ProfessionalLevel)?.ParentName
                  }
                </div>
              </Col>
              <Col span={5}>
                <div>Giới tính:</div>
              </Col>
              <Col span={19}>
                <div>
                  {
                    getListComboKey(SYSTEM_KEY.GENDER, listSystemKey)
                      ?.map((item, idx) => {
                        if (open?.Gender?.includes(item?.ParentID))
                          return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                      })
                  }
                </div>
              </Col>
              <Col span={7}>
                <div>Hình thức học:</div>
              </Col>
              <Col span={17}>
                <div>
                  {
                    getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                      ?.map((item, idx) => {
                        if (open?.LearnType?.includes(item?.ParentID))
                          return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                      })
                  }
                </div>
              </Col>
              <Col span={7}>
                <div>Tổng số buổi:</div>
              </Col>
              <Col span={17}>
                <div>{open?.NumberSlot}</div>
              </Col>
              <Col span={7}>
                <div>Số buổi/tuần:</div>
              </Col>
              <Col span={17}>
                <div>{open?.Schedules?.length}</div>
              </Col>
              <Col span={7}>
                <div>Giá tiền/buổi:</div>
              </Col>
              <Col span={17}>
                <div>{formatMoney(open?.Price)} VNĐ</div>
              </Col>
            </Row>
          </Col>
          <Col span={12} className="mb-12">
            <Row>
              <Col span={24}>Lịch học:</Col>
              <Col span={24}>
                {
                  open?.Schedules?.map((i, idx) =>
                    <div key={idx}>
                      <span className="mr-3">
                        {
                          defaultDays?.find(d => d?.value === i?.DateValue)?.VieNameSpecific
                        }:
                      </span>
                      <span>
                        {dayjs(i?.StartTime).format("HH:mm")}-
                      </span>
                      <span>
                        {dayjs(i?.EndTime).format("HH:mm")}
                      </span>
                    </div>
                  )
                }
              </Col>
              <Col span={24}>Ngày bắt đầu học: {dayjs(open?.StartDate).format("DD/MM/YYYY")}</Col>
            </Row>
          </Col>
          {
            user?.RoleID !== Roles.ROLE_TEACHER &&
            <>
              <Col span={24}>
                <p className="fs-16 fw-600">Danh sách giáo viên tham gia</p>
              </Col>
              <Col span={24}>
                <Table
                  bordered
                  dataSource={open?.TeacherReceive}
                  columns={
                    user?.RoleID === Roles.ROLE_STUDENT
                      ? [...defaultColumns, ...actionColums]
                      : defaultColumns
                  }
                  editableCell
                  sticky={{ offsetHeader: -12 }}
                  textEmpty="Không có dữ liệu"
                  rowKey="key"
                  pagination={false}
                />
              </Col>
            </>
          }
        </Row>
      </div>
    </ModalCustom>
  )
}

export default ModalBlogDetail
