import { Space } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ListIcons from "src/components/ListIcons"
import ModalCustom from "src/components/ModalCustom"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney, getRealFee } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import CourseService from "src/services/CourseService"

const ModalChooseCourse = ({
  open,
  onCancel,
  course,
  setCourse,
  setTotalSlot,
  setSlotInWeek,
  setScheduleInWeek
}) => {

  const { listSystemKey, profitPercent } = useSelector(globalSelector)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  const getListCourseOfTeacher = async () => {
    try {
      setLoading(true)
      const res = await CourseService.getListCourseOfTeacher({
        Teacher: open?.TeacherID,
        Subject: open?.SubjectID
      })
      if (!!res?.isError) return
      setCourses(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListCourseOfTeacher()
  }, [open])

  const columns = [
    {
      title: "Tiêu đề khóa học",
      width: 100,
      dataIndex: "Title",
      align: "center",
      key: "Title",
    },
    {
      title: "Cấp độ khóa học",
      width: 80,
      dataIndex: "Level",
      align: "center",
      key: "Level",
      render: (value) => (
        <div>
          {
            getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)
              ?.find(i => i?.ParentID === value)?.ParentName
          }
        </div>
      )
    },
    {
      title: "Giá tiền",
      width: 60,
      dataIndex: "Price",
      align: "center",
      key: "Price",
      render: (value) => (
        <div>
          {formatMoney(getRealFee(value, profitPercent))} VNĐ
        </div>
      )
    },
    {
      title: "Số lượng buổi học",
      width: 40,
      dataIndex: "QuantitySlot",
      align: "center",
      key: "QuantitySlot",
    },
    {
      title: "Số lượng người học",
      width: 40,
      dataIndex: "QuantityLearner",
      align: "center",
      key: "QuantityLearner",
    },
    {
      title: "Chọn khóa học",
      width: 70,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space direction="horizontal">
          <ButtonCircle
            icon={
              record?._id === course?._id
                ? ListIcons.ICON_CLOSE
                : ListIcons.ICON_PLUS
            }
            title={
              record?._id === course?._id
                ? "Bỏ chọn"
                : "Chọn"
            }
            onClick={() => {
              if (record?._id === course?._id) {
                setCourse()
                setTotalSlot(0)
              } else {
                setCourse(record)
                setTotalSlot(record?.QuantitySlot)
              }
              setSlotInWeek(0)
              setScheduleInWeek([])
            }}
          />
        </Space>
      ),
    },
  ]

  return (
    <SpinCustom loading={loading}>
      <ModalCustom
        open={open}
        onCancel={onCancel}
        title="Chọn khóa học dài hạn"
        width="80vw"
        footer={null}
      >
        <TableCustom
          isPrimary
          bordered
          noMrb
          showPagination
          dataSource={courses}
          columns={columns}
          editableCell
          sticky={{ offsetHeader: -12 }}
          textEmpty="Không có dữ liệu"
          rowKey="_id"
          pagination={false}
        />
      </ModalCustom >
    </SpinCustom>
  )
}

export default ModalChooseCourse