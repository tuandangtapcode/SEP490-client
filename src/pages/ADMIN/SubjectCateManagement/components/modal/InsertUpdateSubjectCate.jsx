import { Col, Form, Row, Space } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/Modal/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/SpinCustom"
import SubjectCateService from "src/services/SubjectCateService"
import styled from "styled-components"

const StyleModal = styled.div`
  .ant-form-item-label {
    width: 50%;
    text-align: left;
  }
`

const InsertUpdateSubjectCate = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!!open?._id) {
      form.setFieldsValue({
        ...open,

      })
    }
  }, [open])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const body = {
        ...values,
        SubjectCateID: !!open?._id ? open?._id : undefined
      }
      const res = !!open?._id
        ? await SubjectCateService.updateSubjectCate(body)
        : await SubjectCateService.createSubjectCate(body)
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
      title={!open?._id ? "Thêm mới danh mục" : "Cập nhật danh mục"}
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
                  name="SubjectCateName"
                  label="Tên danh mục môn học:"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <InputCustom
                    label="Tên môn học:"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Description"
                  label="Mô tả:"
                >
                  <InputCustom type="isTextArea" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </StyleModal>
      </SpinCustom>
    </ModalCustom>
  )
}

export default InsertUpdateSubjectCate
