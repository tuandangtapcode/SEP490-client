import { Col, QRCode, Row, Space } from "antd"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { formatMoney } from "src/lib/stringUtils"
import PaymentService from "src/services/PaymentService"

const ModalPaymentBooking = ({ open, onCancel, onOk }) => {

  const checkPaymentLinkStatus = async () => {
    const res = await PaymentService.getDetailPaymentLink(open?.paymentLinkId)
    if (res?.data?.code !== "00") return
    if (res?.data?.data?.status === "PAID") {
      clearInterval(intervalId)
      onCancel()
      onOk()
    }
  }

  const intervalId = setInterval(checkPaymentLinkStatus, 3000)


  return (
    <ModalCustom
      title="Xác nhận thanh toán"
      closable
      open={open}
      onCancel={() => {
        clearInterval(intervalId)
        onCancel()
      }}
      width="60vw"
      footer={
        <div className="d-flex-end">
          <Space>
            <ButtonCustom
              onClick={() => {
                clearInterval(intervalId)
                onCancel()
              }}
            >
              Đóng
            </ButtonCustom>
          </Space>
        </div>
      }
    >
      <Row>
        <Col span={10}>
          <QRCode value={open?.qrCode} size={250} />
        </Col>
        <Col span={14}>
          <div className="d-flex">
            <img
              src="https://dl.memuplay.com/new_market/img/com.vietinbank.ipay.icon.2024-01-20-13-10-15.png"
              alt=""
              style={{
                width: "50px",
                height: "50px"
              }}
            />
            <div className="mb-8">
              <div className="fw-600 gray-text">Ngân hàng</div>
              <div className="fw-700 fs-17">Ngân hàng TMCP Công Thương Việt Nam</div>
            </div>
          </div>
          <div className="mb-8">
            <div className="fw-600 gray-text">Chủ tài khoản</div>
            <div className="fw-700 fs-17">PHAM MINH TUAN</div>
          </div>
          <div className="mb-8">
            <div className="fw-600 gray-text">Số tài khoản</div>
            <div className="fw-700 fs-17">100874232133</div>
          </div>
          <div className="mb-8">
            <div className="fw-600 gray-text">Số tiền</div>
            <div className="fw-700 fs-17">{formatMoney(open?.amount)} VNĐ</div>
          </div>
          <div>
            <div className="fw-600 gray-text">Nội dung</div>
            <div className="fw-700 fs-17">{open?.description}</div>
          </div>
        </Col>
      </Row>
    </ModalCustom>
  )
}

export default ModalPaymentBooking