import { Space, Tag } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { toast } from "react-toastify"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import TableCustom from "src/components/TableCustom"
import TimeTableService from "src/services/TimeTableService"

const TimeTables = ({ user }) => {

  const [loading, setLoading] = useState(false)
  // const [timeTables, setTimeTables] = useState([])
  const [listTimeTables, setListTimeTables] = useState([])

  // const getTimeTableOfTeacher = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await TimeTableService.getTimeTableOfTeacherOrStudent(user?._id)
  //     if (!!res?.isError) return toast.error(res?.msg)
  //     setTimeTablesTeacher(res?.data)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const rowSelection = {
    listTimeTables,
    getCheckboxProps: record => ({
      disabled: !!record?.Status || !!record?.IsCancel,
    }),
    selectedRowKeys: listTimeTables.map(i => i?._id),
    onChange: (newSelectedRowKeys, newSelectedRows) => {
      setListTimeTables(newSelectedRows)
    },
  }

  const columns = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: "Tên học sinh",
      width: 100,
      dataIndex: "FullName",
      align: "center",
      key: "FullName",
      render: (text, record) => (
        <div>{record?.Student?.FullName}</div>
      ),
    },
    {
      title: "Môn học",
      width: 80,
      dataIndex: "SubjectName",
      align: "center",
      key: "SubjectName",
      render: (text, record) => (
        <div>{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Thời gian",
      width: 80,
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
      width: 60,
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
      width: 60,
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
    <div>
      <Space className="d-flex-end mb-12">
        <ButtonCustom
          className="third"
          loading={loading}
        // onClick={() => handleRejectRegister()}
        >
          Hủy lịch học
        </ButtonCustom>
        <ButtonCustom
          className="third"
          loading={loading}
        // onClick={() => handleRejectRegister()}
        >
          Điểm danh
        </ButtonCustom>
      </Space>
      <TableCustom
        isPrimary
        bordered
        noMrb
        showPagination
        dataSource={user?.TimeTables}
        columns={columns}
        editableCell
        sticky={{ offsetHeader: -12 }}
        textEmpty="Không có dữ liệu"
        rowKey="_id"
        pagination={false}
        rowSelection={rowSelection}
      />
    </div>
  )
}

export default TimeTables