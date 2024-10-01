import { Col, Form, message, Row, Upload } from "antd"
import { normFile } from "src/lib/fileUtils"
import PreviewVideo from "../modal/PreviewVideo"
import { useState } from "react"


const IntroVideo = ({
  form,
  filesIntroVideo,
  setFilesIntroVideo,
}) => {

  const [previewVideo, setPreviewVideo] = useState()

  const handleBeforeUpload = async (file) => {
    const isAllowedType = file.type.includes("video")
    if (!isAllowedType) {
      message.error("Yêu cầu chọn ảnh (mp4)")
    }
    return isAllowedType ? false : Upload.LIST_IGNORE
  }


  return (
    <Col span={24}>
      <Row gutter={[8, 0]}>
        <Col span={24} className="mb-12">
          <div className="fw-600 fs-18">Video giới thiệu </div>
          <div>Hãy đăng một video giới thiệu về bản thân để có thể thu hút học viên hơn nhé</div>
        </Col>
        <Col span={24}>
          <Form.Item
            name="IntroVideos"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: form.getFieldValue("IntroVideos") ? false : true,
                message: "Hãy chọn file tải lên",
              },
            ]}
          >
            <Upload.Dragger
              listType="picture-card"
              beforeUpload={file => handleBeforeUpload(file)}
              onPreview={file => setPreviewVideo(file?.url.replace("jpg", "mp4"))}
              accept="video/*"
              className="pointer"
              multiple={true}
              onRemove={file => {
                if (!!file?.id) {
                  const copyFile = [...filesIntroVideo]
                  const newData = copyFile.filter(i => i?.id !== file?.id)
                  setFilesIntroVideo(newData)
                }
              }}
            >
              <div>Tải lên video giới thiệu</div>
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>

      {
        !!previewVideo &&
        <PreviewVideo
          open={previewVideo}
          onCancel={() => setPreviewVideo(false)}
        />
      }
    </Col>
  )
}

export default IntroVideo