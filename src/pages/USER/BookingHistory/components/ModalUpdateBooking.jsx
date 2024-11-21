import { Col, Radio, Row, Space } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import UserService from "src/services/UserService"
import dayjs from "dayjs"
import { formatMoney } from "src/lib/stringUtils"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import ListIcons from "src/components/ListIcons"
import TimeTableService from "src/services/TimeTableService"
import { toast } from "react-toastify"
import ConfirmService from "src/services/ConfirmService"
import ModalChangeSchedule from "src/pages/ANONYMOUS/BookingPage/components/ModalChangeSchedule"
import socket from "src/utils/socket"

const ModalUpdateBooking = ({ open, onCancel, onOk, setOpenModalUpdateBooking }) => {

  const navigate = useNavigate()
  const { listSystemKey, profitPercent } = useSelector(globalSelector)
  const [teacher, setTeacher] = useState()
  const [loading, setLoading] = useState(false)
  const [selectedTimes, setSelectedTimes] = useState([])
  const [bookingInfor, setBookingInfor] = useState()
  const [isEditLearnType, setIsEditLearnType] = useState(false)
  const [isEditSchedules, setIsEditSchedules] = useState(false)
  const [timeTablesTeacher, SetTimeTablesTeacher] = useState([])
  const [timeTablesStudent, SetTimeTablesStudent] = useState([])

  const getDetailTeacher = async () => {
    try {
      const res = await UserService.getDetailTeacher({
        TeacherID: open?.Receiver?._id,
        SubjectID: open?.Subject?._id,
        IsBookingPage: true
      })
      if (!!res?.isError) return navigate("/not-found")
      setTeacher(res?.data)
    } finally {
      console.log();
    }
  }

  const getTimeTableOfStudent = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.getTimeTableByUser()
      if (!!res?.isError) return toast.error(res?.msg)
      SetTimeTablesStudent(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }


  const getTimeTableOfTeacher = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.getTimeTableOfTeacherOrStudent(open?.Receiver?._id)
      if (!!res?.isError) return toast.error(res?.msg)
      SetTimeTablesTeacher(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const getFreeTimeOfTeacher = (e) => {
    const daysFromTimeTable = !!timeTablesTeacher?.length
      ? timeTablesTeacher
        ?.filter(i => dayjs(i?.StartTime).format("DD/MM/YYYY") === dayjs(e).format("DD/MM/YYYY"))
        ?.map(item => dayjs(item?.StartTime).format("HH:mm"))
      : []
    const times = !!daysFromTimeTable?.length
      ? teacher?.Teacher?.Schedules?.filter(i =>
        i?.DateAt === dayjs(e).format("dddd") &&
        !daysFromTimeTable?.includes(dayjs(i?.StartTime).format("HH:mm"))
      )
      : teacher?.Teacher?.Schedules?.filter(i =>
        i?.DateAt === dayjs(e).format("dddd")
      )
    const timesResult = times?.map(i => {
      const dayGap = dayjs(e).startOf("day").diff(dayjs(i?.StartTime).startOf("day"), "days")
      return {
        StartTime: dayjs(i?.StartTime).add(dayGap, "days"),
        EndTime: dayjs(i?.EndTime).add(dayGap, "days"),
      }
    })
    return timesResult
  }

  const updateConfirm = async () => {
    try {
      setLoading(true)
      const res = await ConfirmService.updateConfirm({
        ConfirmID: open?._id,
        Sender: open?.Sender,
        Receiver: open?.Receiver?._id,
        Subject: open?.Subject?.SubjectName,
        TotalFee: teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent),
        LearnType: bookingInfor?.LearnType,
        Address: bookingInfor?.Address,
        Schedules: selectedTimes?.map(i => ({
          DateAt: dayjs(i?.StartTime),
          StartTime: dayjs(i?.StartTime),
          EndTime: dayjs(i?.EndTime),
        }))
      })
      if (!!res?.isError) return toast.error(res?.msg)
      onOk()
      toast.success(res?.msg)
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!open?._id) {
      setBookingInfor({
        LearnType: open?.LearnType,
        Address: open?.Address
      })
      setSelectedTimes(open?.Schedules)
      getDetailTeacher()
      getTimeTableOfStudent()
      getTimeTableOfTeacher()
    }
  }, [open])

  useEffect(() => {
    socket.on("listen-noted-confirm", data => {
      setOpenModalUpdateBooking(data)
    })
  }, [])

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chỉnh sửa booking"
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
            className="primary"
            loading={loading}
            disabled={open?.ConfirmStatus === 4 ? true : false}
            onClick={() => updateConfirm()}
          >
            Lưu
          </ButtonCustom>
        </Space>
      }
    >
      <Row gutter={[8, 0]} className="d-flex align-items-center">
        <Col span={4}>
          <p>Giáo viên:</p>
        </Col>
        <Col span={20}>
          <p>{open?.Receiver?.FullName}</p>
        </Col>
        <Col span={4}>
          <p>Môn học:</p>
        </Col>
        <Col span={20}>
          <p>{open?.Subject?.SubjectName}</p>
        </Col>
        <Col span={4}>
          <p>Hình thức học:</p>
        </Col>
        <Col span={20}>
          {
            !isEditLearnType ?
              <div className="d-flex align-items-center">
                <span className="mr-4">
                  {
                    getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.find(item =>
                      item?.ParentID === bookingInfor?.LearnType)?.ParentName
                  }
                </span>
                <span
                  className={`mt-4 ${open?.ConfirmStatus !== 4 ? "cursor-pointer" : "cursor-disabled"}`}
                  onClick={() => {
                    if (open?.ConfirmStatus !== 4) {
                      setIsEditLearnType(true)
                    }
                  }}
                >
                  {ListIcons.ICON_EDIT}
                </span>
              </div>
              :
              <div className="d-flex align-items-center">
                <Radio.Group
                  className="mb-8"
                  disabled={open?.ConfirmStatus === 4 ? true : false}
                  value={bookingInfor?.LearnType}
                  onChange={e => setBookingInfor(pre => ({ ...pre, LearnType: e.target.value }))}
                >
                  {
                    teacher?.LearnTypes?.map(i =>
                      <Radio key={i} value={i}>
                        {
                          getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.find(item =>
                            item?.ParentID === i)?.ParentName
                        }
                      </Radio>
                    )
                  }
                </Radio.Group>
                <span
                  className={`${open?.ConfirmStatus !== 4 ? "cursor-pointer" : "cursor-disabled"}`}
                  onClick={() => {
                    if (open?.ConfirmStatus !== 4) {
                      setIsEditLearnType(true)
                    }
                  }}
                >
                  {ListIcons.ICON_CONFIRM}
                </span>
              </div>
          }

        </Col>
        {
          bookingInfor?.LearnType === 2 &&
          <>
            <Col span={4}>
              <p>Địa chỉ:</p>
            </Col>
            <Col span={20}>
              <InputCustom
                placeholder="Nhập vào địa chỉ"
                disabled={open?.ConfirmStatus === 4 ? true : false}
                value={bookingInfor?.Address}
                onChange={e => setBookingInfor(pre => ({ ...pre, Address: e.target.value }))}
              />
            </Col>
          </>
        }
        <Col span={4}>
          <p>Lịch học:</p>
        </Col>
        <Col span={20}>
          {
            selectedTimes?.map((i, idx) =>
              <div key={idx} className="mb-4">
                <span className="mr-2">Ngày</span>
                <span className="mr-4">{dayjs(i?.StartTime).format("DD/MM/YYYY")}:</span>
                <span className="mr-2">{dayjs(i?.StartTime).format("HH:ss")}</span>
                <span className="mr-2">-</span>
                <span>{dayjs(i?.EndTime).format("HH:ss")}</span>
              </div>
            )
          }
          <span
            className={`${open?.ConfirmStatus !== 4 ? "cursor-pointer" : "cursor-disabled"}`}
            onClick={() => {
              const copySelectTimes = selectedTimes.map(i => ({
                ...i,
                DateAt: dayjs(i?.StartTime),
                Times: getFreeTimeOfTeacher(dayjs(i?.StartTime))
              }))
              setSelectedTimes(copySelectTimes)
              setIsEditSchedules(true)
            }}
          >
            {ListIcons.ICON_EDIT}
          </span>
        </Col>
        <Col span={24} className="d-flex align-items-center">
          <span className="fw-600 fw-16 mr-4">Tổng giá:</span>
          <span className="fs-17 fw-700 primary-text">
            {
              !!isEditSchedules
                ? formatMoney(+teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent))
                : formatMoney(open?.TotalFee)
            } VNĐ
          </span>
        </Col>
      </Row>

      {
        !!isEditSchedules &&
        <ModalChangeSchedule
          open={isEditSchedules}
          onCancel={() => setIsEditSchedules(false)}
          selectedTimes={selectedTimes}
          timeTablesStudent={timeTablesStudent}
          getFreeTimeOfTeacher={getFreeTimeOfTeacher}
          setSelectedTimes={setSelectedTimes}
        />
      }

    </ModalCustom >
  )
}

export default ModalUpdateBooking