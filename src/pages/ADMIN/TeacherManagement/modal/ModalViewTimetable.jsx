import { Space, Tag } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import TableCustom from "src/components/TableCustom"
import LearnHistoryService from "src/services/LearnHistoryService"
import TimeTableService from "src/services/TimeTableService"

const ModalViewTimeTable = ({ open, onCancel, onOk }) => {

  const [loading, setLoading] = useState(false)
  const [timeTables, setTimeTables] = useState([])
  const [listTimeTables, setListTimeTables] = useState([])

  const getDetailLearnHistory = async () => {
    try {
      setLoading(true)
      const res = await LearnHistoryService.getDetailLearnHistory(open)
      if (!!res?.isError) return toast.error(res?.msg)
      setTimeTables(res?.data?.Timetables)
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceOrCancelTimeTable = async (type) => {
    try {
      setLoading(true)
      const res = await TimeTableService.attendanceOrCancelTimeTable({
        TimeTables: listTimeTables?.map(i => i?._id),
        Type: type,
        LearnHistoryID: open
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      getDetailLearnHistory()
      onOk()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetailLearnHistory()
  }, [open])

  const rowSelection = {
    listTimeTables,
    getCheckboxProps: record => ({
      isDisabled: !!record?.Status || !!record?.IsCancel || record?.IsDisabledAtendance,
    }),
    selectedRowKeys: listTimeTables.map(i => i?._id),
    onChange: (newSelectedRowKeys, newSelectedRows) => {
      setListTimeTables(newSelectedRows)
    },
  }

  const columns = [
    {
      title: "STT",
      width: 30,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: "Thời gian",
      width: 100,
      dataIndex: "StartTime",
      align: "center",
      key: "StartTime",
      render: (text, record) => (
        <div>
          <span className="mr-3">{dayjs(record?.StartTime).format('DD/MM/YYYY')}</span>
          <span>{dayjs(record?.StartTime).format('hh:mm')}-</span>
          <span>{dayjs(record?.EndTime).format('hh:mm')}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái điểm danh",
      width: 80,
      dataIndex: "Status",
      align: "center",
      key: "Status",
      render: (val) => (
        <Tag color={!!val ? "success" : "error"} className="p-5 fs-16">
          {
            !!val ? "Đã điểm danh" : "Chưa điểm danh"
          }
        </Tag>
      )
    },
    {
      title: "Trạng thái buổi học",
      width: 80,
      dataIndex: "IsCancel",
      align: "center",
      key: "IsCancel",
      render: (val) => (
        <Tag color={!val ? "success" : "error"} className="p-5 fs-16">
          {
            !val ? "Đang sử dụng" : "Đã hủy"
          }
        </Tag>
      )
    },
  ]

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Thời khóa biểu"
      width="70vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
          <ButtonCustom
            className="third-type-2"
            onClick={() => handleAttendanceOrCancelTimeTable("IsCancel")}
          >
            Hủy lịch học
          </ButtonCustom>
          <ButtonCustom
            className="third-type-2"
            onClick={() => handleAttendanceOrCancelTimeTable("Status")}
          >
            Điểm danh
          </ButtonCustom>
        </Space>
      }
    >
      <TableCustom
        isPrimary
        bordered
        noMrb
        showPagination
        loading={loading}
        dataSource={timeTables}
        columns={columns}
        editableCell
        sticky={{ offsetHeader: -12 }}
        textEmpty="Không có dữ liệu"
        rowKey="_id"
        pagination={false}
        rowSelection={rowSelection}
      />
    </ModalCustom>
  )
}

export default ModalViewTimeTable