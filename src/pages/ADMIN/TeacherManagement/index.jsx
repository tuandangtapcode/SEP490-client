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
import UserService from "src/services/UserService"
import ViewProfileTeacher from "./modal/ViewProfileTeacher"
import InputCustom from "src/components/InputCustom"
import socket from "src/utils/socket"
import SpinCustom from "src/components/SpinCustom"
import { toast } from "react-toastify"
import SubjectService from "src/services/SubjectService"
import ModalReasonReject from "./modal/ModalReasonReject"

const { Option } = Select

const TeacherManagement = () => {

  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [total, setTotal] = useState(0)
  const [isViewLockUnLock, setIsViewLockUnLock] = useState()
  const [openViewProfile, setOpenViewProfile] = useState(false)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10,
    RegisterStatus: 0
  })
  const { listSystemKey } = useSelector(globalSelector)
  const [openModalReasonReject, setOpenModalReasonReject] = useState(false)

  const getListTeacher = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListTeacher(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setTeachers(res?.data?.List)
      setTotal(res?.data?.Total)
      setIsViewLockUnLock(res?.data?.IsViewLockUnLock)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListTeacher()
  }, [pagination])

  const handleConfirmRegister = async (record) => {
    try {
      setLoading(true)
      const res = await UserService.responseConfirmRegister({
        FullName: record?.FullName,
        TeacherID: record?._id,
        RegisterStatus: 3,
        Email: record?.Account?.Email
      })
      if (!!res?.isError) return toast.error(res?.msg)
      getListTeacher()
    } finally {
      setLoading(false)
    }
  }

  const handleInactiveOrActiveAccount = async (body) => {
    try {
      setLoading(true)
      const res = await UserService.inactiveOrActiveAccount(body)
      if (!!res?.isError) return
      socket.emit("inactive-account", body?.UserID)
      getListTeacher()
    } finally {
      setLoading(false)
    }
  }

  const listBtn = record => [
    {
      isView: true,
      title: "Xem chi tiết",
      disabled: false,
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenViewProfile(record)
    },
    {
      isView: true,
      title: "Duyệt",
      icon: ListIcons?.ICON_CONFIRM,
      disabled: record?.IsConfirm,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn duyệt tài khoản ${record?.FullName} không?`,
          onOk: async close => {
            handleConfirmRegister(record)
            close()
          }
        })
      }
    },
    {
      isView: true,
      title: "Không duyệt",
      icon: ListIcons?.ICON_CLOSE,
      disabled: record?.IsReject,
      onClick: () => setOpenModalReasonReject(record)
    },
    {
      isView: !!isViewLockUnLock,
      title: !!record?.Account?.IsActive ? "Khóa tài khoản" : "Mở khóa tài khoản",
      icon: !!record?.Account?.IsActive ? ListIcons?.ICON_BLOCK : ListIcons?.ICON_UNBLOCK,
      disabled: record?.IsLockUnLock,
      onClick: () => handleInactiveOrActiveAccount({
        UserID: record?._id,
        IsActive: !!record?.Account?.IsActive ? false : true,
        RegisterStatus: !!record?.Account?.IsActive ? 4 : 3
      })
    },
  ]

  const column = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: "Tên giáo viên",
      width: 100,
      dataIndex: "FullName",
      align: "center",
      key: "FullName",
    },
    {
      title: "Email",
      width: 80,
      align: "center",
      key: "Email",
      dataIndex: "Email",
      render: (_, record, index) => (
        <div className="text-center">{record?.Account?.Email}</div>
      ),
    },
    {
      title: "Trạng thái đăng ký",
      width: 80,
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
      title: "Trạng thái tài khoản",
      width: 60,
      dataIndex: "IsActive",
      align: "center",
      key: "IsActive",
      render: (val, record) => (
        <Tag color={!!record?.Account?.IsActive ? "success" : "error"} className="p-5 fs-16">
          {
            !!record?.Account?.IsActive ? "Đang sử dụng" : "Đã bị khóa"
          }
        </Tag>
      )
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
          <div className="title-type-1"> QUẢN LÝ TÀI KHOẢN GIÁO VIÊN</div>
        </Col>
        <Col span={20}>
          <InputCustom
            type="isSearch"
            placeholder="Nhập vào tên giáo viên"
            allowClear
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
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
            dataSource={teachers}
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
          !!openViewProfile &&
          <ViewProfileTeacher
            open={openViewProfile}
            onCancel={() => setOpenViewProfile(false)}
          />
        }

        {
          !!openModalReasonReject &&
          <ModalReasonReject
            open={openModalReasonReject}
            onCancel={() => setOpenModalReasonReject(false)}
            onOk={getListTeacher}
          />
        }

      </Row>

    </SpinCustom>
  )
}

export default TeacherManagement