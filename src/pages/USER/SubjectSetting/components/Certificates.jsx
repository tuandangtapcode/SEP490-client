import { Col, Form, message, Row, Upload } from "antd"
import { getBase64, normFile } from "src/lib/fileUtils"
import PreviewImage from "../modal/PreviewImage"
import { useState } from "react"

const Certificates = ({
  form,
  setFilesCertificate,
  filesCertificate
}) => {

  const [previewImage, setPreviewImage] = useState()

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
  }

  const handleBeforeUpload = async (file) => {
    const isAllowedType = file.type.includes("image")
    if (!isAllowedType) {
      message.error("Yêu cầu chọn file ảnh (jpg, png, gif)")
    } else if (file.size > 5 * 1024 * 1024) {
      message.error("Dung lượng file tải lên phải nhỏ 5MB")
    }
    return isAllowedType ? false : Upload.LIST_IGNORE
  }


  return (
    <Col span={24}>
      <Row gutter={[16, 0]}>
        <Col span={24} className="mb-12">
          <div className="fw-600 fs-18">Cập nhật tài liệu bằng cấp:</div>
          <div>Đăng tải các tài liệu để chứng minh trình độ học vấn của bạn để có thể được duyệt nhé!</div>
        </Col>
        <Col span={24}>
          <Form.Item
            name="Certificates"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: form.getFieldValue("Certificates") ? false : true,
                message: "Hãy chọn file tải lên",
              },
            ]}
          >
            <Upload.Dragger
              listType="picture-circle"
              beforeUpload={file => handleBeforeUpload(file)}
              onPreview={handlePreview}
              accept="image/*"
              className="pointer"
              multiple={true}
              onRemove={file => {
                if (!!file?.id) {
                  const copyFile = [...filesCertificate]
                  const newData = copyFile.filter(i => i?.id !== file?.id)
                  setFilesCertificate(newData)
                }
              }}
            >
              Tải ảnh lên
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>

      {
        !!previewImage &&
        <PreviewImage
          open={previewImage}
          onCancel={() => setPreviewImage(false)}
        />
      }
    </Col>
  )
}

export default Certificates