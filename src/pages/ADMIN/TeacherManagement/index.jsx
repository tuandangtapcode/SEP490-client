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

const { Option } = Select

const TeacherManagement = () => {

  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [total, setTotal] = useState(0)
  const [openViewProfile, setOpenViewProfile] = useState(false)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10,
    SubjectID: "",
    Level: [],
    RegisterStatus: 0
  })
  const { listSystemKey, subjects } = useSelector(globalSelector)

  const getListTeacher = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListTeacher(pagination)
      if (res?.isError) return
      setTeachers(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListTeacher()
  }, [pagination])

  const handleResponseConfirmRegister = async (record, RegisterStatus) => {
    try {
      setLoading(true)
      const res = await UserService.responseConfirmRegister({
        FullName: record?.FullName,
        TeacherID: record?._id,
        RegisterStatus
      })
      if (res?.isError) return
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
      title: "Xem chi tiết",
      disabled: false,
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenViewProfile(record)
    },
    {
      title: "Duyệt",
      icon: ListIcons?.ICON_CONFIRM,
      disabled: record?.RegisterStatus !== 2,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn duyệt tài khoản ${record?.FullName} không?`,
          onOk: async close => {
            handleResponseConfirmRegister(record, 3)
            close()
          }
        })
      }
    },
    {
      title: "Không duyệt",
      icon: ListIcons?.ICON_CLOSE,
      disabled: record?.RegisterStatus !== 2,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn không duyệt tài khoản ${record?.FullName} không?`,
          onOk: async close => {
            handleResponseConfirmRegister(record, 4)
            close()
          }
        })
      }
    },
    {
      title: !!record?.IsActive ? "Khóa tài khoản" : "Mở khóa tài khoản",
      icon: !!record?.IsActive ? ListIcons?.ICON_BLOCK : ListIcons?.ICON_UNBLOCK,
      disabled: record?.RegisterStatus !== 3 && !!record?.IsActive,
      onClick: () => handleInactiveOrActiveAccount({
        UserID: record?._id,
        IsActive: !!record?.IsActive ? false : true,
        RegisterStatus: !!record?.IsActive ? 4 : 3
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
      title: "Môn học",
      width: 80,
      dataIndex: "Subjects",
      align: "center",
      key: "Subjects",
      render: (val, record) => (
        val?.map(i =>
          <div key={i?.SubjectID}>{i?.SubjectName}</div>
        )
      )
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
        // <div style={{ color: ["#106ebe", "#fa8c16", "rgb(29, 185, 84)", "red"][val - 1] }} className="fw-600">
        //   {
        //     getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)
        //       ?.find(i => i?.ParentID === val)?.ParentName
        //   }
        // </div >
      )
    },
    {
      title: "Trạng thái tài khoản",
      width: 60,
      dataIndex: "IsActive",
      align: "center",
      key: "IsActive",
      render: (val, record) => (
        <Tag color={["success", "error"][val - 1]} className="p-5 fs-16">
          {
            !!val ? "Đang sử dụng" : "Đã bị khóa"
          }
        </Tag>
        // <div style={{ color: !!val ? "rgb(29, 185, 84)" : "red" }} className="fw-600">
        //   {
        //     !!val ? "Đang sử dụng" : "Đã bị cấm"
        //   }
        // </div >
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
      <Row gutter={[16, 16]}>
        <Col span={24} className="mb-16">
          <div className="title-type-1"> QUẢN LÝ TÀI KHOẢN GIÁO VIÊN</div>
        </Col>
        <Col span={24}>
          <InputCustom
            type="isSearch"
            placeholder="Nhập vào tên giáo viên"
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Chọn môn học"
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
        <Col span={8}>
          <Select
            mode="multiple"
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
        <Col span={8}>
          <Select
            placeholder="Tình trạng đăng ký"
            onChange={e => setPagination(pre => ({ ...pre, RegisterStatus: e }))}
          >
            <Option
              key={0}
              value={0}
            >
              Tất cả
            </Option>
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
            loading={loading}
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

        {!!openViewProfile &&
          <ViewProfileTeacher
            open={openViewProfile}
            onCancel={() => setOpenViewProfile(false)}
          />
        }
      </Row>

    </SpinCustom>
  )
}

export default TeacherManagement