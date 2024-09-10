import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import PaymentService from "src/services/PaymentService"
import { Col, Row, Select, Tag } from "antd"
import TableCustom from "src/components/TableCustom"
import { globalSelector } from "src/redux/selector"
import { useSelector } from "react-redux"
import { SYSTEM_KEY } from "src/lib/constant"
import { getListComboKey } from "src/lib/commonFunction"
import InputCustom from "src/components/InputCustom"
import { formatMoney } from "src/lib/stringUtils"


const BillingPage = () => {

  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    TraddingCode: "",
    CurrentPage: 1,
    PageSize: 10,
    PaymentStatus: 0,
    PaymentType: 0
  })

  const { listSystemKey } = useSelector(globalSelector)
  const PaymentTypeKey = getListComboKey(SYSTEM_KEY.PAYMENT_TYPE, listSystemKey)
  const PaymentStatuskey = getListComboKey(SYSTEM_KEY.PAYMENT_STATUS, listSystemKey)

  const getListPaymentHistoryByUser = async () => {
    try {
      setLoading(true)
      const res = await PaymentService.getListPaymentHistoryByUser(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListData(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (pagination.PageSize) getListPaymentHistoryByUser()
  }, [pagination])



  const columns = [
    {
      title: 'Mã giao dịch',
      width: 60,
      align: 'center',
      dataIndex: 'TraddingCode',
      key: 'TraddingCode',
    },
    {
      title: 'Nội dung giao dịch',
      width: 300,
      align: 'center',
      dataIndex: 'Description',
      key: 'Description',
    },
    {
      title: 'Số tiền giao dịch',
      width: 80,
      align: 'center',
      dataIndex: 'TotalFee',
      key: 'TotalFee',
      render: (text, record) => (
        <div>{formatMoney(record.TotalFee)}</div>
      ),
    },
    {
      title: "Loại thanh toán",
      width: 100,
      dataIndex: "PaymentType",
      align: "center",
      key: "PaymentType",
      render: (text, record) => (
        <p>
          {PaymentTypeKey.find(i => i?.ParentID === record?.PaymentType)?.ParentName}
        </p>
      )
    },
    {
      title: "Trạng thái thanh toán",
      width: 100,
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
  ]

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} className="mb-5">
        <div className="title-type-1">
          LỊCH SỬ GIAO DỊCH
        </div>
      </Col>
      <Col span={14}>
        <InputCustom
          type="isSearch"
          placeholder="Tìm kiếm mã giao dịch..."
          onSearch={e => setPagination(pre => ({ ...pre, TraddingCode: e }))}
        />
      </Col>
      <Col span={6}>
        <Select
          placeholder="Loại thanh toán"
          onChange={e => setPagination(pre => ({ ...pre, PaymentType: e }))}
        >
          {PaymentTypeKey.map(PaymentType => (
            <Select.Option key={PaymentType._id} value={PaymentType.ParentID}>
              {PaymentType?.ParentName}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={4}>
        <Select
          placeholder="Trạng thái thanh toán"
          onChange={e => setPagination(pre => ({ ...pre, PaymentStatus: e }))}
        >
          {PaymentStatuskey.map(PaymentType => (
            <Select.Option key={PaymentType._id} value={PaymentType.ParentID}>
              {PaymentType?.ParentName}
            </Select.Option>
          ))}
        </Select>
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
  )
}

export default BillingPage