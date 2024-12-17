import { Col, DatePicker, Row, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import BankingService from "src/services/BankingService"
import PaymentService from "src/services/PaymentService"
import ModalPaymentTransfer from "./components/ModalPaymentTransfer"
import dayjs from "dayjs"
import { getCurrentWeekRange } from "src/lib/dateUtils"
import ButtonCustom from "src/components/MyButton/ButtonCustom"


const PaymentTransfer = () => {

  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState([])
  const [listBank, setListBank] = useState([])
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    // FromDate: getCurrentWeekRange().startOfWeek,
    // ToDate: getCurrentWeekRange().endOfWeek
  })
  const [openModalPaymentTransfer, setOpenModalTransfer] = useState(false)
  const { listSystemKey } = useSelector(globalSelector)
  const PaymentStatuskey = getListComboKey(SYSTEM_KEY.PAYMENT_STATUS, listSystemKey)


  const getListPaymentTransfer = async () => {
    try {
      setLoading(true)
      const res = await PaymentService.getListTransfer(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListData(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const getListBank = async () => {
    try {
      setLoading(true)
      const res = await BankingService.getListBank()
      if (!res?.data?.data) return toast.error(res?.data?.desc)
      setListBank(res?.data?.data)
    } finally {
      setLoading(false)
    }
  }

  const getBankingInforOfUser = async (record) => {
    try {
      setLoading(true)
      const res = await BankingService.getBankingInforOfUser({
        UserID: record?.Receiver?._id,
        FullName: record?.Receiver?.FullName,
        Email: record?.Receiver?.Email
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setOpenModalTransfer({
        ...res?.data,
        RoleID: record?.Receiver?.RoleID,
        FullName: record?.Receiver?.FullName,
        Email: record?.Receiver?.Email,
        PaymentID: record?._id,
        BankName: listBank?.find(i => +i?.bin === res?.data?.BankID)?.name,
        BankImgae: listBank?.find(i => +i?.bin === res?.data?.BankID)?.logo,
        TotalFee: record?.TotalFee,
        Description: record?.Description,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListBank()
  }, [])

  useEffect(() => {
    if (pagination.PageSize) getListPaymentTransfer()
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
      title: 'Tên người nhận',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div>{record?.Receiver?.FullName}</div>
      )
    },
    {
      title: 'Số tiền cần thanh toán',
      width: 70,
      align: 'center',
      render: (text, record) => (
        <div>{formatMoney(record.TotalFee)}</div>
      ),
    },
    // {
    //   title: 'Số lượng tiết học trong tuần',
    //   width: 80,
    //   align: 'center',
    //   render: (_, record) => (
    //     <div>{record?.Receiver?.TimeTables?.length}</div>
    //   )
    // },
    {
      title: "Trạng thái",
      width: 80,
      dataIndex: "PaymentStatus",
      align: "center",
      key: "PaymentStatus",
      render: (val, record) => (
        <Tag color={["warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            PaymentStatuskey?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
    {
      title: "Chức năng",
      align: "center",
      width: 70,
      render: (_, record) => (
        <Space direction="horizontal">
          <ButtonCustom
            className="third-type-2"
            onClick={() => getBankingInforOfUser(record)}
          >
            Thanh toán
          </ButtonCustom>
        </Space>
      )
    }
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 16]}>
        <Col span={24} className="mb-5">
          <div className="title-type-1">
            QUẢN LÝ TIỀN LƯƠNG
          </div>
        </Col>
        <Col span={24}>
          <InputCustom
            type="isSearch"
            placeholder="Tìm kiếm tên người nhận..."
            allowClear
            onSearch={e => setPagination(pre => ({ ...pre, TraddingCode: e }))}
          />
        </Col>
        {/* <Col span={4}>
          <Select
            placeholder="Trạng thái thanh toán"
            allowClear
            onChange={e => setPagination(pre => ({ ...pre, Paymentstatus: e }))}
          >
            {PaymentStatuskey.map(PaymentStatus => (
              <Select.Option key={PaymentStatus._id} value={PaymentStatus.ParentID}>
                {PaymentStatus?.ParentName}
              </Select.Option>
            ))}
          </Select>
        </Col> */}
        {/* <Col span={6}>
          <DatePicker.RangePicker
            value={[dayjs(pagination?.FromDate), dayjs(pagination?.ToDate)]}
            format="DD/MM/YYYY"
            onChange={e => setPagination(pre => ({
              ...pre,
              FromDate: dayjs(e[0]).startOf("day"),
              ToDate: dayjs(e[1]).endOf("day")
            }))}
          />
        </Col> */}
        <Col span={24} className="mt-16">
          <TableCustom
            isPrimary
            bordered
            noMrb
            dataSource={listData}
            columns={columns}
            editableCell
            sticky={{ offsetHeader: -12 }}
            textEmpty="Không có dữ liệu"
            rowKey="key"
          />
        </Col>

        {
          !!openModalPaymentTransfer &&
          <ModalPaymentTransfer
            open={openModalPaymentTransfer}
            onCancel={() => setOpenModalTransfer(false)}
            onOk={() => getListPaymentTransfer()}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default PaymentTransfer
