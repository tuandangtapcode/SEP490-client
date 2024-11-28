import { Col, Form, InputNumber, Radio, Row, Select, Space } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney, getRealFee } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import Router from "src/routers"
import CourseService from "src/services/CourseService"

const InsertUpdateCourse = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()
  const { user, listSystemKey, profitPercent } = useSelector(globalSelector)
  const [totalFee, setTotalFee] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const body = {
        ...values,
        CourseID: open?._id,
        Teacher: user?._id,
        Subject: open?.Subject?._id
      }
      const res = !!open?._id
        ? await CourseService.updateCourse(body)
        : await CourseService.createCourse(body)
      if (!!res?.isError) return toast.error(res?.msg)
      if (!!open?._id) {
        onOk()
        onCancel()
      } else {
        navigate(`${Router.KHOA_HOC}`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!open?._id) {
      form.setFieldsValue(open)
    }
    setTotalFee(open?.Price)
  }, [open?._id])

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title={!!open?._id ? "Chỉnh sửa khóa học" : "Tạo khóa học"}
      width="60vw"
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
            onClick={() => handleSubmit()}
          >
            Lưu
          </ButtonCustom>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24} className="d-flex mb-24">
            <div className="mr-6">Môn học:</div>
            <div className='fw-600 fs-15 mr-8'>{open?.Subject?.SubjectName}</div>
          </Col>
          <Col span={8}>
            <Form.Item
              name="QuantitySlot"
              label="Số lượng buổi học"
              rules={[
                {
                  validator: (rule, value) => {
                    const number = parseInt(value)
                    if (isNaN(number)) {
                      return Promise.reject("Vui lòng nhập vào số")
                    } else if (number <= 0) {
                      return Promise.reject("Số nhập vào phải lớn 0")
                    }
                    return Promise.resolve()
                  }
                },
                { required: true, message: "Thông tin không được để trống" }
              ]}
            >
              <InputCustom type="isNumber" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="Price"
              label="Giá tiền"
              rules={[
                {
                  validator: (rule, value) => {
                    if (!value) {
                      return Promise.reject("Thông tin không được để trống")
                    }
                    const fee = parseInt(value)
                    if (isNaN(fee)) {
                      return Promise.reject("Vui lòng nhập vào số")
                    } else if (fee < 1500) {
                      return Promise.reject("Số nhập vào phải lớn hơn hoặc bằng 1500")
                    }
                    return Promise.resolve()
                  }
                },
                { required: true, message: "Thông tin không được để trống" }
              ]}
            >
              <InputNumber
                style={{ width: "200px" }}
                type='isNumber'
                suffix=".000 VNĐ"
                onChange={e => setTotalFee(getRealFee(e, profitPercent))}
              />
            </Form.Item>
            <div className="d-flex align-items-center">
              <div className="mr-8">Số tiền học sinh cần trả:</div>
              <div>
                <span>{formatMoney(getRealFee(totalFee, profitPercent))}</span>
                <span> VNĐ</span>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <Form.Item
              name="Level"
              label="Cấp độ giảng dạy:"
              rules={[
                { required: true, message: "Thông tin không được để trống" }
              ]}
            >
              <Radio.Group>
                {getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map((i, idx) =>
                  <Radio key={idx} value={i?.ParentID}>{i?.ParentName}</Radio>
                )}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Title"
              label="Tiêu đề khóa học"
              rules={[
                { required: true, message: "Thông tin không được để trống" }
              ]}
            >
              <InputCustom />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Description"
              label="Giới thiệu khóa học"
              rules={[
                { required: true, message: "Thông tin không được để trống" }
              ]}
            >
              <InputCustom
                type="isTextArea"
                style={{
                  height: "100px"
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalCustom>
  )
}

export default InsertUpdateCourse