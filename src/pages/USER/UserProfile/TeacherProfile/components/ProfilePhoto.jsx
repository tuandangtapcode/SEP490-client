import { Form, Upload, message } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { globalSelector } from "src/redux/selector"

const urlImage = import.meta.env.VITE_URL_IMAGE

const ProfilePhoto = ({ changeProfile }) => {

  const { user } = useSelector(globalSelector)
  const [form] = Form.useForm()
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

  return (
    <Form className="d-flex p-12" form={form}>
      <Form.Item
        name='image'
        className="mb-24 mr-20"
        rules={[
          { required: !!user?.AvatarPath?.includes(urlImage) ? false : true, message: "Thông tin không được bỏ trống" }
        ]}
      >
        <Upload.Dragger
          disabled={user?.RegisterStatus !== 3 && !!user?.AvatarPath?.includes(urlImage) ? true : false}
          beforeUpload={file => handleBeforeUpload(file)}
          style={{ width: '300px', height: '300px' }}
          accept="image/*"
          multiple={false}
          maxCount={1}
          fileList={[]}
        >
          <div >
            Chọn ảnh đại diện cho bạn
          </div>
          <img
            style={{ width: '100%', height: '300px' }}
            src={!!preview ? preview : user?.AvatarPath}
            alt=""
          />
        </Upload.Dragger>
      </Form.Item>
      <div>
        <div className="fs-20 fw-600">Tải ảnh lên hồ sơ</div>
        <div className="fs-14 mb-16">Tạo ấn tượng đầu tiên tuyệt vời và trông có vẻ dễ tiếp cận.</div>
        <ButtonCustom
          className="medium-size primary fw-700"
          loading={loading}
          onClick={() => {
            if (user?.RegisterStatus === 3 || !user?.AvatarPath?.includes(urlImage)) {
              changeProfile(form, setLoading)
            }
          }}
        >
          {
            user?.RegisterStatus !== 3
              ? !!user?.AvatarPath?.includes(urlImage)
                ? "Hoàn thành"
                : "Lưu"
              : "Cập nhật"
          }
        </ButtonCustom>
      </div>
    </Form>
  )
}

export default ProfilePhoto