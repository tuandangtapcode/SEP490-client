import { Col, DatePicker, Empty, Radio, Row, Space } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import SpinCustom from "src/components/SpinCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import UserService from "src/services/UserService"
import dayjs from "dayjs"
import { formatMoney } from "src/lib/stringUtils"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { disabledBeforeDate } from "src/lib/dateUtils"
import ListIcons from "src/components/ListIcons"
import TimeTableService from "src/services/TimeTableService"
import { toast } from "react-toastify"
import { TimeItemStyled } from "src/pages/ANONYMOUS/BookingPage/styled"
import ConfirmService from "src/services/ConfirmService"

const ModalUpdateBooking = ({ open, onCancel, onOk }) => {

  const navigate = useNavigate()
  const { listSystemKey, profitPercent } = useSelector(globalSelector)
  const [teacher, setTeacher] = useState()
  const [loading, setLoading] = useState(false)
  const [selectedTimes, setSelectedTimes] = useState([])
  const [bookingInfor, setBookingInfor] = useState()
  const [isEditLearnType, setIsEditLearnType] = useState(false)
  const [isEditSchedules, setIsEditSchedules] = useState(false)
  const [timeTables, SetTimeTables] = useState([])
  const [times, setTimes] = useState([])

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

  const getTimeTable = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.getTimeTableByUser()
      if (!!res?.isError) return toast.error(res?.msg)
      SetTimeTables(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectedTimes = (date) => {
    const checkExistTime = selectedTimes?.find(i =>
      dayjs(i?.StartTime).format("DD/MM/YYYY") ===
      dayjs(date?.StartTime).format("DD/MM/YYYY")
    )
    if (!!checkExistTime) {
      const copySelectedTimes = [...selectedTimes]
      const indexExsitTime = selectedTimes?.findIndex(i =>
        dayjs(i?.StartTime).format("DD/MM/YYYY HH:ss") ===
        dayjs(date?.StartTime).format("DD/MM/YYYY HH:ss")
      )
      if (indexExsitTime >= 0) {
        copySelectedTimes.splice(indexExsitTime, 1)
      } else if (indexExsitTime < 0) {
        const index = selectedTimes?.findIndex(i =>
          dayjs(i?.StartTime).format("DD/MM/YYYY") ===
          dayjs(date?.StartTime).format("DD/MM/YYYY")
        )
        copySelectedTimes.splice(index, 1, {
          StartTime: dayjs(date?.StartTime),
          EndTime: dayjs(date?.EndTime),
        })
      }
      setSelectedTimes(copySelectedTimes)
    } else {
      setSelectedTimes(pre => [
        ...pre,
        {
          StartTime: dayjs(date?.StartTime),
          EndTime: dayjs(date?.EndTime),
        }
      ])
    }
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
      getTimeTable()
    }
  }, [open])


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
                  className="mt-4 cursor-pointer"
                  onClick={() => setIsEditLearnType(true)}
                >
                  {ListIcons.ICON_EDIT}
                </span>
              </div>
              :
              <div className="d-flex align-items-center">
                <Radio.Group
                  className="mb-8"
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
                  className="cursor-pointer"
                  onClick={() => setIsEditLearnType(false)}
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
          {
            !isEditSchedules ?
              <span
                className="cursor-pointer"
                onClick={() => setIsEditSchedules(true)}
              >
                {ListIcons.ICON_EDIT}
              </span>
              :
              <span
                className="cursor-pointer"
                onClick={() => setIsEditSchedules(false)}
              >
                {ListIcons.ICON_CONFIRM}
              </span>
          }
        </Col>
        {
          !!isEditSchedules &&
          <>
            <Col span={12}>
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={current => disabledBeforeDate(current)}
                onChange={e => {
                  const daysFromTimeTable = !!timeTables?.length
                    ? timeTables
                      ?.filter(i =>
                        dayjs(i?.DateAt).format("DD/MM/YYYY") === dayjs(e).format("DD/MM/YYYY") &&
                        i?.Teacher?._id === open?.Receiver?._id)
                      ?.map(item => dayjs(item?.StartTime).format("HH:ss"))
                    : []
                  const times = !!daysFromTimeTable?.length
                    ? teacher?.Teacher?.Schedules?.filter(i =>
                      i?.DateAt === dayjs(e).format("dddd") &&
                      !daysFromTimeTable?.includes(dayjs(i?.StartTime).format("HH:ss"))
                    )
                    : teacher?.Teacher?.Schedules?.filter(i =>
                      i?.DateAt === dayjs(e).format("dddd")
                    )
                  setTimes(
                    times?.map(i => {
                      const dayGap = dayjs(e).startOf("day").diff(dayjs(i?.StartTime).startOf("day"), "days")
                      return {
                        StartTime: dayjs(i?.StartTime).add(dayGap, "days"),
                        EndTime: dayjs(i?.EndTime).add(dayGap, "days"),
                      }
                    })
                  )
                }}
              />
            </Col>
            <Col span={12}>
              <Row gutter={[16, 8]}>
                {
                  !!times.length ?
                    times?.map((i, idx) =>
                      <Col span={12} key={idx}>
                        <TimeItemStyled
                          className={
                            !!selectedTimes?.some(item =>
                              dayjs(item?.StartTime).format("DD/MM/YYYY HH:ss") ===
                              dayjs(i?.StartTime).format("DD/MM/YYYY HH:ss"))
                              ? "active"
                              : ""
                          }
                          onClick={() => handleSelectedTimes(i)}
                        >
                          {dayjs(i?.StartTime).format("HH:mm")} - {dayjs(i?.EndTime).format("HH:mm")}
                        </TimeItemStyled>
                      </Col>
                    )
                    : <Empty description="Không có thời gian học học" />
                }
              </Row>
            </Col>
          </>
        }
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
    </ModalCustom >
  )
}

export default ModalUpdateBooking