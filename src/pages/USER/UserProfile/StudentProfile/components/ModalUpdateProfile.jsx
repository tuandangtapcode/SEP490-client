import { Col, Form, Row, Space, Upload, message } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import globalSlice from "src/redux/globalSlice"
import { globalSelector } from "src/redux/selector"
import UserService from "src/services/UserService"

const ModalUpdateProfile = ({ open, onCancel }) => {

  const [form] = Form.useForm()
  const { user } = useSelector(globalSelector)
  const dispatch = useDispatch()
  const [preview, setPreview] = useState()
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    form.setFieldsValue(user)
  }, [])

  const changeProfile = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await UserService.changeProfile({
        FullName: values?.FullName,
        Address: values?.Address,
        Avatar: values?.image?.file
      })
      if (res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      dispatch(globalSlice.actions.setUser(res?.data))
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chỉnh sửa thông tin cá nhân"
      width="70vw"
      footer={
        <div className="d-flex-end">
          <Space>
            <ButtonCustom
              onClick={() => onCancel()}
              className="third"
            >
              Đóng
            </ButtonCustom>
            <ButtonCustom
              loading={loading}
              className="primary"
              onClick={() => changeProfile()}
            >
              Cập nhật
            </ButtonCustom>
          </Space>
        </div >
      }
    >
      <Form form={form}>
        <Row>
          <Col span={8}>
            <Form.Item
              name='image'
            >
              <Upload.Dragger
                beforeUpload={file => handleBeforeUpload(file)}
                style={{ width: '250px' }}
                accept="image/*"
                multiple={false}
                maxCount={1}
                fileList={[]}
              >
                <div >
                  Chọn ảnh đại diện cho bạn
                </div>
                <img
                  style={{ width: '100px', height: '100px' }}
                  src={!!preview ? preview : user?.AvatarPath}
                  alt=""
                />
              </Upload.Dragger>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name='FullName'
              rules={[
                { required: true, message: "Thông tin không được để trống" },
              ]}
            >
              <InputCustom placeholder="Nhập vào họ và tên" />
            </Form.Item>
            <Form.Item
              name='Address'
              rules={[
                { required: true, message: "Thông tin không được để trống" },
              ]}
            >
              <InputCustom placeholder="Nhập vào địa chỉ" />
            </Form.Item>
            <Form.Item
              name='Email'
              rules={[
                { required: true, message: "Thông tin không được để trống" },
              ]}
            >
              <InputCustom
                placeholder="Nhập vào email"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalCustom >
  )
}

export default ModalUpdateProfile