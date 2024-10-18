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
import { getListComboKey } from "src/lib/commonFunction"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { formatMoney } from "src/lib/stringUtils"
import TimeTableService from "src/services/TimeTableService"
import { toast } from "react-toastify"
import { disabledBeforeDate } from "src/lib/dateUtils"
import MOdalConfirmInfor from "./components/ModalConfirmInfor"


const BookingPage = () => {

  const { TeacherID, SubjectID } = useParams()
  const { listSystemKey, user, profitPercent } = useSelector(globalSelector)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teacher, setTeacher] = useState()
  const [selectedTimes, setSelectedTimes] = useState([])
  const [bookingInfor, setBookingInfor] = useState()
  const [times, setTimes] = useState([])
  const [timeTables, SetTimeTables] = useState([])
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [openModalConfirmInfor, setOpenModalConfirmInfor] = useState()

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
      SetTimeTables(res?.data?.List)
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

  // const createPaymentLink = async () => {
  //   try {
  //     setLoading(true)
  //     if (bookingInfor?.LearnType === 2 && !bookingInfor?.Address) {
  //       return Notice({
  //         isSuccess: false,
  //         msg: "Hãy nhập địa chỉ"
  //       })
  //     }
  //     if (paymentMethod === "vietqr") {
  //       const body = {
  //         orderCode: randomNumber(),
  //         amount: +teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent),
  //         description: "Thanh toán book giáo viên",
  //         cancelUrl: `${RootURLWebsite}${location.pathname}`,
  //         returnUrl: `${RootURLWebsite}${location.pathname}`,
  //       }
  //       const data = `amount=${body.amount}&cancelUrl=${body.cancelUrl}&description=${body.description}&orderCode=${body.orderCode}&returnUrl=${body.returnUrl}`
  //       const resPaymemtLink = await PaymentService.createPaymentLink({
  //         ...body,
  //         signature: generateSignature(data)
  //       })
  //       if (resPaymemtLink?.data?.code !== "00") return toast.error("Có lỗi xảy ra trong quá trình tạo thanh toán")
  //       window.location.href = resPaymemtLink?.data?.data?.checkoutUrl
  //     } else if (paymentMethod === "vnpay") {
  //       handleCreatePaymentVNPay(
  //         "Thanh toán book giáo viên",
  //         +teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent),
  //         `${RootURLWebsite}${location.pathname}`,
  //         teacher?.ipAddress
  //       )
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const handleCompleteBooking = async () => {
  //   try {
  //     setLoading(true)
  //     const resPayment = await PaymentService.createPayment({
  //       PaymentType: 1,
  //       Description: `Thanh toán book giáo viên ${teacher?.FullName}`,
  //       TotalFee: +teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent),
  //       TraddingCode: randomNumber()
  //     })
  //     if (!!resPayment?.isError) return
  //     const bodyLearnHistory = {
  //       Teacher: TeacherID,
  //       Subject: SubjectID,
  //       TotalLearned: selectedTimes.length,
  //       TeacherName: teacher?.FullName,
  //       TeacherEmail: teacher?.Email,
  //       SubjectName: teacher?.Subject?.SubjectName,
  //       StudentName: user?.FullName,
  //       StudentEmail: user?.Email,
  //       Times: selectedTimes?.map(i =>
  //         `Ngày ${dayjs(i?.StartTime).format("DD/MM/YYYY")} ${dayjs(i?.StartTime).format("HH:ss")} - ${dayjs(i?.EndTime).format("HH:ss")}`
  //       )
  //     }
  //     const resLearnHistory = await LearnHistoryService.createLearnHistory(bodyLearnHistory)
  //     if (!!resLearnHistory?.isError) return
  //     const bodyTimeTable = selectedTimes?.map(i => ({
  //       LearnHistory: resLearnHistory?.data?._id,
  //       Teacher: teacher?._id,
  //       Subject: SubjectID,
  //       DateAt: dayjs(i?.StartTime),
  //       StartTime: dayjs(i?.StartTime),
  //       EndTime: dayjs(i?.EndTime),
  //       LearnType: bookingInfor?.LearnType,
  //       Address: !!bookingInfor?.Address && bookingInfor?.LearnType === 2
  //         ? bookingInfor?.Address
  //         : undefined,
  //     }))
  //     const resTimeTable = await TimeTableService.createTimeTable(bodyTimeTable)
  //     if (!!resTimeTable?.isError) return
  //     setOpenModalSuccessBooking({ FullName: teacher?.FullName })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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

  // useEffect(() => {
  //   if (
  //     ((!!queryParams.get("status") && queryParams.get("status") === "PAID") ||
  //       (!!queryParams.get("vnp_ResponseCode") && queryParams.get("vnp_ResponseCode") === "00")) &&
  //     !!teacher
  //   ) {
  //     handleCompleteBooking()
  //   }
  // }, [location.search, teacher])


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
                  disabledDate={current => disabledBeforeDate(current)}
                  onChange={e => {
                    console.log("dayjs(e)", dayjs(e).format());

                    const daysFromTimeTable = !!timeTables?.length
                      ? timeTables
                        ?.filter(i =>
                          dayjs(i?.DateAt).format("DD/MM/YYYY") === dayjs(e).format("DD/MM/YYYY") &&
                          i?.Teacher?._id === TeacherID)
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
                <div className="fs-16 fw-600 mb-8">Các khung giờ trống</div>
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
            </Row>
          </MainProfileWrapper>
        </Col>
        <Col span={7}>
          <MainProfileWrapper className="p-24">
            <div className="fs-20 fw-600 mb-16">Thông tin đặt lịch</div>
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
                <span className="fs-17 fw-600">{formatMoney(+teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent))} VNĐ</span>
              </div>
            }
            {/* <Radio.Group
              onChange={e => setBookingInfor(pre => ({ ...pre, PaymentMethod: e.target.value }))}
              className="mb-12"
            >
              <PaymentMethodStyled className={`${bookingInfor?.PaymentMethod === 1 ? "active" : ""}`}>
                <Radio value={1}>
                  <div className="d-flex-sb">
                    <div className="mr-6 fs-16">Thanh toán bằng VNPay</div>
                    <img
                      src={logoVNPay}
                      alt=""
                      style={{
                        width: "25px",
                        height: "25px"
                      }}
                    />
                  </div>
                </Radio>
              </PaymentMethodStyled>
              <PaymentMethodStyled className={`${bookingInfor?.PaymentMethod === 2 ? "active" : ""}`}>
                <Radio value={2}>
                  <div className="d-flex-sb">
                    <div className="mr-6 fs-16">Thanh toán bằng VietQR</div>
                    <img
                      src={logoVietQR}
                      alt=""
                      style={{
                        width: "25px",
                        height: "25px"
                      }}
                    />
                  </div>
                </Radio>
              </PaymentMethodStyled>
            </Radio.Group> */}
            {
              !!selectedTimes?.length &&
              (
                (bookingInfor?.LearnType === 2 && !!bookingInfor?.Address) ||
                (bookingInfor?.LearnType === 1)
              ) &&
              <ButtonCustom
                className="primary submit-btn"
                loading={loading}
                onClick={() => setOpenModalConfirmInfor(true)}
              >
                Xác nhận
              </ButtonCustom>
            }
          </MainProfileWrapper>
        </Col>

        {/* {
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
        } */}

        {
          !!openModalConfirmInfor &&
          <MOdalConfirmInfor
            open={openModalConfirmInfor}
            onCancel={() => setOpenModalConfirmInfor(false)}
            teacher={teacher}
            bookingInfor={bookingInfor}
            selectedTimes={selectedTimes}
          />
        }

      </Row>

    </SpinCustom >
  )
}

export default BookingPage