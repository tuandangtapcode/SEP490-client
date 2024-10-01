import { Form, Select, Space } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import globalSlice from "src/redux/globalSlice"
import { globalSelector } from "src/redux/selector"
import SubjectService from "src/services/SubjectService"
import UserService from "src/services/UserService"

const { Option } = Select

const ModalSubject = ({
  open,
  onCancel,
  subjectSettings,
  onOk
}) => {

  const { user } = useSelector(globalSelector)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [subjects, setSubjects] = useState([])

  const handleCreateSubjectSetting = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.pushOrPullSubjectForTeacher({
        SubjectID: values?.SubjectID,
        Email: user?.Email
      })
      if (!!res?.isError) return
      dispatch(globalSlice.actions.setUser(res?.data))
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])


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
                handleCreateSubjectSetting()
              }}
            >
              Lưu
            </ButtonCustom>
          </Space>
        </div>
      }
    >
      <SpinCustom spinning={loading}>
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
                  ?.filter(sub => !subjectSettings?.map(s => s?.Subject?._id)?.includes(sub?._id))
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
      </SpinCustom>
    </ModalCustom>
  )
}

export default ModalSubject