import { Col, Row, Space } from "antd"
import { useSelector } from "react-redux"
import ModalCustom from "src/components/ModalCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import dayjs from "dayjs"
import { formatMoney } from "src/lib/stringUtils"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { useState } from "react"
import ConfirmService from "src/services/ConfirmService"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Notice from "src/components/Notice"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import Router from "src/routers"

const ModalConfirmInfor = ({
  open,
  onCancel,
  teacher,
  bookingInfor,
  selectedTimes,
  course,
  timeTablesStudent,
  timeTablesTeacher
}) => {

  const { listSystemKey, user, profitPercent } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const sendRequestBooking = async () => {
    try {
      setLoading(true)
      if (bookingInfor?.LearnType === 2 && !bookingInfor?.Address) {
        return Notice({
          isSuccess: false,
          msg: "Hãy nhập địa chỉ"
        })
      }
      const selectTimesArray = selectedTimes.map(i => dayjs(i.StartTime).format("DD/MM/YYYY HH:mm"))
      const timeTablesStudentArray = timeTablesStudent.map(i => dayjs(i.StartTime).format("DD/MM/YYYY HH:mm"))
      const timeTablesTeacherArray = timeTablesTeacher.map(i => dayjs(i.StartTime).format("DD/MM/YYYY HH:mm"))
      const checkExistTimeTablesStudent = selectTimesArray.filter(i => timeTablesStudentArray.includes(i))
      const checkExistTimeTablesTeacher = selectTimesArray.filter(i => timeTablesTeacherArray.includes(i))
      if (!!checkExistTimeTablesStudent.length) {
        return ConfirmModal({
          description: `Bạn đã có lịch học vào ngày ${checkExistTimeTablesStudent.map(i => i).join()}`,
          onOk: async close => {
            close()
          }
        })
      }
      if (!!checkExistTimeTablesTeacher.length) {
        return ConfirmModal({
          description: `Giáo viên đã có lịch dạy vào ngày ${checkExistTimeTablesTeacher.map(i => i).join()}`,
          onOk: async close => {
            close()
          }
        })
      }
      const res = await ConfirmService.createConfirm({
        Sender: user?._id,
        CourseID: !!course ? course?._id : undefined,
        StudentName: user?.FullName,
        Receiver: teacher?.Teacher?._id,
        TeacherName: teacher?.Teacher?.FullName,
        TeacherEmail: teacher?.Teacher?.Email,
        Subject: teacher?.Subject?._id,
        SubjectName: teacher?.Subject?.SubjectName,
        TotalFee: !!course
          ? course?.Price * (1 + profitPercent)
          : teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent),
        LearnType: bookingInfor?.LearnType,
        Address: bookingInfor?.LearnType === 2
          ? bookingInfor?.Address
          : undefined,
        Times: selectedTimes?.map(i =>
          `Ngày ${dayjs(i?.StartTime).format("DD/MM/YYYY")} ${dayjs(i?.StartTime).format("HH:mm")} - ${dayjs(i?.EndTime).format("HH:mm")}`
        ),
        Schedules: selectedTimes?.map(i => ({
          StartTime: dayjs(i?.StartTime),
          EndTime: dayjs(i?.EndTime),
        }))
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      onCancel()
      navigate(`${Router.LICH_SU_BOOKING}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Xác nhận thông tin booking"
      width="50vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            loading={loading}
            onClick={() => sendRequestBooking()}
          >
            Xác nhận
          </ButtonCustom>
        </Space>
      }
    >
      <p className="center-text fs-20 fw-600 mb-16">Chúng tôi xin phép được xác nhận lại thông tin booking của bạn</p>
      <div className="d-flex-center">
        <Row style={{ width: "50%" }} gutter={[16, 0]}>
          <Col span={24}>
          </Col>
          <Col span={10}>
            <p>Giáo viên:</p>
          </Col>
          <Col span={14}>
            <p>{teacher?.Teacher?.FullName}</p>
          </Col>
          <Col span={10}>
            <p>Môn học:</p>
          </Col>
          <Col span={14}>
            <p>{teacher?.Subject?.SubjectName}</p>
          </Col>
          <Col span={10}>
            <p>Hình thức học:</p>
          </Col>
          <Col span={14}>
            <p>
              {
                getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.find(item =>
                  item?.ParentID === bookingInfor?.LearnType)?.ParentName
              }
            </p>
          </Col>
          <Col span={10}>
            <p>Lịch học:</p>
          </Col>
          <Col span={14}>
            {
              selectedTimes?.map((i, idx) =>
                <div key={idx} className="mb-4">
                  <span className="mr-2">Ngày</span>
                  <span className="mr-4">{dayjs(i?.StartTime).format("DD/MM/YYYY")}:</span>
                  <span className="mr-2">{dayjs(i?.StartTime).format("HH:mm")}</span>
                  <span className="mr-2">-</span>
                  <span>{dayjs(i?.EndTime).format("HH:mm")}</span>
                </div>
              )
            }
          </Col>
          <Col span={10}>
            <p>Số tiền thanh toán:</p>
          </Col>
          <Col span={14}>
            <p className="primary-text fw-700 fs-16">{formatMoney(teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent))} VNĐ</p>
          </Col>
          <Col span={24}>
            <span className="red-text mr-6">LƯU Ý:</span>
            <span>Khi giáo viên đã ghi nhận booking của bạn và xử lý booking bạn sẽ không được chỉnh sửa hoặc hủy booking của mình nữa. </span>
          </Col>
        </Row>
      </div>
    </ModalCustom>
  )
}

export default ModalConfirmInfor