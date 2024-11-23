import { Col, Radio, Row } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SpinCustom from "src/components/SpinCustom"
import { globalSelector } from "src/redux/selector"
import ConfirmService from "src/services/ConfirmService"
import dayjs from "dayjs"
import { formatMoney } from "src/lib/stringUtils"
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

const RootURLWebsite = import.meta.env.VITE_ROOT_URL_WEBSITE

const CheckoutPage = () => {

  const { ConfirmID } = useParams()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState()
  const [loading, setLoading] = useState(false)
  const { user, listSystemKey } = useSelector(globalSelector)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [openModalSuccessBooking, setOpenModalSuccessBooking] = useState(false)

  const getDetailConfirm = async () => {
    try {
      setLoading(true)
      const res = await ConfirmService.getDetailConfirm(ConfirmID)
      if (!!res?.isError) return navigate("/not-found")
      setConfirm(res?.data)
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
          amount: confirm?.TotalFee,
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
          confirm?.TotalFee * 100,
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
      const resConfirm = await ConfirmService.changeConfirmPaid(ConfirmID)
      if (!!resConfirm?.isError) return
      const resPayment = await PaymentService.createPayment({
        PaymentType: 1,
        Description: `Thanh toán book giáo viên ${confirm?.Receiver?.FullName}`,
        TotalFee: confirm?.TotalFee,
        TraddingCode: randomNumber(),
        PaymentMethod: +localStorage.getItem("paymentMethod")
      })
      if (!!resPayment?.isError) return
      const bodyLearnHistory = {
        Teacher: confirm?.Receiver?._id,
        Subject: confirm?.Subject?._id,
        TotalLearned: confirm?.Schedules?.length,
        TeacherName: confirm?.Receiver?.FullName,
        TeacherEmail: confirm?.Receiver?.Email,
        SubjectName: confirm?.Subject?.SubjectName,
        StudentName: user?.FullName,
        StudentEmail: user?.Email,
        Times: confirm?.Schedules?.map(i =>
          `Ngày ${dayjs(i?.StartTime).format("DD/MM/YYYY")} ${dayjs(i?.StartTime).format("HH:ss")} - ${dayjs(i?.EndTime).format("HH:ss")}`
        )
      }
      const resLearnHistory = await LearnHistoryService.createLearnHistory(bodyLearnHistory)
      if (!!resLearnHistory?.isError) return
      const bodyTimeTable = confirm?.Schedules?.map(i => ({
        LearnHistory: resLearnHistory?.data?._id,
        Teacher: confirm?.Receiver?._id,
        Subject: confirm?.Subject?._id,
        StartTime: dayjs(i?.StartTime),
        EndTime: dayjs(i?.EndTime),
        LearnType: confirm?.LearnType,
        Address: !!confirm?.Address
          ? confirm?.Address
          : undefined,
      }))
      const resTimeTable = await TimeTableService.createTimeTable(bodyTimeTable)
      if (!!resTimeTable?.isError) return
      localStorage.removeItem("paymentMethod")
      setOpenModalSuccessBooking({ FullName: confirm?.Receiver?.FullName })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetailConfirm()
  }, [ConfirmID])

  useEffect(() => {
    if (!confirm?.IsPaid) {
      if (
        ((!!queryParams.get("status") && queryParams.get("status") === "PAID") ||
          (!!queryParams.get("vnp_ResponseCode") && queryParams.get("vnp_ResponseCode") === "00")) &&
        !!confirm
      ) {
        handleCompleteBooking()
      }
    }
  }, [location.search, confirm])


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
                <span>{confirm?.Receiver?.FullName}</span>
              </div>
              <div className="mb-6">
                <span className="mr-4 fs-15 fw-600">Môn học:</span>
                <span>{confirm?.Subject?.SubjectName}</span>
              </div>
              <div className="mb-6">
                <span className="mr-4 fs-15 fw-600">Hình thức học:</span>
                <span>
                  {
                    getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                      .find(i => i.ParentID === confirm?.LearnType)?.ParentName
                  }
                </span>
              </div>
              <div className="mb-6">
                <p className="mb-4 fs-15 fw-600">Lịch học ({confirm?.Schedules?.length} buổi):</p>
                {
                  confirm?.Schedules?.map((i, idx) =>
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
                disabled={confirm?.IsPaid}
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
                <span className="fs-17 fw-700 primary-text">{formatMoney(confirm?.TotalFee)} VNĐ</span>
              </div>
            </Col>
            <Col span={12}>
            </Col>
            <Col span={12} className="mt-12">
              {
                !confirm?.IsPaid
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