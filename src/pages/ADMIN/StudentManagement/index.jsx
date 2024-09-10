import { Col, Row, Space, Tag, Tooltip } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import UserService from "src/services/UserService"
import socket from "src/utils/socket"

const StudentManagement = () => {

  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10,
    SortByBookQuantity: 1
  })

  const { listSystemKey } = useSelector(globalSelector)
  const registerStatus = getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)


  const getListStudent = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListStudent(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListData(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (pagination.PageSize) getListStudent()
  }, [pagination])

  const handleInactiveOrActiveAccount = async (body) => {
    try {
      setLoading(true)
      const res = await UserService.inactiveOrActiveAccount(body)
      if (!!res?.isError) return
      socket.emit("inactive-account", body?.UserID)
      getListStudent()
    } finally {
      setLoading(false)
    }
  }

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
      title: 'Tên học viên',
      width: 80,
      align: 'center',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'Địa chỉ Email',
      width: 80,
      // align: 'center',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Địa chỉ',
      width: 80,
      dataIndex: 'Address',
      key: 'Address',
    },
    {
      title:
        <div className="d-flex-sb">
          <p>Số lượng môn đã học</p>
          {pagination?.SortByBookQuantity === 1 ?
            <Tooltip title="Giảm dần">
              <div onClick={() => setPagination(pre => ({ ...pre, SortByBookQuantity: -1 }))}>
                {ListIcons?.ICON_DOWN}
              </div>
            </Tooltip>
            :
            <Tooltip title="Tăng dần">
              <div onClick={() => setPagination(pre => ({ ...pre, SortByBookQuantity: 1 }))}>
                {ListIcons?.ICON_UP}
              </div>
            </Tooltip>
          }
        </div>,
      width: 75,
      align: 'center',
      dataIndex: 'BookQuantity',
      key: 'BookQuantity',
    },
    {
      title: 'Thời gian tạo',
      width: 50,
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => (
        <div>{moment(record?.createdAt).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      title: "Trạng thái tài khoản",
      width: 60,
      dataIndex: "RegisterStatus",
      align: "center",
      key: "RegisterStatus",
      render: (val, record) => (
        <Tag color={["processing", "warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            registerStatus?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
        // <div style={{ color: ["#106ebe", "#fa8c16", "rgb(29, 185, 84)", "red"][val - 1] }} className="fw-600">
        //   {
        //     registerStatus?.find(i => i?.ParentID === val)?.ParentName
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
                    RegisterStatus: !!record?.IsActive ? 4 : 3
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
        <Col span={24} className="mb-5">
          <div className="title-type-1">
            DANH SÁCH HỌC SINH
          </div>
        </Col>
        <Col span={24}>
          <InputCustom
            type="isSearch"
            placeholder="Tìm kiếm tên hoặc email..."
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
        </Col>
        <Col span={24} className="mt-16">
          <TableCustom
            isPrimary
            bordered
            noMrb
            showPagination
            loading={loading}
            dataSource={listData}
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
    </SpinCustom>
  )
}

export default StudentManagement