import { Col, DatePicker, Form, Row } from "antd"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"

const Experiences = () => {


  return (
    <Col span={24}>
      <Form.List name="experiences">
        {(fields, { add, remove }) => (
          <Row gutter={[12]}>
            <Col span={24} className="mb-12">
              <div className="d-flex-sb">
                <div className="fs-18 fw-600">Kinh nghiệm giảng dạy</div>
                <ButtonCustom
                  className="third-type-2"
                  onClick={() => add()}
                >
                  Thêm mô tả mới
                </ButtonCustom>
              </div>
              <div>Hãy cho học viên biết một chút về kinh nghiệm của bạn nhé!</div>
            </Col>
            <Col span={24}>
              {
                fields.map(({ key, name, ...restField }) =>
                  <Row className="d-flex-sb" key={key} gutter={[16]}>
                    <Col span={13}>
                      <Form.Item
                        name={[name, 'Content']}
                        {...restField}
                        label={<div className="fw-600">Mô tả kinh nghiệm của bạn</div>}
                        rules={[
                          { required: true, message: "Thông tin không được để trống" },
                        ]}
                      >
                        <InputCustom placeHolder="Mô tả một chút về kinh nghiệm của bạn" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        name={[name, 'Date']}
                        {...restField}
                        label={<div className="fw-600">Thời gian bắt đầu - Thời gian kết thúc</div>}
                        rules={[
                          { required: true, message: "Thông tin không được để trống" },
                        ]}
                      >
                        <DatePicker.RangePicker
                          style={{ width: "100%" }}
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <ButtonCircle
                        // disabled={user?.RegisterStatus !== 3 && !!user?.Experiences?.length ? true : false}
                        icon={ListIcons.ICON_DELETE}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                )
              }
            </Col>
          </Row>
        )}
      </Form.List>
    </Col>
  )
}

export default Experiences