import { Col, Row, Select, Tag } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import StatisticService from "src/services/StatisticService"

const typeGet = [
  {
    value: "Day",
    label: "Ngày"
  },
  {
    value: "Week",
    label: "Tuần"
  },
  {
    value: "Month",
    label: "Tháng"
  },
]

const ListBooking = () => {

  const [loading, setLoading] = useState(false)
  const [dataBooking, setDataBooking] = useState([])
  const [totalBooking, setTotalBooking] = useState(0)
  const [pagination, setPagination] = useState({
    Key: "Month",
    CurrentPage: 1,
    PageSize: 4
  })
  const { listSystemKey } = useSelector(globalSelector)

  const statisticBooking = async () => {
    try {
      setLoading(true)
      const res = await StatisticService.statisticBooking(pagination)
      if (!!res?.isError) return
      setDataBooking(res?.data?.List)
      setTotalBooking(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    statisticBooking()
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
      title: 'Học sinh',
      width: 100,
      align: 'center',
      dataIndex: 'FullName',
      key: 'FullName',
      render: (_, record, index) => (
        <div>{record?.Sender?.FullName}</div>
      ),
    },
    {
      title: 'Giá',
      width: 90,
      dataIndex: 'TotalFee',
      key: 'TotalFee',
    },
    {
      title: 'Ngày đăng ký',
      width: 90,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val) => (
        <div>{dayjs(val).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      title: "Trạng thái",
      width: 80,
      dataIndex: "ConfirmStatus",
      align: "center",
      key: "ConfirmStatus",
      render: (val) => (
        <Tag color={["processing", "warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.CONFIRM_STATUS, listSystemKey)
              ?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
  ]

  return (
    <Row gutter={[8, 8]}>
      <Col span={6}>
        <Select
          placeholder="Ngày/Tháng/Tuần"
          allowClear
          value={pagination.Key}
          onChange={e => setPagination(pre => ({ ...pre, Key: e }))}
          style={{ width: "100%" }}
        >
          {
            typeGet?.map(i =>
              <Select.Option
                key={i?.value}
                value={i?.value}
              >
                {i?.label}
              </Select.Option>
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
          dataSource={dataBooking}
          columns={columns}
          editableCell
          sticky={{ offsetHeader: -12 }}
          textEmpty="Không có dữ liệu"
          rowKey="key"
          pagination={
            !!pagination?.PageSize
              ? {
                hideOnSinglePage: totalBooking <= 10,
                current: pagination?.CurrentPage,
                pageSize: pagination?.PageSize,
                responsive: true,
                total: totalBooking,
                showSizeChanger: totalBooking > 10,
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
    </Row>
  )
}

export default ListBooking