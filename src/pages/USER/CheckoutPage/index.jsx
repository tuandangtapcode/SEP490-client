import { Col, Radio, Row } from "antd"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SpinCustom from "src/components/SpinCustom"
import { globalSelector } from "src/redux/selector"
import ConfirmService from "src/services/ConfirmService"
import dayjs from "dayjs"
import { formatMoney, getRealFee } from "src/lib/stringUtils"
import { CheckoutPageContainerStyled, CheckoutPageStyled } from "./styled"
import { generateSignature, getListComboKey, randomNumber } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { PaymentMethodStyled } from "src/pages/ANONYMOUS/BookingPage/styled"
import logoVNPay from "/Icon-VNPAY-QR.png"
import logoVietQR from "/vietqr.png"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import PaymentService from "src/services/PaymentService"
import handleCreatePaymentVNPay from "src/lib/getUrlVNPay"
import { toast } from "react-toastify"
import LearnHistoryService from "src/services/LearnHistoryService"
import TimeTableService from "src/services/TimeTableService"
import ModalSuccessBooking from "./components/ModalSuccessBooking"
import BlogService from "src/services/BlogService"
import Router from "src/routers"

const RootURLWebsite = import.meta.env.VITE_ROOT_URL_WEBSITE_CLOUD

const CheckoutPage = () => {

  const { CheckoutID, Type } = useParams()
  const navigate = useNavigate()
  const [dataPayment, setDataPayment] = useState()
  const [loading, setLoading] = useState(false)
  const { user, listSystemKey, profitPercent } = useSelector(globalSelector)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [openModalSuccessBooking, setOpenModalSuccessBooking] = useState(false)
  const intervalRef = useRef(null)

  const getDataToCheckout = async () => {
    try {
      setLoading(true)
      let res
      if (Type === "Confirm") {
        res = await ConfirmService.getDetailConfirm(CheckoutID)
        if (!!res?.isError) return navigate("/not-found")
      } else if (Type === "Blog") {
        res = await BlogService.getDetailBlog(CheckoutID)
        if (!!res?.isError) return navigate("/not-found")
      } else {
        return navigate(Router.TRANG_CHU)
      }
      setDataPayment(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const createPaymentLink = async () => {
    try {
      setLoading(true)
      if (!+localStorage.getItem("paymentMethod")) {
        return toast.warning("Hãy chọn phương thức thanh toán")
      }
      if (+localStorage.getItem("paymentMethod") === 2) {
        const body = {
          orderCode: randomNumber(),
          amount: dataPayment?.TotalFee,
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
        window.location.href = resPaymemtLink?.data?.data?.checkoutUrl
      } else if (+localStorage.getItem("paymentMethod") === 1) {
        handleCreatePaymentVNPay(
          "Thanh toán book giáo viên",
          dataPayment?.TotalFee * 100,
          `${RootURLWebsite}${location.pathname}`,
          "1.1.1.1"
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteBooking = async () => {
    try {
      setLoading(true)
      const resConfirm = await ConfirmService.changeConfirmPaid(CheckoutID)
      if (!!resConfirm?.isError) return
      const resPayment = await PaymentService.createPayment({
        PaymentType: 1,
        Description: `Thanh toán book giáo viên ${dataPayment?.Receiver?.FullName}`,
        TotalFee: dataPayment?.TotalFee,
        TraddingCode: randomNumber(),
        PaymentMethod: +localStorage.getItem("paymentMethod"),
        Percent: profitPercent
      })
      if (!!resPayment?.isError) return
      const bodyLearnHistory = {
        Teacher: dataPayment?.Receiver?._id,
        Subject: dataPayment?.Subject?._id,
        TotalLearned: dataPayment?.Schedules?.length,
        TeacherName: dataPayment?.Receiver?.FullName,
        TeacherEmail: dataPayment?.Receiver?.Email,
        SubjectName: dataPayment?.Subject?.SubjectName,
        StudentName: user?.FullName,
        StudentEmail: user?.Email,
        Times: dataPayment?.Schedules?.map(i =>
          `Ngày ${dayjs(i?.StartTime).format("DD/MM/YYYY")} ${dayjs(i?.StartTime).format("HH:ss")} - ${dayjs(i?.EndTime).format("HH:ss")}`
        )
      }
      const resLearnHistory = await LearnHistoryService.createLearnHistory(bodyLearnHistory)
      if (!!resLearnHistory?.isError) return
      const bodyTimeTable = dataPayment?.Schedules?.map(i => ({
        LearnHistory: resLearnHistory?.data?._id,
        Teacher: dataPayment?.Receiver?._id,
        Subject: dataPayment?.Subject?._id,
        StartTime: dayjs(i?.StartTime),
        EndTime: dayjs(i?.EndTime),
        LearnType: dataPayment?.LearnType,
        Address: !!dataPayment?.Address
          ? dataPayment?.Address
          : undefined,
        Price: getRealFee(dataPayment?.TotalFee, profitPercent) / dataPayment?.Schedules?.length
      }))
      const resTimeTable = await TimeTableService.createTimeTable(bodyTimeTable)
      if (!!resTimeTable?.isError) return
      localStorage.removeItem("paymentMethod")
      setOpenModalSuccessBooking({ FullName: dataPayment?.Receiver?.FullName })
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentLinkStatus = async (paymentLinkID) => {
    const res = await PaymentService.getDetailPaymentLink(paymentLinkID)
    if (res?.data?.code !== "00") {
      clearInterval(intervalRef.current)
    }
    if (res?.data?.data?.status === "CANCELLED") {
      clearInterval(intervalRef.current)
    } else if (res?.data?.data?.status === "PENDING") {
      window.location.href = `https://pay.payos.vn/web/${paymentLinkID}`
    } else if (res?.data?.data?.status === "PAID") {
      clearInterval(intervalRef.current)
      handleCompleteBooking()
    }
  }

  useEffect(() => {
    getDataToCheckout()
  }, [CheckoutID])


  useEffect(() => {
    if (!dataPayment?.IsPaid) {
      if (!!queryParams.get("id") && !!dataPayment) {
        const paymentLinkID = queryParams.get("id")
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => checkPaymentLinkStatus(paymentLinkID), 3000)
        }
      } else if (
        !!queryParams.get("vnp_ResponseCode") &&
        queryParams.get("vnp_ResponseCode") === "00" &&
        !!dataPayment
      ) {
        handleCompleteBooking()
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [location.search, dataPayment])


  return (
    <SpinCustom spinning={loading}>
      <CheckoutPageContainerStyled>
        <CheckoutPageStyled>
          <Row>
            <Col span={24}>
              <div className="center-text primary-text fs-22 fw-700 mb-12">Thông tin thanh toán</div>
            </Col>
            <Col span={12}>
              <div className="mb-6">
                <span className="mr-4 fs-15 fw-600">Giáo viên:</span>
                <span>{dataPayment?.Receiver?.FullName}</span>
              </div>
              <div className="mb-6">
                <span className="mr-4 fs-15 fw-600">Môn học:</span>
                <span>{dataPayment?.Subject?.SubjectName}</span>
              </div>
              <div className="mb-6">
                <span className="mr-4 fs-15 fw-600">Hình thức học:</span>
                <span>
                  {
                    getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                      .find(i => i.ParentID === dataPayment?.LearnType)?.ParentName
                  }
                </span>
              </div>
              <div className="mb-6">
                <p className="mb-4 fs-15 fw-600">Lịch học ({dataPayment?.Schedules?.length} buổi):</p>
                {
                  dataPayment?.Schedules?.map((i, idx) =>
                    <div key={idx} className="mb-4">
                      <span className="mr-2">Ngày</span>
                      <span className="mr-4">{dayjs(i?.StartTime).format("DD/MM/YYYY")}:</span>
                      <span className="mr-2">{dayjs(i?.StartTime).format("HH:mm")}</span>
                      <span className="mr-2">-</span>
                      <span>{dayjs(i?.EndTime).format("HH:mm")}</span>
                    </div>
                  )
                }
              </div>
            </Col>
            <Col span={12}>
              <p className="fs-16 fw-600 mb-8">Phương thức thanh toán:</p>
              <Radio.Group
                onChange={e => localStorage.setItem("paymentMethod", e.target.value)}
                disabled={dataPayment?.IsPaid}
                className="mb-12"
              >
                <PaymentMethodStyled
                  className={`${+localStorage.getItem("paymentMethod") === 1 ? "active" : ""} mb-8`}
                >
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
                <PaymentMethodStyled
                  className={`${+localStorage.getItem("paymentMethod") === 2 ? "active" : ""}`}
                >
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
              </Radio.Group>
              <div>
                <span className="gray-text fs-15 fw-600 mr-4">Số tiền thanh toán:</span>
                <span className="fs-17 fw-700 primary-text">{formatMoney(dataPayment?.TotalFee)} VNĐ</span>
              </div>
            </Col>
            <Col span={12}>
            </Col>
            <Col span={12} className="mt-12">
              {
                !dataPayment?.IsPaid
                  ?
                  <ButtonCustom
                    className="medium-size primary"
                    onClick={() => createPaymentLink()}
                  >
                    Thanh toán
                  </ButtonCustom>
                  : <p className="fs-16 fw-700">Booking đã được thanh toán</p>
              }
            </Col>
          </Row>

          {
            !!openModalSuccessBooking &&
            <ModalSuccessBooking
              open={openModalSuccessBooking}
              onCancel={() => setOpenModalSuccessBooking(false)}
            />
          }

        </CheckoutPageStyled>
      </CheckoutPageContainerStyled>
    </SpinCustom >
  )
}

export default CheckoutPage