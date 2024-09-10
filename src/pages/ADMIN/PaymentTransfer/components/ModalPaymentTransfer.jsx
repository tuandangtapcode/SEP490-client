import { Col, Form, message, Row, Space, Upload } from "antd"
import { useState } from "react"
import { toast } from "react-toastify"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { formatMoney } from "src/lib/stringUtils"
import PaymentService from "src/services/PaymentService"

const ModalPaymentTransfer = ({ open, onCancel, onOk }) => {

  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState()
  const [form] = Form.useForm()

  const handleBeforeUpload = (file) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"]
    const isAllowedType = allowedImageTypes.includes(file.type)
    if (!isAllowedType) {
      message.error("Yêu cầu chọn file ảnh (jpg, png, gif)")
    } else {
      setPreview(URL.createObjectURL(file))
    }
    return isAllowedType ? false : Upload.LIST_IGNORE
  }

  const handleCompleteTransfer = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      console.log(values);
      const res = await PaymentService.changePaymentStatus({
        PaymentID: open?.PaymentID,
        PaymentStatus: 2,
        TotalFee: open?.TotalFee,
        FullName: open?.FullName,
        Email: open?.Email,
        RoleID: open?.RoleID,
        Image: values?.image?.file
      })
      if (!!res?.isError) return
      toast.success(res?.msg)
      onCancel()
      onOk()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      title="Xác nhận thanh toán"
      closable
      open={open}
      onCancel={onCancel}
      width="60vw"
      footer={
        <div className="d-flex-end">
          <Space>
            <ButtonCustom
              onClick={() => onCancel()}
            >
              Đóng
            </ButtonCustom>
            <ButtonCustom
              className="primary"
              loading={loading}
              onClick={() => handleCompleteTransfer()}
            >
              Xác nhận thanh toán
            </ButtonCustom>
          </Space>
        </div>
      }
    >
      <Form form={form}>
        <Row gutter={[16, 16]} className="d-flex-center">
          <Col span={20}>
            <div className="d-flex">
              <img
                src={open?.BankImgae}
                alt=""
                style={{
                  width: "120px",
                  height: "80px"
                }}
              />
              <div className="mb-8">
                <div className="fw-600 gray-text">Ngân hàng</div>
                <div className="fw-700 fs-17">{open?.BankName}</div>
              </div>
            </div>
            <div className="mb-8">
              <div className="fw-600 gray-text">Chủ tài khoản</div>
              <div className="fw-700 fs-17">{open?.UserBankName}</div>
            </div>
            <div className="mb-8">
              <div className="fw-600 gray-text">Số tài khoản</div>
              <div className="fw-700 fs-17">{open?.UserBankAccount}</div>
            </div>
            <div className="mb-8">
              <div className="fw-600 gray-text">Số tiền</div>
              <div className="fw-700 fs-17">{formatMoney(open?.TotalFee)} VNĐ</div>
            </div>
            <div>
              <div className="fw-600 gray-text">Nội dung</div>
              <div className="fw-700 fs-17">{open?.Description}</div>
            </div>
            <Form.Item
              name='image'
              className="mb-24 mt-24"
              rules={[
                { required: true, message: "Hãy chọn ảnh" }
              ]}
            >
              <Upload.Dragger
                beforeUpload={file => handleBeforeUpload(file)}
                style={{ width: '100%', height: '150px' }}
                accept="image/*"
                multiple={false}
                maxCount={1}
                fileList={[]}
              >
                <div >
                  Chọn hình ảnh giao dịch
                </div>
                {
                  !!preview &&
                  <img style={{ width: '150px', height: "300px" }} src={preview} alt="" />
                }
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalCustom>
  )
}

export default ModalPaymentTransfer