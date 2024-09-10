import { Col, Form, Row } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { globalSelector } from "src/redux/selector"


const Educations = ({ changeProfile }) => {

  const { user } = useSelector(globalSelector)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      educations: !!user?.Educations?.length ? user?.Educations : [{}]
    })
  }, [])

  return (
    <Form className="p-12" form={form}>
      <div className='fw-600 fs-16 mb-12'>
        Hãy cho học sinh biết học vấn của bạn. Điều đó có thể thu hút sự chú ý của họ
      </div>
      <Form.List name="educations">
        {(fields, { add, remove }) => (
          <div>
            {
              fields.map(({ key, name, ...restField }) => (
                <Row key={key} className="d-flex-sb" gutter={[16]} >
                  <Col span={7}>
                    <div className="fw-600 mb-8">Bạn từng học gì khoảng thời gian nào</div>
                    <Form.Item
                      style={{ width: "100%", marginRight: "8px" }}
                      {...restField}
                      name={[name, `StartDate`]}
                      rules={[
                        { required: true, message: "Thông tin không được để trống" },
                      ]}
                    >
                      <InputCustom
                        className="mb-8"
                        placeholder="Từ Tháng 2, 2016"
                        disabled={user?.RegisterStatus !== 3 && !!user?.Educations?.length ? true : false}
                      />
                    </Form.Item>
                    <Form.Item
                      style={{ width: "100%", marginRight: "8px" }}
                      {...restField}
                      name={[name, `EndDate`]}
                      rules={[
                        { required: true, message: "Thông tin không được để trống" },
                      ]}
                    >
                      <InputCustom
                        placeholder="Đến Tháng 4, 2020 or Bây giờ"
                        disabled={user?.RegisterStatus !== 3 && !!user?.Educations?.length ? true : false}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div className="fw-600 mb-8">Bạn đã từng học gì</div>
                    <Form.Item
                      name={[name, `Title`]}
                      rules={[
                        { required: true, message: "Thông tin không được để trống" },
                      ]}
                    >
                      <InputCustom
                        disabled={user?.RegisterStatus !== 3 && !!user?.Educations?.length ? true : false}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div className="fw-600 mb-8">Mô tả về quá trình học của bạn</div>
                    <Form.Item
                      {...restField}
                      style={{ width: "100%", marginRight: "8px" }}
                      name={[name, `Content`]}
                      rules={[
                        { required: true, message: "Thông tin không được để trống" },
                      ]}
                    >
                      <InputCustom
                        disabled={user?.RegisterStatus !== 3 && !!user?.Educations?.length ? true : false}
                        type="isTextArea"
                        placeholder="Mô tả"
                        style={{ height: "100px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <ButtonCircle
                      disabled={user?.RegisterStatus !== 3 && !!user?.Educations?.length ? true : false}
                      icon={ListIcons.ICON_DELETE}
                      onClick={() => remove(name)}
                    />
                  </Col>
                </Row>
              ))
            }
            <div className="d-flex-end">
              <ButtonCustom
                className="third fw-700"
                disabled={user?.RegisterStatus !== 3 && !!user?.Educations?.length ? true : false}
                onClick={() => add()}
              >
                Thêm
              </ButtonCustom>
            </div>
          </div>
        )}
      </Form.List>

      <ButtonCustom
        className="medium-size primary fw-700"
        loading={loading}
        onClick={() => {
          if (user?.RegisterStatus === 3 || !user?.Educations.length) {
            changeProfile(form, setLoading)
          }
        }}
      >
        {
          user?.RegisterStatus !== 3
            ? !!user?.Educations?.length
              ? "Hoàn thành"
              : "Lưu"
            : "Cập nhật"
        }
      </ButtonCustom>
    </Form>
  )
}

export default Educations