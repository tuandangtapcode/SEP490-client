import { Col, DatePicker, Form, Row, Space, TimePicker, Upload, message } from "antd"
import { useEffect, useState } from "react"
import ListIcons from "src/components/ListIcons"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import dayjs from "dayjs"
import TimeTableService from "src/services/TimeTableService"
import Notice from "src/components/Notice"
import { normFile } from "src/lib/fileUtils"
import { toast } from "react-toastify"
import FileService from "src/services/FileService"
import { disabledBeforeDate } from "src/lib/dateUtils"

const ModalChangeTimetable = ({
  open,
  onCancel,
  getTimeTable,
  onCancelModalDetail,
  setOpenModalDetailSchedule
}) => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    if (!!open?._id) {
      form.setFieldsValue({
        ...open,
        DateAt: dayjs(open?.DateAt),
        Time: [dayjs(open?.StartTime), dayjs(open?.EndTime)],
        Files: open?.Documents?.map(i => ({
          url: i?.DocPath,
          name: i?.DocName,
          _id: i?._id
        }))
      })
      setDocuments(open?.Documents)
    }
  }, [open])


  const handleBeforeUpload = async (file) => {
    const isAllowedType = file.type.includes("application")
    if (!isAllowedType) {
      message.error("Yêu cầu chọn file tài liệu (doc, docx, pdf, xls, xlsx)")
    }
    return isAllowedType ? false : Upload.LIST_IGNORE
  }

  const handleUpdateTimetable = async () => {
    try {
      setLoading(true)
      let documentResponse = []
      const values = await form.validateFields()
      if (dayjs(values?.Time[1]).diff(dayjs(values?.Time[0]), "minutes") < 90) {
        return Notice({
          msg: "Thời gian 1 buổi học không được dưới 90 phút",
          isSuccess: false
        })
      }
      if (!!values?.Files?.length) {
        const resFile = await FileService.uploadDocumentist({
          DocumentList: values?.Files?.map(i => i?.originFileObj)
        })
        if (resFile?.isError) return toast.error(resFile?.msg)
        documentResponse = resFile?.data
      }
      const dayGap = dayjs(values?.DateAt).startOf("days").diff(dayjs(values?.Time[0]).startOf("days"), "days")
      const res = await TimeTableService.updateTimeTable({
        TimeTableID: open?._id,
        DateAt: values?.DateAt,
        StartTime: dayjs(values?.Time[0]).add(dayGap, "days"),
        EndTime: dayjs(values?.Time[1]).add(dayGap, "days"),
        Documents: [
          ...documents,
          ...documentResponse
        ]
      })
      if (!!res?.isError) return toast.warning(res?.msg)
      toast.success(res?.msg)
      getTimeTable()
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chỉnh sửa lịch học"
      width="40vw"
      footer={
        <div className="d-flex-end">
          <Space>
            <ButtonCustom
              className="third"
              onClick={() => onCancel()}>
              Đóng
            </ButtonCustom>
            <ButtonCustom
              className="primary"
              loading={loading}
              onClick={() => handleUpdateTimetable()}
            >
              Lưu
            </ButtonCustom>
          </Space>
        </div>
      }
    >
      <Form form={form}>
        <Row>
          <Col span={5}>
            <div>Ngày học:</div>
          </Col>
          <Col span={17}>
            <Form.Item
              name="DateAt"
              rules={[
                { required: true, message: "Thông tin không được để trống!" }
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày học"
                format="dddd DD/MM/YYYY"
                disabledDate={current => { disabledBeforeDate(current) }}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <div>Thời gian học:</div>
          </Col>
          <Col span={17}>
            <Form.Item
              name="Time"
              rules={[
                { required: true, message: "Thông tin không được để trống!" }
              ]}
            >
              <TimePicker.RangePicker
                style={{ width: "100%" }}
                placeholder="Chọn giờ học"
                format="HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <div>Tài liệu:</div>
          </Col>
          <Col span={17}>
            <Form.Item
              name="Files"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                style={{ width: '100%' }}
                accept=".doc, .docx, .pdf, .xls, .xlsx"
                className="pointer"
                beforeUpload={file => handleBeforeUpload(file)}
                multiple={true}
                onRemove={file => {
                  if (!!file?._id) {
                    const copyFile = [...documents]
                    const newData = copyFile.filter(i => i?._id !== file?._id)
                    setDocuments(newData)
                  }
                }}
              >
                <div className="d-flex-center">
                  <div className="mr-8">
                    {ListIcons.ICON_CLOUD_UPLOAD}
                  </div>
                  <div>
                    <span className="cursor-pointer">Chọn file tài liệu</span>
                  </div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalCustom >
  )
}

export default ModalChangeTimetable