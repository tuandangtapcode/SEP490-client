import { Checkbox, Col, Form, InputNumber, Row } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney } from "src/lib/stringUtils"

const BasicInformation = () => {

  const { listSystemKey, profitPercent } = useSelector(globalSelector)
  const [totalFee, setTotalFee] = useState(0)


  return (
    <Col span={24}>
      <Row>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Thông tin cơ bản môn học</div>
        </Col>
        <Col span={24}>
          <Form.Item
            label={<div className="fw-500">Tiêu đề môn học:</div>}
            name="TitleQuote"
            rules={[
              { required: true, message: "Thông tin không được để trống" }
            ]}
          >
            <InputCustom placeHolder="Tiêu đề cho môn học của bạn sẽ giúp bạn thu hút học sinh một cách thú vị, khác biệt" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={<div className="fw-500">Giới thiệu môn học:</div>}
            name="ContentQuote"
            rules={[
              { required: true, message: "Thông tin không được để trống" }
            ]}
          >
            <InputCustom
              placeHolder="Hãy giới thiệu một chút về môn học và cách bạn giảng dạy để có thể truyền tải đến học sinh một cách dễ hiểu nhất nhé"
              type="isTextArea"
              style={{
                height: "100px"
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="LearnTypes"
            label={<div className="fw-500">Hình thức giảng dạy:</div>}
            rules={[
              { required: true, message: "Thông tin không được để trống" }
            ]}
          >
            <Checkbox.Group
              mode='multiple'
            >
              {
                getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.map((i, idx) =>
                  <Checkbox key={idx} value={i?.ParentID}>{i?.ParentName}</Checkbox>
                )
              }
            </Checkbox.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='Price'
            label={<div className="fw-500">Giá tiền cho mỗi buổi học:</div>}
            rules={[
              {
                validator: (rule, value) => {
                  if (!value) {
                    return Promise.reject("Thông tin không được để trống")
                  }
                  const fee = parseInt(value)
                  if (isNaN(fee)) {
                    return Promise.reject("Vui lòng nhập vào số")
                  } else if (fee < 150) {
                    return Promise.reject("Số nhập vào phải lớn hơn hoặc bằng 150")
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
              onChange={e => setTotalFee(e * (1 + profitPercent) * 1000)}
            />
          </Form.Item>
          <div className="d-flex align-items-center">
            <div className='fw-600 fs-15 mr-8'>Số tiền học sinh cần trả:</div>
            <div>
              <span>{formatMoney(totalFee)}</span>
              <span> VNĐ</span>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Form.Item
            name="Levels"
            label={<div className="fw-500">Cấp độ giảng dạy:</div>}
            rules={[
              { required: true, message: "Thông tin không được để trống" }
            ]}
          >
            <Checkbox.Group
              mode='multiple'
            // onChange={e => setLearnTypes(e)}
            >
              {getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map((i, idx) =>
                <Checkbox key={idx} value={i?.ParentID}>{i?.ParentName}</Checkbox>
              )}
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>
    </Col>
  )
}

export default BasicInformation