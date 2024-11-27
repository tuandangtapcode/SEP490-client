import { Col, Row, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import UserService from "src/services/UserService"
import socket from "src/utils/socket"
import ModalInsertStaff from "./components/ModalInsertStaff"

const StaffManagement = () => {

  const [loading, setLoading] = useState(false)
  const [staffs, setStaffs] = useState([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10,
  })
  const [openModalInsertStaff, setOpenModalInsertStaff] = useState(false)

  const getListStaff = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListAccountStaff(pagination)
      if (!!res?.isError) return
      setStaffs(res?.data?.List)
      setTotal(res?.data?.Total)
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
      getListStaff()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListStaff()
  }, [pagination])

  const columns = [
    {
      title: "STT",
      width: 35,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: 'Tên staff',
      width: 80,
      align: 'center',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'Địa chỉ Email',
      width: 100,
      // align: 'center',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: "Trạng thái tài khoản",
      width: 80,
      dataIndex: "IsActive",
      align: "center",
      key: "IsActive",
      render: (val) => (
        <Tag color={!!val ? "success" : "error"} className="p-5 fs-16">
          {
            !!val ? "Đang sử dụng" : "Đã bị khóa"
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
          <ButtonCircle
            title={!!record?.IsActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            icon={!!record?.IsActive ? ListIcons?.ICON_BLOCK : ListIcons?.ICON_UNBLOCK}
            onClick={() => {
              ConfirmModal({
                description: `Bạn có chắc chắn ${!!record?.IsActive ? "khóa" : "mở khóa"} tài khoản ${record?.FullName} không?`,
                onOk: async close => {
                  handleInactiveOrActiveAccount({
                    UserID: record?._id,
                    IsActive: !!record?.IsActive ? false : true,
                  })
                  close()
                }
              })
            }}
          />
        </Space>
      ),
    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col span={24} className="d-flex-sb">
          <div className="title-type-1">
            QUẢN LÝ STAFF
          </div>
          <ButtonCustom
            className="third-type-2"
            onClick={() => setOpenModalInsertStaff(true)}
          >
            Thêm mới
          </ButtonCustom>
        </Col>
        <Col span={24}>
          <InputCustom
            type="isSearch"
            placeholder="Tìm kiếm tên..."
            allowClear
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
        </Col>
        <Col span={24} className="mt-16">
          <TableCustom
            isPrimary
            bordered
            noMrb
            showPagination
            dataSource={staffs}
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
          !!openModalInsertStaff &&
          <ModalInsertStaff
            open={openModalInsertStaff}
            onCancel={() => setOpenModalInsertStaff(false)}
            onOk={getListStaff}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default StaffManagement