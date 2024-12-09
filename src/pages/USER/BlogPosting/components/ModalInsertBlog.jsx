import { Col, Form, message, Row, Space, Select, DatePicker, InputNumber, Checkbox, TimePicker } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import BlogService from "src/services/BlogService"
import styled from "styled-components"
import SubjectService from "src/services/SubjectService"
import { STAFF_ID, SYSTEM_KEY } from "src/lib/constant"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { defaultDays, disabledBeforeDate } from "src/lib/dateUtils"
import dayjs from "dayjs"
import FormItem from "antd/es/form/FormItem"
import { getRealFee } from "src/lib/stringUtils"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import NotificationService from "src/services/NotificationService"
import socket from "src/utils/socket"

const StyleModal = styled.div`
  .ant-form-item-label {
    width: 50%;
    text-align: left;
  }
`

const ModalInsertBlog = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { listSystemKey, profitPercent, user } = useSelector(globalSelector)
  const [subjects, setSubjects] = useState([])
  const [slotInWeek, setSlotInWeek] = useState(0)
  const [scheduleInWeek, setScheduleInWeek] = useState([])
  const [isShowAddress, setIsShowAddress] = useState(false)

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getListSubject()
  }, [])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      if (!scheduleInWeek?.map(i => i?.DateValue)?.includes(new Date(values?.StartDate).getDay())) {
        return message.error("Ngày bắt đầu học không khớp với thời gian bạn chọn!")
      }
      const body = {
        Title: values?.Title,
        Subject: values?.Subject,
        Gender: values?.Gender,
        Price: values?.Price * 1000,
        ExpensePrice: getRealFee(values?.Price * 1000, profitPercent),
        NumberSlot: values?.NumberSlot,
        Address: values?.Address,
        StartDate: dayjs(values?.StartDate),
        LearnType: values?.LearnType,
        Schedules: scheduleInWeek,
        ProfessionalLevel: values?.ProfessionalLevel
      }
      const res = await BlogService.createBlog(body)
      if (!!res?.isError) {
        return ConfirmModal({
          description: `
            <div>${res?.msg}:</div>
            ${res?.data?.map(i =>
            `<div>${dayjs(i?.StartTime).format("DD/MM/YYYY")} ${dayjs(i?.StartTime).format("HH:mm")}-${dayjs(i?.EndTime).format("HH:mm")}</div>`
          ).join("")}
          `,
          isViewCancelBtn: false
        })
      }
      const resNotification = await NotificationService.createNotification({
        Content: `${user?.FullName} đã gửi yêu cầu duyệt bài đăng cho bạn`,
        Type: "blog",
        Receiver: STAFF_ID
      })
      if (!!resNotification?.isError) return
      socket.emit('send-notification',
        {
          Content: resNotification?.data?.Content,
          IsSeen: resNotification?.IsSeen,
          _id: resNotification?.data?._id,
          Type: resNotification?.data?.Type,
          IsNew: resNotification?.data?.IsNew,
          Receiver: STAFF_ID,
          createdAt: resNotification?.data?.createdAt
        })
      toast.success(res?.msg)
      onOk()
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  console.log("scheduleInWeek", scheduleInWeek);


  return (
    <ModalCustom
      title={!open?._id ? "Đăng bài tìm giáo viên" : "Cập nhật bài viết"}
      width={1000}

      open={open}
      onCancel={onCancel}
      footer={
        <Space className="d-flex-end">
          <ButtonCustom btntype="cancel" onClick={onCancel}>
            Hủy
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            onClick={async () => handleSubmit()}
          >
            Xác nhận
          </ButtonCustom>
        </Space>
      }
    >
      <SpinCustom spinning={loading}>
        <StyleModal>
          <Form form={form} layout="vertical">
            <Row gutter={[8, 0]}>
              <Col span={24}>
                <Form.Item
                  name="Subject"
                  label="Môn học:"
                  rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
                  <Select
                    showSearch
                    allowClear
                    placeholder="Chọn môn học"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {
                      subjects.map(subject => (
                        <Select.Option
                          key={subject._id}
                          value={subject._id}
                        >
                          {subject.SubjectName}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Title"
                  label="Tiêu đề:"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tiêu đề!' },
                  ]}
                >
                  <InputCustom placeholder="Nhập vào tiêu đề bài đăng" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="LearnType"
                  label="Hình thức học"
                  rules={[{ required: true, message: 'Vui lòng nhập hình thức học!' }]}
                >
                  <Checkbox.Group
                    mode='multiple'
                    onChange={e => {
                      if (e.includes(2)) {
                        setIsShowAddress(true)
                      } else {
                        setIsShowAddress(false)
                      }
                    }}
                  >
                    {
                      getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.map((i, idx) =>
                        <Checkbox key={idx} value={i?.ParentID}>{i?.ParentName}</Checkbox>
                      )
                    }
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={!!isShowAddress ? 24 : 0}>
                {
                  isShowAddress && (
                    <Form.Item
                      name="Address"
                      label="Địa chỉ"
                      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                      <InputCustom placeholder="Nhập địa chỉ của bạn" />
                    </Form.Item>
                  )
                }
              </Col>
              <Col span={6}>
                <Form.Item
                  name="ProfessionalLevel"
                  label="Trình độ:"
                  rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}>
                  <Select nplaceholder="Chọn trình độ">
                    {
                      getListComboKey(SYSTEM_KEY.PROFESSIONAL_LEVEL, listSystemKey).map(i => (
                        <Select.Option
                          key={i.ParentID}
                          value={i.ParentID}
                        >
                          {i?.ParentName}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="Price"
                  label="Giá tiền/buổi(VNĐ)"
                  rules={[
                    {
                      validator: (rule, value) => {
                        if (!value) {
                          return Promise.reject("Thông tin không được để trống")
                        }
                        const fee = parseInt(value)
                        if (isNaN(fee)) {
                          return Promise.reject("Vui lòng nhập vào số")
                        } else if (fee < 150) {
                          return Promise.reject("Số nhập vào phải lớn hơn hoặc bằng 1500")
                        }
                        return Promise.resolve()
                      }
                    },
                    { required: true, message: "Thông tin không được để trống" }
                  ]}
                >
                  <InputCustom
                    type="isNumber"
                    style={{ width: "100%" }}
                    suffix=".000"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="NumberSlot"
                  label="Tổng số buổi:"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số buổi!' },
                    { type: 'number', min: 1, message: 'Số buổi phải lớn hơn 0!' }
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="Gender"
                  label="Giới tính"
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                  <Checkbox.Group mode='multiple' style={{ width: "100%" }}>
                    {
                      getListComboKey(SYSTEM_KEY.GENDER, listSystemKey)?.map(i =>
                        <Checkbox key={i?.ParentID} value={i?.ParentID}>
                          {i?.ParentName}
                        </Checkbox>
                      )
                    }
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <FormItem>
                  <InputCustom
                    type="isNumber"
                    placeholder="Bạn muốn học bao nhiêu buổi 1 tuần?"
                    style={{
                      width: "350px",
                      marginBottom: "12px"
                    }}
                    value={!!slotInWeek ? slotInWeek : ""}
                    onChange={e => {
                      setSlotInWeek(e)
                      const newArray = Array.from({ length: e }, (_, index) => ({
                        DateValue: "",
                        StartTime: "",
                        EndTime: ""
                      }))
                      setScheduleInWeek(newArray)
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={24}>
                {
                  !!slotInWeek &&
                  scheduleInWeek.map((i, idx) =>
                    <Row gutter={[8, 0]} key={idx}>
                      <Col span={16}>
                        <Form.Item
                          name={`DateValue_${idx}`}
                          rules={[
                            { required: true, message: "Thông tin không được để trống!" }
                          ]}
                        >
                          <Select
                            placeholder="Chọn ngày học"
                            onChange={e => {
                              const copyScheduleInWeek = [...scheduleInWeek]
                              copyScheduleInWeek.splice(idx, 1, {
                                ...i,
                                DateValue: e
                              })
                              setScheduleInWeek(copyScheduleInWeek)
                            }}
                          >
                            {
                              defaultDays?.map(de => (
                                <Select.Option
                                  disabled={scheduleInWeek?.map(s => s?.DateValue)?.includes(de.value)}
                                  key={de?.value}
                                  value={de?.value}
                                >
                                  {de?.VieNameSpecific}
                                </Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={`Time_${idx}`}
                          rules={[
                            { required: true, message: "Thông tin không được để trống!" }
                          ]}
                        >
                          <TimePicker.RangePicker
                            style={{ width: "100%" }}
                            placeholder="Chọn giờ học"
                            allowClear={false}
                            format="HH:mm"
                            onChange={e => {
                              const dayGap = dayjs(i?.DateAt).startOf("days").diff(dayjs(e[0]).startOf("days"), "days")
                              const copyScheduleInWeek = [...scheduleInWeek]
                              copyScheduleInWeek.splice(idx, 1, {
                                ...i,
                                StartTime: dayjs(e[0]).add(dayGap, "days"),
                                EndTime: dayjs(e[1]).add(dayGap, "days"),
                              })
                              setScheduleInWeek(copyScheduleInWeek)
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )
                }
              </Col>
              <Col span={24}>
                {
                  !!scheduleInWeek?.length &&
                  !!scheduleInWeek?.every(i =>
                    i?.DateValue !== "" &&
                    i?.StartTime !== "" &&
                    i?.EndTime !== "") &&
                  <FormItem
                    name="StartDate"
                    rules={[
                      { required: true, message: "Thông tin không được để trống!" }
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày bắt đầu học"
                      format="DD/MM/YYYY"
                      disabledDate={current => disabledBeforeDate(current)}
                    />
                  </FormItem>
                }
              </Col>
            </Row>
          </Form>
        </StyleModal>
      </SpinCustom>
    </ModalCustom>
  )
}

export default ModalInsertBlog

