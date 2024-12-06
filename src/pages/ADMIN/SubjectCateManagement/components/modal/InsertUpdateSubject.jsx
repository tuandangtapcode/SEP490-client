import { Col, Form, Row, Space, Upload, message } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/Modal/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import FileService from "src/services/FileService"
import SubjectService from "src/services/SubjectService"
import styled from "styled-components"

const StyleModal = styled.div`
  .ant-form-item-label {
    width: 50%;
    text-align: left;
  }
`

const InsertUpdateSubject = ({ open, onCancel, onOk }) => {

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
    } else if (file.size > 5 * 1024 * 1024) {
      message.error("Dung lượng file tải lên phải nhỏ 5MB")
    } else {
      setPreview(URL.createObjectURL(file))
    }
    return isAllowedType ? false : Upload.LIST_IGNORE
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      let resFile
      if (!!values?.image?.file) {
        resFile = await FileService.uploadFileSingle({
          FileSingle: values?.image?.file
        })
        if (resFile?.isError) return
      }
      const body = {
        SubjectID: !!open?._id ? open?._id : undefined,
        SubjectCateID: open?.SubjectCateID,
        AvatarPath: !!resFile ? resFile?.data : open?.AvatarPath,
        SubjectName: values?.SubjectName,
      }
      const res = !!open?._id
        ? await SubjectService.updateSubject(body)
        : await SubjectService.createSubject(body)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      onOk()
      onCancel()
    } finally {
      setLoading(false)
    }
  }


  const renderFooter = () => (
    <Space className="d-flex-center">
      <ButtonCustom btnType="cancel" onClick={onCancel}>
        Đóng
      </ButtonCustom>
      <ButtonCustom
        className="primary"
        onClick={() => {
          handleSubmit()
        }}
      >
        Ghi lại
      </ButtonCustom>
    </Space>
  )


  return (
    <ModalCustom
      title={!open?._id ? "Thêm mới môn học" : "Cập nhật môn học"}
      width={900}
      open={open}
      onCancel={onCancel}
      footer={renderFooter()}
    >
      <SpinCustom spinning={loading}>
        <StyleModal>
          <Form form={form} layout="vertical" initialValues={{}}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="SubjectName"
                  label="Tên môn học:"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <InputCustom />
                </Form.Item>
              </Col>
              <Col span={24}>
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
                      Chọn ảnh đại diện cho môn học
                    </div>
                    <img style={{ width: '150px', height: "150px" }} src={!!preview ? preview : open?.AvatarPath} alt="" />
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </StyleModal>
      </SpinCustom>
    </ModalCustom>
  )
}

export default InsertUpdateSubject
