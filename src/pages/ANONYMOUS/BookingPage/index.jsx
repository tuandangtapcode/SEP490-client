import { Col, DatePicker, Empty, Radio, Row } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SpinCustom from "src/components/SpinCustom"
import UserService from "src/services/UserService"
import { MainProfileWrapper } from "../TeacherDetail/styled"
import { TimeItemStyled } from "./styled"
import dayjs from "dayjs"
import { SYSTEM_KEY } from "src/lib/constant"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { generateSignature, getListComboKey, getRealFee, randomNumber } from "src/lib/commonFunction"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { formatMoney } from "src/lib/stringUtils"
import PaymentService from "src/services/PaymentService"
import ModalSuccessBooking from "./components/ModalSuccessBooking"
import TimeTableService from "src/services/TimeTableService"
import LearnHistoryService from "src/services/LearnHistoryService"
import ModalPaymentBooking from "./components/ModalPaymentBooking"
import { toast } from "react-toastify"
import Notice from "src/components/Notice"

const RootURLWebsite = import.meta.env.VITE_ROOT_URL_WEBSITE

const BookingPage = () => {

  const { TeacherID, SubjectID } = useParams()
  const { listSystemKey, user } = useSelector(globalSelector)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teacher, setTeacher] = useState()
  const [subject, setSubject] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [selectedTimes, setSelectedTimes] = useState([])
  const [bookingInfor, setBookingInfor] = useState()
  const [times, setTimes] = useState([])
  const [timeTables, SetTimeTables] = useState([])
  const location = useLocation()
  const [openModalSuccessBooking, setOpenModalSuccessBooking] = useState(false)
  const [openModalPaymentBooking, setOpenModalPaymentBooking] = useState(false)

  const getDetailTeacher = async () => {
    try {
      setLoading(true)
      const res = await UserService.getDetailTeacher({ TeacherID, SubjectID })
      if (res?.isError) return navigate("/not-found")
      setTeacher(res?.data)
      setSubject(
        res?.data?.Subjects?.find(i => i?._id === SubjectID)
      )
    } finally {
      setLoading(false)
    }
  }

  const getTimeTable = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.getTimeTableByUser()
      if (res?.isError) return
      SetTimeTables(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectedTimes = (date) => {
    const dayGap = dayjs(selectedDate).startOf("day").diff(dayjs(date?.StartTime).startOf("day"), "days")
    const checkExistTime = selectedTimes?.find(i =>
      dayjs(i?.StartTime).format("DD/MM/YYYY") ===
      dayjs(date?.StartTime).add(dayGap, "days").format("DD/MM/YYYY")
    )
    if (!!checkExistTime) {
      const copySelectedTimes = [...selectedTimes]
      const indexExsitTime = selectedTimes?.findIndex(i =>
        dayjs(i?.StartTime).format("DD/MM/YYYY HH:ss") ===
        dayjs(date?.StartTime).add(dayGap, "days").format("DD/MM/YYYY HH:ss")
      )
      if (indexExsitTime >= 0) {
        copySelectedTimes.splice(indexExsitTime, 1)
      } else if (indexExsitTime < 0) {
        const index = selectedTimes?.findIndex(i =>
          dayjs(i?.StartTime).format("DD/MM/YYYY") ===
          dayjs(date?.StartTime).add(dayGap, "days").format("DD/MM/YYYY")
        )
        copySelectedTimes.splice(index, 1, {
          StartTime: dayjs(date?.StartTime).add(dayGap, "days"),
          EndTime: dayjs(date?.EndTime).add(dayGap, "days"),
          dayGap: dayGap
        })
      }
      setSelectedTimes(copySelectedTimes)
    } else {
      setSelectedTimes(pre => [
        ...pre,
        {
          StartTime: dayjs(date?.StartTime).add(dayGap, "days"),
          EndTime: dayjs(date?.EndTime).add(dayGap, "days"),
          dayGap: dayGap
        }
      ])
    }
  }

  const createPaymentLink = async () => {
    try {
      setLoading(true)
      if (bookingInfor?.LearnType === 2 && !bookingInfor?.Address) {
        return Notice({
          isSuccess: false,
          msg: "Hãy nhập địa chỉ"
        })
      }
      const body = {
        orderCode: randomNumber(),
        amount: getRealFee(+teacher?.Price * selectedTimes.length * 1000),
        description: "Thanh toán book giáo viên",
        cancelUrl: `${RootURLWebsite}${location.pathname}`,
        returnUrl: `${RootURLWebsite}${location.pathname}`,
      }
      const data = `amount=${body.amount}&cancelUrl=${body.cancelUrl}&description=${body.description}&orderCode=${body.orderCode}&returnUrl=${body.returnUrl}`
      const resPaymemtLink = await PaymentService.createPaymentLink({
        ...body,
        signature: generateSignature(data)
      })
      if (resPaymemtLink?.data?.code !== "00") return toast.error("Có lỗi xảy ra trong quá trình tạo thanh toán")
      setOpenModalPaymentBooking({ ...resPaymemtLink?.data?.data })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteBooking = async () => {
    try {
      setLoading(true)
      const resPayment = await PaymentService.createPayment({
        PaymentType: 1,
        Description: `Thanh toán book giáo viên ${teacher?.FullName}`,
        TotalFee: getRealFee(+teacher?.Price * selectedTimes.length * 1000),
        TraddingCode: randomNumber()
      })
      if (!!resPayment?.isError) return
      const bodyLearnHistory = {
        Teacher: TeacherID,
        Subject: SubjectID,
        TotalLearned: selectedTimes.length,
        TeacherName: teacher?.FullName,
        TeacherEmail: teacher?.Email,
        SubjectName: subject?.SubjectName,
        StudentName: user?.FullName,
        StudentEmail: user?.Email,
        Times: selectedTimes?.map(i =>
          `Ngày ${dayjs(i?.StartTime).format("DD/MM/YYYY")} ${dayjs(i?.StartTime).format("HH:ss")} - ${dayjs(i?.EndTime).format("HH:ss")}`
        )
      }
      const resLearnHistory = await LearnHistoryService.createLearnHistory(bodyLearnHistory)
      if (!!resLearnHistory?.isError) return
      const bodyTimeTable = selectedTimes?.map(i => ({
        LearnHistory: resLearnHistory?.data?._id,
        Teacher: teacher?._id,
        Subject: SubjectID,
        DateAt: dayjs(i?.StartTime),
        StartTime: dayjs(i?.StartTime),
        EndTime: dayjs(i?.EndTime),
        LearnType: bookingInfor?.LearnType,
        Address: !!bookingInfor?.Address && bookingInfor?.LearnType === 2
          ? bookingInfor?.Address
          : undefined,
      }))
      const resTimeTable = await TimeTableService.createTimeTable(bodyTimeTable)
      if (!!resTimeTable?.isError) return
      setOpenModalSuccessBooking({ FullName: teacher?.FullName })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setBookingInfor(pre => ({
      ...pre,
      Address: !!user?.Address ? user?.Address : ""
    }))
  }, [])

  useEffect(() => {
    getDetailTeacher()
  }, [TeacherID, SubjectID])

  useEffect(() => {
    if (!!teacher) getTimeTable()
  }, [teacher])


  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[20]} className="pt-20">
        <Col span={17}>
          <MainProfileWrapper className="p-24">
            <div className="fs-20 fw-600 mb-12">Lựa chọn thời gian học</div>
            <Row gutter={[16]}>
              <Col span={12}>
                <div className="fs-16 fw-600 mb-8">Chọn ngày học</div>
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  disabledDate={current =>
                    current && current <= dayjs().startOf("day")
                  }
                  onChange={e => {
                    const daysFromTimeTable = !!timeTables?.length
                      ? timeTables
                        ?.filter(i => dayjs(i?.DateAt).format("DD/MM/YYYY") === dayjs(e).format("DD/MM/YYYY") &&
                          i?.Teacher?._id === TeacherID)
                        ?.map(item => dayjs(item?.StartTime).format("HH:ss"))
                      : []
                    const times = !!daysFromTimeTable?.length
                      ? teacher?.Schedules?.filter(i =>
                        i?.DateAt === dayjs(e).format("dddd") &&
                        !daysFromTimeTable?.includes(dayjs(i?.StartTime).format("HH:ss"))
                      )
                      : teacher?.Schedules?.filter(i =>
                        i?.DateAt === dayjs(e).format("dddd")
                      )
                    setSelectedDate(dayjs(e).format())
                    setTimes(times)
                  }}
                />
              </Col>
              <Col span={12}>
                <div className="fs-16 fw-600 mb-8">Chọn thời gian học (Khung giờ trống của giáo viên)</div>
                <Row gutter={[16, 8]}>
                  {
                    !!times.length ?
                      times?.map((i, idx) =>
                        <Col span={12} key={idx}>
                          <TimeItemStyled
                            className={
                              !!selectedTimes?.some(item =>
                                dayjs(item?.StartTime).format("DD/MM/YYYY HH:ss") ===
                                dayjs(i?.StartTime).add(item?.dayGap, "days").format("DD/MM/YYYY HH:ss"))
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
            </Row>
          </MainProfileWrapper>
        </Col>
        <Col span={7}>
          <MainProfileWrapper className="p-24">
            <div className="fs-20 fw-600 mb-16">Thông tin đặt lịch</div>
            <div className="teacher-infor d-flex mb-12">
              <img
                src={teacher?.AvatarPath} alt=""
                style={{
                  width: '60px',
                  height: "60px",
                  borderRadius: '50%',
                  marginRight: "12px"
                }}
              />
              <div>{teacher?.FullName}</div>
            </div>
            <div className="subject-infor mb-12">
              <span className="fw-600 fw-16 mr-8">Môn học:</span>
              <spn>{subject?.SubjectName}</spn>
            </div>
            <div className="learn-type">
              <div className="fw-600 fw-16 mb-8">Hình thức học:</div>
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
                      <span className="mr-2">{dayjs(i?.StartTime).format("HH:ss")}</span>
                      <span className="mr-2">-</span>
                      <span>{dayjs(i?.EndTime).format("HH:ss")}</span>
                    </div>
                  )
                }
              </div>
            }
            {
              !!selectedTimes?.length &&
              <div className="mb-16">
                <span className="fw-600 fw-16 mr-4">Tổng giá:</span>
                <span className="fs-17 fw-600">{formatMoney(getRealFee(+teacher?.Price * selectedTimes.length * 1000))} VNĐ</span>
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
                onClick={() => createPaymentLink()}
              >
                Thanh toán
              </ButtonCustom>
            }
          </MainProfileWrapper>
        </Col>

        {
          !!openModalSuccessBooking &&
          <ModalSuccessBooking
            open={openModalSuccessBooking}
            onCancel={() => setOpenModalSuccessBooking(false)}
          />
        }

        {
          !!openModalPaymentBooking &&
          <ModalPaymentBooking
            open={openModalPaymentBooking}
            onCancel={() => setOpenModalPaymentBooking(false)}
            onOk={() => handleCompleteBooking()}
          />
        }

      </Row>

    </SpinCustom>
  )
}

export default BookingPage