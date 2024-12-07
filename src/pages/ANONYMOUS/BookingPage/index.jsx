import { Col, DatePicker, Empty, message, Radio, Row, Space, Tooltip } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SpinCustom from "src/components/SpinCustom"
import UserService from "src/services/UserService"
import { MainProfileWrapper } from "../TeacherDetail/styled"
import dayjs from "dayjs"
import { SYSTEM_KEY } from "src/lib/constant"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { formatMoney } from "src/lib/stringUtils"
import TimeTableService from "src/services/TimeTableService"
import { toast } from "react-toastify"
import { disabledBeforeDate } from "src/lib/dateUtils"
import ModalConfirmInfor from "./components/ModalConfirmInfor"
import ListIcons from "src/components/ListIcons"
import TimeItem from "./components/TimeItem"
import ModalChangeSchedule from "./components/ModalChangeSchedule"
import ModalChooseCourse from "./components/ModalChooseCourse"

const scheduleTypes = [
  {
    value: 1,
    title: "Tự lựa chọn thời gian"
  },
  {
    value: 2,
    title: "Khoảng thời gian cố định"
  }
]

const BookingPage = () => {

  const { TeacherID, SubjectID } = useParams()
  const { listSystemKey, user, profitPercent } = useSelector(globalSelector)
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [teacher, setTeacher] = useState()
  const [selectedTimes, setSelectedTimes] = useState([])
  const [bookingInfor, setBookingInfor] = useState()
  const [times, setTimes] = useState([])
  const [timeTablesTeacher, setTimeTablesTeacher] = useState([])
  const [timeTablesStudent, setTimeTablesStudent] = useState([])
  const [openModalConfirmInfor, setOpenModalConfirmInfor] = useState(false)
  const [totalSlot, setTotalSlot] = useState(0)
  const [slotInWeek, setSlotInWeek] = useState(0)
  const [scheduleInWeek, setScheduleInWeek] = useState([])
  const [scheduleType, setScheduleType] = useState(0)
  const [course, setCourse] = useState()
  const [openModalChangeSchedule, setOpenModalChangeSchedule] = useState(false)
  const [openModalChooseCourse, setOpenModalChooseCourse] = useState(false)

  const getDetailTeacher = async () => {
    try {
      setLoading(true)
      const res = await UserService.getDetailTeacher({ TeacherID, SubjectID, IsBookingPage: true })
      if (!!res?.isError) return navigate("/not-found")
      setTeacher(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const getTimeTable = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.getTimeTableByUser()
      if (!!res?.isError) return toast.error(res?.msg)
      setTimeTablesStudent(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  const getTimeTableOfTeacher = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.getTimeTableOfTeacherOrStudent({
        UserID: TeacherID,
        IsBookingPage: true
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setTimeTablesTeacher(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectedTimes = (date) => {
    const checkExistDate = selectedTimes?.find(i =>
      dayjs(i?.StartTime).format("DD/MM/YYYY") ===
      dayjs(date?.StartTime).format("DD/MM/YYYY")
    )
    if (!!checkExistDate) {
      const copySelectedTimes = [...selectedTimes]
      const indexExsitTime = selectedTimes?.findIndex(i =>
        dayjs(i?.StartTime).format("DD/MM/YYYY HH:mm") ===
        dayjs(date?.StartTime).format("DD/MM/YYYY HH:mm")
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

  const handleSetScheduleInWeek = (idxScheduleInWeek, i, date) => {
    const copyScheduleInWeek = [...scheduleInWeek]
    const indexExistTime = scheduleInWeek?.findIndex(i =>
      dayjs(i?.StartTime).format("DD/MM/YYYY HH:mm") ===
      dayjs(date?.StartTime).format("DD/MM/YYYY HH:mm")
    )
    if (indexExistTime >= 0) {
      copyScheduleInWeek.splice(idxScheduleInWeek, 1, {
        ...i,
        StartTime: "",
        EndTime: ""
      })
      setScheduleInWeek(copyScheduleInWeek)
    } else {
      copyScheduleInWeek.splice(idxScheduleInWeek, 1, {
        ...i,
        StartTime: dayjs(date?.StartTime),
        EndTime: dayjs(date?.EndTime)
      })
      setScheduleInWeek(copyScheduleInWeek)
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

  const hanleSelectTimesWithFixedSchedule = () => {
    let selectTimesRaw = []
    for (let i = 0; selectTimesRaw.length < totalSlot; i++) {
      scheduleInWeek.forEach(s => {
        if (selectTimesRaw.length < totalSlot) {
          selectTimesRaw.push({
            StartTime: dayjs(s?.StartTime).add(i * 7, "days"),
            EndTime: dayjs(s?.EndTime).add(i * 7, "days")
          })
        }
      })
    }
    setSelectedTimes(selectTimesRaw)
  }

  useEffect(() => {
    getTimeTable()
    setBookingInfor(pre => ({
      ...pre,
      Address: !!user?.Address ? user?.Address : ""
    }))
  }, [])

  useEffect(() => {
    if (!location.state._id) {
      getDetailTeacher()
    } else {
      setTeacher(location.state)
    }
  }, [TeacherID, SubjectID, location.state])

  useEffect(() => {
    if (!!teacher) getTimeTableOfTeacher()
  }, [teacher])


  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[20]} className="pt-20">
        <Col span={17}>
          <MainProfileWrapper className="p-24">
            <div className="mb-12 color-tooltip">
              <div className="fw-600 mb-8 d-flex align-items-center">
                <span className="mr-4">Bước 1:</span>
                <span className="mr-8">Lựa chọn số lượng buổi học</span>
                <Tooltip
                  title="Bạn hãy chọn số buổi học hoặc khóa học dài hạn để đến bước tiếp theo"
                  className="color-tooltip"
                >
                  <span className="mt-4 fs-16 cursor-pointer">{ListIcons.ICON_QUESTION}</span>
                </Tooltip>
              </div>
              <Space>
                {
                  [1, 4, 10, 14].map(i =>
                    <ButtonCustom
                      key={i}
                      className={`${i === totalSlot ? "primary" : "third"} mini-size`}
                      onClick={() => {
                        if (i !== totalSlot) {
                          setTotalSlot(i)
                        } else {
                          setTotalSlot(0)
                        }
                        setScheduleType(0)
                        setScheduleInWeek([])
                        setSelectedTimes([])
                        setCourse()
                      }}
                    >
                      {i} buổi
                    </ButtonCustom>
                  )
                }
                <ButtonCustom
                  className="third mini-size"
                  onClick={() => {
                    setOpenModalChooseCourse({ TeacherID, SubjectID })
                    setTotalSlot(0)
                    setScheduleType(0)
                  }}
                >
                  Khóa học dài hạn
                </ButtonCustom>
              </Space>
            </div>
            {
              (!!totalSlot && totalSlot !== 1 && !course) &&
              <div className="mb-16">
                <div className="fw-600 mb-12 d-flex align-items-center">
                  <span className="mr-4">Bước 2:</span>
                  <span className="mr-8">Lựa chọn hình thức xếp lịch học</span>
                  <Tooltip
                    title="Bạn hãy chọn hình thức xếp lịch học để đến bước tiếp theo"
                  >
                    <span className="mt-4 fs-16 cursor-pointer">{ListIcons.ICON_QUESTION}</span>
                  </Tooltip>
                </div>
                <Space>
                  {
                    scheduleTypes?.map((i, idx) =>
                      <ButtonCustom
                        key={idx}
                        className={`${i.value === scheduleType ? "primary" : "third"} mini-size`}
                        onClick={() => {
                          if (i?.value !== scheduleType) {
                            setScheduleType(i?.value)
                          } else {
                            setScheduleType(0)
                          }
                          setSlotInWeek(0)
                          setScheduleInWeek([])
                          setSelectedTimes([])
                        }}
                      >
                        {i.title}
                      </ButtonCustom>
                    )
                  }
                </Space>
              </div>
            }
            {
              (scheduleType === 1 || totalSlot === 1) &&
              <Row gutter={[16]}>
                <Col span={12}>
                  <div className="fw-600 mb-12 d-flex align-items-center">
                    <span className="mr-4">Bước 3:</span>
                    <span className="mr-8">Chọn ngày học</span>
                  </div>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    allowClear={false}
                    disabledDate={current => disabledBeforeDate(current)}
                    onChange={e => {
                      if (selectedTimes.length === totalSlot) {
                        message.warning("Số lượng slot đã đủ")
                      } else {
                        setTimes(getFreeTimeOfTeacher(e))
                      }
                    }}
                  />
                </Col>
                <Col span={12}>
                  <div className="fw-600 mb-12 d-flex align-items-center">
                    <span className="mr-4">Bước 4:</span>
                    <span className="mr-8">Chọn khung giờ</span>
                  </div>
                  <Row gutter={[16, 8]}>
                    {
                      !!times.length ?
                        times?.map((i, idx) =>
                          <Col span={12} key={idx}>
                            <TimeItem
                              timeItem={i}
                              selectedTimes={selectedTimes}
                              timeTablesStudent={timeTablesStudent}
                              handleSelectedTimes={handleSelectedTimes}
                              isFixedSchedule={false}
                            />
                          </Col>
                        )
                        : <Empty description="Không có thời gian học" />
                    }
                  </Row>
                </Col>
              </Row>
            }
            {
              !!course &&
              <div className="mb-12">
                <p className="fw-600 mb-8">Thông tin khóa học</p>
                <div className="d-flex align-items-center mb-4">
                  <span className="mr-4">Tiêu đề khóa học:</span>
                  <span>{course?.Title}</span>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <span className="mr-4">Số buổi học:</span>
                  <span>{course?.QuantitySlot}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="mr-4">Giá tiền:</span>
                  <span>{formatMoney(course?.Price)} VNĐ</span>
                </div>
              </div>
            }
            {
              (scheduleType === 2 || !!course) &&
              <div>
                <InputCustom
                  type="isNumber"
                  placeholder="Bạn muốn học bao nhiêu buổi 1 tuần?"
                  style={{
                    width: "350px",
                    marginBottom: "12px"
                  }}
                  value={!!slotInWeek ? slotInWeek : ""}
                  min={1}
                  max={7}
                  onChange={e => {
                    if (e > totalSlot) {
                      return message.error("Số buổi 1 tuần lớn hơn tổng số buổi")
                    }
                    setSlotInWeek(e)
                    const newArray = Array.from({ length: e }, (_, index) => ({
                      id: index + 1,
                      DateAt: "",
                      StartTime: "",
                      EndTime: "",
                      Times: []
                    }))
                    setScheduleInWeek(newArray)
                    setSelectedTimes([])
                  }}
                />
                {
                  !!slotInWeek &&
                  scheduleInWeek.map((i, idxScheduleInWeek) =>
                    <Row className="mb-12" key={idxScheduleInWeek}>
                      <Col span={12}>
                        <DatePicker
                          placeholder="Bạn muốn bắt đầu học vào thời điểm nào?"
                          format="DD/MM/YYYY"
                          style={{
                            width: "350px",
                          }}
                          value={i?.DateAt}
                          disabledDate={current =>
                            disabledBeforeDate(current) ||
                            scheduleInWeek.some(i => dayjs(i.DateAt).isSame(current, "day"))
                          }
                          onChange={e => {
                            const copyScheduleInWeek = [...scheduleInWeek]
                            copyScheduleInWeek.splice(idxScheduleInWeek, 1, {
                              ...i,
                              DateAt: e,
                              Times: getFreeTimeOfTeacher(e, true)
                            })
                            setScheduleInWeek(copyScheduleInWeek)
                          }}
                        />
                      </Col>
                      <Col span={12}>
                        <Row gutter={[16, 8]}>
                          {!!i?.DateAt &&
                            (
                              !!i?.Times.length ?
                                i?.Times?.map((item, idx) =>
                                  <Col span={12} key={idx}>
                                    <TimeItem
                                      timeItem={item}
                                      selectedTimes={selectedTimes}
                                      scheduleInWeek={scheduleInWeek}
                                      timeTablesStudent={timeTablesStudent}
                                      handleSelectedTimes={handleSelectedTimes}
                                      handleSetScheduleInWeek={() => handleSetScheduleInWeek(idxScheduleInWeek, i, item)}
                                      isFixedSchedule={true}
                                    />
                                  </Col>
                                )
                                : <Empty description="Không có thời gian học" />
                            )}
                        </Row>
                      </Col>
                    </Row>
                  )
                }
                {
                  (!!scheduleInWeek.length && scheduleInWeek.every(i => !!i?.DateAt && !!i?.StartTime && !!i?.EndTime)) &&
                  <ButtonCustom
                    className="primary"
                    onClick={() => hanleSelectTimesWithFixedSchedule()}
                  >
                    Xác nhận
                  </ButtonCustom>
                }
              </div>
            }
          </MainProfileWrapper>
        </Col >
        <Col span={7}>
          <MainProfileWrapper className="p-24">
            <div className="fs-16 fw-600 mb-16">Thông tin đặt lịch</div>
            <div className="teacher-infor d-flex mb-12">
              <img
                src={teacher?.Teacher?.AvatarPath}
                alt=""
                style={{
                  width: '70px',
                  height: "70px",
                  borderRadius: '50%',
                  marginRight: "12px"
                }}
              />
              <div>
                <p className="fs-16 fw-600">{teacher?.Teacher?.FullName}</p>
                <p>{teacher?.Subject?.SubjectName}</p>
                <div className="mt-12">
                  <span className="gray-text mr-4">Học phí/buổi: </span>
                  <span className="primary-text fw-700 fs-15">{formatMoney(teacher?.Price)} VNĐ</span>
                </div>
              </div>
            </div>
            <div className="learn-type mb-12">
              <div className="fw-600 fw-16 mb-8">Lựa chọn hình thức học:</div>
              <Radio.Group
                className="mb-8"
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
            </div>
            {
              bookingInfor?.LearnType === 2 &&
              <div className="address mb-12">
                <InputCustom
                  placeholder="Nhập vào địa chỉ"
                  value={bookingInfor?.Address}
                  onChange={e => setBookingInfor(pre => ({ ...pre, Address: e.target.value }))}
                />
              </div>
            }
            {
              !!selectedTimes?.length &&
              <div className="times mb-16">
                <div className="fw-600 fw-16 mb-8">Lịch học:</div>
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
                <ButtonCustom
                  className="primary mini-size mt-8"
                  onClick={() => {
                    const copySelectTimes = selectedTimes.map(i => ({
                      ...i,
                      DateAt: i?.StartTime,
                      Times: getFreeTimeOfTeacher(i?.StartTime)
                    }))
                    setSelectedTimes(copySelectTimes)
                    setOpenModalChangeSchedule(true)
                  }}
                >
                  Chỉnh sửa lịch học
                </ButtonCustom>
              </div>
            }
            {
              !!selectedTimes?.length &&
              <div className="mb-16">
                <span className="fw-600 fw-16 mr-4">Tổng giá:</span>
                <span className="fs-17 fw-600 primary-text">
                  {
                    !!course
                      ? formatMoney(course?.Price)
                      : formatMoney(+teacher?.Price * selectedTimes.length)
                  } VNĐ
                </span>
              </div>
            }

            {
              !!selectedTimes?.length &&
              (
                (bookingInfor?.LearnType === 2 && !!bookingInfor?.Address) ||
                (bookingInfor?.LearnType === 1)
              ) &&
              <ButtonCustom
                className="primary submit-btn"
                loading={loading}
                onClick={() => {
                  if (selectedTimes.length < totalSlot) {
                    return message.error("Chưa chọn đủ số buổi học")
                  }
                  setOpenModalConfirmInfor(true)
                }}
              >
                Xác nhận
              </ButtonCustom>
            }
          </MainProfileWrapper>
        </Col>
      </Row >

      {
        !!openModalConfirmInfor &&
        <ModalConfirmInfor
          open={openModalConfirmInfor}
          onCancel={() => setOpenModalConfirmInfor(false)}
          teacher={teacher}
          bookingInfor={bookingInfor}
          selectedTimes={selectedTimes}
          course={course}
          timeTablesStudent={timeTablesStudent}
          timeTablesTeacher={timeTablesTeacher}
        />
      }

      {
        !!openModalChangeSchedule &&
        <ModalChangeSchedule
          open={openModalChangeSchedule}
          onCancel={() => setOpenModalChangeSchedule(false)}
          selectedTimes={selectedTimes}
          timeTablesStudent={timeTablesStudent}
          getFreeTimeOfTeacher={getFreeTimeOfTeacher}
          setSelectedTimes={setSelectedTimes}
        />
      }

      {
        !!openModalChooseCourse &&
        <ModalChooseCourse
          open={openModalChooseCourse}
          onCancel={() => setOpenModalChooseCourse(false)}
          course={course}
          setCourse={setCourse}
          setTotalSlot={setTotalSlot}
          setSlotInWeek={setSlotInWeek}
          setScheduleInWeek={setScheduleInWeek}
        />
      }
    </SpinCustom >
  )
}

export default BookingPage