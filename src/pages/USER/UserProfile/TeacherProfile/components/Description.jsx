import { Form } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { globalSelector } from "src/redux/selector"

const Description = ({ changeProfile }) => {

  const { user } = useSelector(globalSelector)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      Description: user?.Description,
    })
  }, [])

  return (
    <Form form={form}>
      <div className="fw-600 mb-8">Hãy nói gì đó với học sinh của bạn</div>
      <Form.Item
        style={{ width: "100%", marginRight: "8px" }}
        name="Description"
        rules={[
          { required: true, message: "Thông tin không được để trống" },
        ]}
      >
        <InputCustom
          disabled={user?.RegisterStatus !== 3 && !!user?.Description ? true : false}
          style={{ width: "100%", height: "150px" }}
          type="isTextArea"
        />
      </Form.Item>
      <ButtonCustom
        className="medium-size primary fw-700"
        loading={loading}
        onClick={() => {
          if (user?.RegisterStatus === 3 || !user?.Description) {
            changeProfile(form, setLoading)
          }
        }}
      >
        {
          user?.RegisterStatus !== 3
            ? !!user?.Description
              ? "Hoàn thành"
              : "Lưu"
            : "Cập nhật"
        }
      </ButtonCustom>
    </Form>
  )
}

export default Description