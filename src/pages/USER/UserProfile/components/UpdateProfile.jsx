import { Col, DatePicker, Form, Radio, Row, Space, Upload, message } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import dayjs from "dayjs"
import { getRegexPhoneNumber } from "src/lib/stringUtils"

const UpdateProfile = ({ form }) => {

  const { user, listSystemKey } = useSelector(globalSelector)
  const [preview, setPreview] = useState()

  const handleBeforeUpload = (file) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"]
    const isAllowedType = allowedImageTypes.includes(file.type)
    if (!isAllowedType) {
      return message.error("Yêu cầu chọn file ảnh (jpg, png, gif)")
    } else if (file.size > 5 * 1024 * 1024) {
      return message.error("Dung lượng file tải lên phải nhỏ 5MB")
    } else {
      setPreview(URL.createObjectURL(file))
    }
    return isAllowedType ? false : Upload.LIST_IGNORE
  }

  useEffect(() => {
    form.setFieldsValue({
      ...user,
      DateOfBirth: !!user?.DateOfBirth
        ? dayjs(user?.DateOfBirth)
        : ""
    })
  }, [])

  return (
    <Form form={form}>
      <Row gutter={[12, 0]}>
        <Col span={8}>
          <Form.Item
            name='image'
          >
            <Upload.Dragger
              beforeUpload={file => handleBeforeUpload(file)}
              // style={{ width: '250px' }}
              accept="image/*"
              multiple={false}
              maxCount={1}
              fileList={[]}
            >
              <div >
                Chọn ảnh đại diện cho bạn
              </div>
              <img
                style={{ width: '100%', height: '200px' }}
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
            name="Gender"
            rules={[
              { required: true, message: "Hãy chọn giới tính của bạn" },
            ]}
          >
            <Radio.Group>
              <Space direction="horizontal">
                {
                  getListComboKey(SYSTEM_KEY.GENDER, listSystemKey).map((i, idx) =>
                    <Radio
                      className="border-radio"
                      key={idx}
                      value={i?.ParentID}
                    >
                      {i?.ParentName}
                    </Radio>
                  )
                }
              </Space>
            </Radio.Group>
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
            name='Phone'
            rules={[
              { required: true, message: "Thông tin không được để trống" },
              { pattern: getRegexPhoneNumber(), message: "Số điện thoại sai định dạng" }
            ]}
          >
            <InputCustom placeholder="Nhập vào số diện thoại" />
          </Form.Item>
          <Form.Item
            name='DateOfBirth'
            rules={[
              { required: true, message: "Thông tin không được để trống" },
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày sinh của bạn"
              format="DD/MM/YYYY"
              style={{
                width: "100%"
              }}
            />
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
  )
}

export default UpdateProfile