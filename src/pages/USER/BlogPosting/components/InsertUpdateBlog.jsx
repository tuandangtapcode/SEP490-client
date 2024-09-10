import { Col, Form, message, Row, Space, Upload } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import { RenderTiny } from "src/components/TinyEditer"
import BlogService from "src/services/BlogService"
import styled from "styled-components"

const StyleModal = styled.div`
  .ant-form-item-label {
    width: 50%;
    text-align: left;
  }
`

const InsertUpdateBlog = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm()
  const [preview, setPreview] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!!open?._id) {
      form.setFieldsValue(open)
    }
  }, [open])

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

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const body = {
        BlogID: !!open?._id ? open?._id : undefined,
        Title: values?.Title,
        Description: values?.Description,
        Avatar: values?.image?.file,
        Content: values?.Content,
      }
      const res = !!open?._id
        ? await BlogService.updateBlog(body)
        : await BlogService.createBlog(body)
      if (res?.isError) return toast.error(res?.msg)
      onCancel()
      toast.success(res?.msg)
      onOk()
    } finally {
      setLoading(false)
    }
  }


  const renderFooter = () => (
    <div className="d-flex-center">
      <Space direction="horizontal">
        <ButtonCustom
          className="primary"
          onClick={() => {
            handleSubmit()
          }}
        >
          Ghi lại
        </ButtonCustom>
        <ButtonCustom btnType="cancel" onClick={onCancel}>
          Đóng
        </ButtonCustom>
      </Space>
    </div>
  )


  return (
    <ModalCustom
      title={!open?._id ? "Thêm mới bài viết" : "Cập nhật bài viết"}
      width={900}
      open={open}
      onCancel={onCancel}
      footer={renderFooter()}
    >
      <SpinCustom spinning={loading}>
        <StyleModal>
          <Form form={form} layout="vertical" initialValues={{}}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Title"
                  label="Tiêu đề bài viết:"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <InputCustom />
                </Form.Item>
                <Form.Item
                  name="Description"
                  label="Mô tả bài viết:"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <InputCustom type="isTextArea" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='image'
                  className="mb-24"
                >
                  <Upload.Dragger
                    beforeUpload={file => handleBeforeUpload(file)}
                    style={{ width: '100%', height: '150px' }}
                    accept="image/*"
                    multiple={false}
                    maxCount={1}
                    fileList={[]}
                  >
                    <div >
                      Chọn ảnh minh hoạ cho bài viết
                    </div>
                    <img style={{ width: '150px', height: "150px" }} src={!!preview ? preview : open?.AvatarPath} alt="" />
                  </Upload.Dragger>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Content"
                  label="Nội dung bài viết:"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <RenderTiny />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </StyleModal>
      </SpinCustom>
    </ModalCustom>
  )
}

export default InsertUpdateBlog;