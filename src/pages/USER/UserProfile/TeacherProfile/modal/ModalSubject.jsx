import { Form, Select, Space } from "antd"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import globalSlice from "src/redux/globalSlice"
import { globalSelector } from "src/redux/selector"
import UserService from "src/services/UserService"

const { Option } = Select

const ModalSubject = ({ open, onCancel }) => {

  const { subjects, user } = useSelector(globalSelector)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handlePushSubject = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.pushOrPullSubjectForTeacher(values?.SubjectID)
      if (!!res?.isError) return
      dispatch(globalSlice.actions.setUser(res?.data))
      onCancel()
    } finally {
      setLoading(false)
    }
  }


  return (
    <ModalCustom
      title="Thêm môn học"
      width="50vw"
      open={open}
      onCancel={onCancel}
      footer={
        <div className="d-flex-end">
          <Space direction="horizontal">
            <ButtonCustom btnType="cancel" onClick={onCancel}>
              Đóng
            </ButtonCustom>
            <ButtonCustom
              loading={loading}
              className="primary"
              onClick={() => {
                handlePushSubject()
              }}
            >
              Lưu
            </ButtonCustom>
          </Space>
        </div>
      }
    >
      <Form form={form}>
        <Form.Item
          name="SubjectID"
          rules={[
            { required: true, message: "Hãy nhập vào tên của bạn" },
          ]}
        >
          <Select
            showSearch
            placeholder="Chọn môn học"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              subjects
                ?.filter(sub => !user?.Subjects?.map(s => s?._id)?.includes(sub?._id))
                ?.map(i =>
                  <Option
                    key={i?._id}
                    value={i?._id}
                  >
                    {i?.SubjectName}
                  </Option>
                )
            }
          </Select>
        </Form.Item>
      </Form>
    </ModalCustom>
  )
}

export default ModalSubject