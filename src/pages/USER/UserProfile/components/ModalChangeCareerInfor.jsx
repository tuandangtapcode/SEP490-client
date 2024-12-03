import { Col, Form, message, Row, Select, Space, Upload } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ModalCustom from "src/components/ModalCustom"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getBase64, normFile } from "src/lib/fileUtils"
import { globalSelector } from "src/redux/selector"
import PreviewImage from "../../SubjectSetting/modal/PreviewImage"
import SubjectService from "src/services/SubjectService"
import { toast } from "react-toastify"
import FileService from "src/services/FileService"
import UserService from "src/services/UserService"
import globalSlice from "src/redux/globalSlice"

const { Option } = Select

const ModalChangeCareerInfor = ({ open, onCancel }) => {

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])
  const { user } = useSelector(globalSelector)
  const [previewImage, setPreviewImage] = useState()
  const [filesCertificate, setFilesCertificate] = useState([])
  const timeOutRef = useRef(null)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10
  })

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

  const getListSubject = async () => {
    try {
      const res = await SubjectService.getListSubject(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      console.log()
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      let resCertificate
      if (!!values?.Certificates?.length) {
        resCertificate = await FileService.uploadFileList({
          FileList: values?.Certificates?.map(i => i?.originFileObj)
        })
        if (!!resCertificate?.isError) return toast.error(resCertificate?.msg)
      }
      const dataCertificate = resCertificate?.data
      const rawCertificates = filesCertificate?.map(i => i.url)
      const res = await UserService.changeCareerInformation({
        Subjects: values?.Subjects,
        Experiences: values?.experiences?.map(i =>
          i?.Content
        ),
        Educations: values?.educations?.map(i =>
          i?.Content
        ),
        Certificates: !!dataCertificate?.length
          ? [...rawCertificates, ...dataCertificate]
          : rawCertificates,
        Description: values?.Description
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      dispatch(globalSlice.actions.setUser(res?.data))
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const data = {
      experiences: !!user?.Experiences?.length
        ? user?.Experiences?.map(i => ({
          Content: i
        }))
        : [{}],
      educations: !!user?.Educations?.length
        ? user?.Educations?.map(i => ({
          Content: i
        }))
        : [{}],
      Certificates: user?.Certificates?.map((i, idx) => ({
        url: i,
        id: idx + 1
      })),
      Description: user?.Description,
      Subjects: user?.SubjectSettings?.map(i => i?.Subject?._id)
    }
    form.setFieldsValue(data)
    setFilesCertificate(data.Certificates)
  }, [])

  useEffect(() => {
    getListSubject()
  }, [pagination])


  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chỉnh sửa thông tin nghề nghiệp"
      width="70vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom className="third" onClick={onCancel}>
            Đóng
          </ButtonCustom>
          <ButtonCustom
            loading={loading}
            className="primary"
            onClick={() => handleSubmit()}
          >
            Lưu
          </ButtonCustom>
        </Space>
      }
    >
      <Form form={form}>
        <Row>
          <Col span={24}>
            <Form.List name="experiences">
              {(fields, { add, remove }) => (
                <Row gutter={[12]}>
                  <Col span={24} className="mb-12">
                    <div className="d-flex-sb">
                      <div className="fs-18 fw-600">Kinh nghiệm giảng dạy</div>
                      <ButtonCustom
                        className="third-type-2"
                        onClick={() => add()}
                      >
                        Thêm mô tả mới
                      </ButtonCustom>
                    </div>
                    <div>Hãy cho chúng tôi biết một chút về kinh nghiệm của bạn nhé!</div>
                  </Col>
                  <Col span={24}>
                    {
                      fields.map(({ key, name, ...restField }) =>
                        <Row className="d-flex" key={key} gutter={[16]}>
                          <Col span={23}>
                            <Form.Item
                              name={[name, 'Content']}
                              {...restField}
                              label={<div className="fw-600">Mô tả kinh nghiệm của bạn</div>}
                              rules={[
                                { required: true, message: "Thông tin không được để trống" },
                              ]}
                            >
                              <InputCustom placeHolder="Mô tả một chút về kinh nghiệm của bạn" />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <ButtonCircle
                              // disabled={user?.RegisterStatus !== 3 && !!user?.Experiences?.length ? true : false}
                              icon={ListIcons.ICON_DELETE}
                              onClick={() => remove(name)}
                            />
                          </Col>
                        </Row>
                      )
                    }
                  </Col>
                </Row>
              )}
            </Form.List>
          </Col>
          <Col span={24}>
            <Form.List name="educations">
              {(fields, { add, remove }) => (
                <Row gutter={[12]}>
                  <Col span={24} className="mb-12">
                    <div className="d-flex-sb">
                      <div className="fs-18 fw-600">Trình độ học vấn</div>
                      <ButtonCustom
                        className="third-type-2"
                        onClick={() => add()}
                      >
                        Thêm mô tả mới
                      </ButtonCustom>
                    </div>
                    <div>Hãy cho chúng tôi biết một chút về trình độ học vấn của bạn nhé!</div>
                  </Col>
                  <Col span={24}>
                    {
                      fields.map(({ key, name, ...restField }) =>
                        <Row className="d-flex" key={key} gutter={[16]}>
                          <Col span={23}>
                            <Form.Item
                              name={[name, 'Content']}
                              {...restField}
                              label={<div className="fw-600">Mô tả trình độ học vấn của bạn của bạn</div>}
                              rules={[
                                { required: true, message: "Thông tin không được để trống" },
                              ]}
                            >
                              <InputCustom placeHolder="Mô tả một chút về trình độ học vấn của bạn" />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <ButtonCircle
                              // disabled={user?.RegisterStatus !== 3 && !!user?.Experiences?.length ? true : false}
                              icon={ListIcons.ICON_DELETE}
                              onClick={() => remove(name)}
                            />
                          </Col>
                        </Row>
                      )
                    }
                  </Col>
                </Row>
              )}
            </Form.List>
          </Col>
          <Col span={24}>
            <div className="fs-18 fw-600 mb-8">Chọn môn học bạn giảng dạy</div>
            <Form.Item
              name="Subjects"
              rules={[
                { required: true, message: "Thông tin không được để trống" },
              ]}
            >
              <Select
                placeholder="Chọn môn học bạn giảng dạy"
                mode="multiple"
                style={{ width: "100%" }}
                onPopupScroll={e => {
                  const target = e.currentTarget
                  if (target.scrollHeight + target.scrollTop >= target.clientHeight) {
                    setPagination(pre => ({ ...pre, CurrentPage: pre.CurrentPage + 1 }))
                  }
                }}
                onSearch={(e) => {
                  if (timeOutRef.current) {
                    clearTimeout(timeOutRef.current)
                  }
                  timeOutRef.current = setTimeout(() => {
                    setPagination((pre) => ({ ...pre, TextSearch: e }))
                    timeOutRef.current = null
                  }, 400)
                }}
                filterOption={false}
              >
                {
                  subjects?.map(i =>
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
          </Col>
          <Col span={24}>
            <div className="fs-18 fw-600 mb-8">Tải lên chứng nhận/chứng chỉ của bạn</div>
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
          <Col span={24}>
            <div className="fs-18 fw-600 mb-8">Giới thiệu bản thân</div>
            <Form.Item
              name="Description"
              rules={[
                { required: true, message: "Thông tin không được để trống" },
              ]}
            >
              <InputCustom
                placeHolder="Mô tả một chút về bạn"
                type="isTextArea"
                style={{
                  height: "100px"
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {
        !!previewImage &&
        <PreviewImage
          open={previewImage}
          onCancel={() => setPreviewImage(false)}
        />
      }

    </ModalCustom>
  )
}

export default ModalChangeCareerInfor