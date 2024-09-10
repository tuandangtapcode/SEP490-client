import { Col, Row } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import ReportService from "src/services/ReportService"

const ReportManagement = () => {

  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
  })


  const getListReport = async () => {
    try {
      setLoading(true)
      const res = await ReportService.getListReport(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListData(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (pagination.PageSize) getListReport()
  }, [pagination])



  const columns = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: 'Người báo cáo',
      width: 100,
      align: 'center',
      dataIndex: 'AuthorName',
      key: 'AuthorName',
      render: (text, record) => (
        <div>{record.Sender?.FullName}</div>
      ),
    },
    {
      title: 'Tiêu đề báo cáo',
      width: 100,
      align: 'center',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: 'Nội dung báo cáo chi tiết',
      width: 300,
      dataIndex: 'Content',
      key: 'Content',
    },
    {
      title: 'Thời gian tạo',
      width: 80,
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => (
        <div>{moment(record?.createdAt).format('hh:mm - DD/MM/YYYY')}</div>
      ),
    },

  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col span={24} className="mb-5">
          <div className="title-type-1">
            QUẢN LÝ BÁO CÁO
          </div>
        </Col>
        <Col span={24}>
          <InputCustom
            type="isSearch"
            placeholder="Tìm kiếm mã giao dịch..."
            onSearch={e => setPagination(pre => ({ ...pre, TraddingCode: e }))}
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

export default ReportManagement