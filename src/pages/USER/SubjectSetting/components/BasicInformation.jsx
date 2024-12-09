import { Checkbox, Col, Form, InputNumber, Row } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney, getRealFee } from "src/lib/stringUtils"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import InsertUpdateCourse from "../../MyCourse/components/InsertUpdateCourse"

const BasicInformation = ({ totalFee, setTotalFee, subjectSetting }) => {

  const { listSystemKey, profitPercent } = useSelector(globalSelector)
  const [openModalUpdateCourse, setOpenModalUpdateCourse] = useState(false)

  return (
    <Col span={24}>
      <Row>
        <Col span={24} className="d-flex-sb">
          <div className="fs-18 fw-600 mb-12">Thông tin cơ bản môn học</div>
          <ButtonCustom
            className="third-type-2"
            onClick={() => setOpenModalUpdateCourse({ Subject: subjectSetting?.Subject })}
          >
            Tạo khóa học
          </ButtonCustom>
        </Col>
        <Col span={24}>
          <Form.Item
            label={<div className="fw-500">Tiêu đề môn học:</div>}
            name="TitleQuote"
            rules={[
              { required: true, message: "Thông tin không được để trống" }
            ]}
          >
            <InputCustom
              placeHolder="Tiêu đề cho môn học của bạn sẽ giúp bạn thu hút học sinh một cách thú vị, khác biệt"
              disabled={subjectSetting?.RegisterStatus === 2 ? true : false}
            />
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
              disabled={subjectSetting?.RegisterStatus === 2 ? true : false}
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
              disabled={subjectSetting?.RegisterStatus === 2 ? true : false}
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
            label={<div className="fw-500">Giá tiền cho mỗi buổi học (VNĐ)</div>}
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
            ]}
          >
            <InputNumber
              style={{ width: "200px" }}
              type='isNumber'
              suffix=".000"
              disabled={subjectSetting?.RegisterStatus === 2 ? true : false}
              onChange={e => setTotalFee(getRealFee(e * 1000, profitPercent))}
            />
          </Form.Item>
          <div className="d-flex align-items-center">
            <div className='fw-600 fs-15 mr-8'>Số bạn nhận được:</div>
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
              disabled={subjectSetting?.RegisterStatus === 2 ? true : false}
            >
              {getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map((i, idx) =>
                <Checkbox key={idx} value={i?.ParentID}>{i?.ParentName}</Checkbox>
              )}
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>

      {
        !!openModalUpdateCourse &&
        <InsertUpdateCourse
          open={openModalUpdateCourse}
          onCancel={() => setOpenModalUpdateCourse(false)}
        />
      }

    </Col>
  )
}

export default BasicInformation