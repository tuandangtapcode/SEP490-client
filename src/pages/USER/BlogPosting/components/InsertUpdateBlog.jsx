import { Col, Form, message, Empty, Row, Space, Upload, Radio, Slider, Select, Input, DatePicker, Button, InputNumber } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import BlogService from "src/services/BlogService"
import styled from "styled-components"
import SubjectService from "src/services/SubjectService"
import moment from "moment";
import { disabledBeforeDate } from "src/lib/dateUtils"
import dayjs from "dayjs";
import FormItem from "antd/es/form/FormItem"
const { RangePicker } = DatePicker;
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
  const [subjects, setSubjects] = useState([]);
  const [selectDate, setSelectDate] = useState();
  const [slotInWeek, setSlotInWeek] = useState(0)
  const [scheduleInWeek, setScheduleInWeek] = useState([])
  const [selectedTimes, setSelectedTimes] = useState([])

  const [price, setPrice] = useState(0);
  const [showAddress, setShowAddress] = useState(false);

  const [schedules, setSchedules] = useState([{ StartTime: null, EndTime: null }]);
  useEffect(() => {
    if (!!open?._id) {
      form.setFieldsValue(open)
      setPrice(open.Price);
    }

  }, [open])
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

  }, []);

  useEffect(() => {
    const learnType = form.getFieldValue('LearnType') || [];
    setShowAddress(learnType.includes(2));
  }, [form.getFieldValue('LearnType')]);

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return `${value.toLocaleString('vi-VN')} VNĐ`;
  };

  const handleTimeChange = (index, { StartTime, EndTime }) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index].StartTime = StartTime ? StartTime.format("YYYY-MM-DD HH:mm") : null;
    updatedSchedules[index].EndTime = EndTime ? EndTime.format("YYYY-MM-DD HH:mm") : null;
    console.log("Updated schedules:", updatedSchedules);
    setSchedules(updatedSchedules);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (schedules.length === 0) {
        throw new Error("Bạn cần thêm ít nhất một lịch học.");
        return;
      }
      
      const formattedSchedules = schedules.map((schedule) => {
        if (!schedule.StartTime || !schedule.EndTime) {
          throw new Error("Thời gian bắt đầu và kết thúc không được để trống.");
        }
        const start = moment(schedule.StartTime, "YYYY-MM-DD HH:mm");
  const end = moment(schedule.EndTime, "YYYY-MM-DD HH:mm");

  if (!start.isBefore(end)) {
    throw new Error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
  }
        const diffInHours = end.diff(start, "hours", true);
        if (diffInHours < 1) {
          throw new Error("Thời gian học phải ít nhất 1 giờ.");
        }
        return {
          StartTime: schedule.StartTime, 
          EndTime: schedule.EndTime,
        };
      });

      const body = {
        BlogID: !!open?._id ? open?._id : undefined,
        Title: values?.Title,
        Content: values?.Content,
        Subject: values?.Subject,
        // Gender: Array.isArray(values.Gender)
        //   ? values.Gender.map((value) => Number(value)).filter((value) => [1, 2].includes(value))
        //   : [],
        Gender: values?.Gender,
        Price: price,
        NumberSlot: values?.NumberSlot,
        Address: values?.Address,
        LearnType: values?.LearnType,
        Schedules: formattedSchedules,
      };
        const res = !!open?._id
        ? await BlogService.updateBlog(body)
        : await BlogService.createBlog(body)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      onOk()
      onCancel()
    } finally {
      setLoading(false);
    }
  };


  const renderFooter = () => (
    <div className="d-flex-center">
      <Space direction="horizontal">
        <ButtonCustom
          className="primary"
          onClick={() => {
            handleSubmit()
          }}
        >
          Đăng bài
        </ButtonCustom>
        <ButtonCustom btntype="cancel" onClick={onCancel}>
          Hủy
        </ButtonCustom>
      </Space>
    </div>
  )
  return (
    <ModalCustom
      title={!open?._id ? "Đăng bài tìm giáo viên" : "Cập nhật bài viết"}
      width={1000}

      open={open}
      onCancel={onCancel}
      footer={renderFooter()}
    >
      <SpinCustom spinning={loading}>
        <StyleModal>

          <h2>Mô tả yêu cầu tìm giáo viên</h2>
          <Col span={7}>
            <div style={{ borderBottom: "2px solid #000", margin: "10px 0" }}></div>
          </Col>

          <Form form={form} layout="vertical" initialValues={{}}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="Subject" label="Môn học:" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
                  <Select
                    showSearch
                    placeholder="Chọn môn học"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {subjects.map(subject => (
                      <Select.Option key={subject._id} value={subject._id}>{subject.SubjectName}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="Title" label="Tiêu đề:" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                  <Input onChange={(e) => {
                    const value = e.target.value;
                    const wordCount = value.trim().split(/\s+/).length;
                    if (wordCount > 30) {
                      message.warning('Tiêu đề không được vượt quá 30 từ!');
                    } else {
                      form.setFieldsValue({ Title: value });
                    }
                  }} />
                </Form.Item>

                <Form.Item name="Content" label="Mô tả chi tiết:" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                  <InputCustom type="isTextArea"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length > 300) {
                        message.warning('Nội dung không được vượt quá 300 ký tự!');
                      } else {
                        form.setFieldsValue({ Content: value });
                      }
                    }}
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name="Price" label="Học phí mỗi buổi (VNĐ):" rules={[{ required: true, message: 'Vui lòng chọn giá!' }]}>
                      <InputNumber
                        min={0}
                        max={1000000}
                        step={50000}
                        value={price}
                        onChange={(value) => {
                          setPrice(value);
                          form.setFieldsValue({ Price: value });
                        }}
                        formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
                        parser={(value) => value.replace(/\./g, '')}
                      /><span style={{ marginLeft: 10 }}>VNĐ</span>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name="NumberSlot" label="Tổng số buổi:" rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số buổi!'
                      },
                      {
                        type: 'number',
                        min: 1,
                        message: 'Số buổi phải lớn hơn hoặc bằng 1!'
                      }
                    ]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name="NumberSlotOfWeek" label="Số buổi học/Tuần:" rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số buổi!'
                      },
                      {
                        type: 'number',
                        min: 1,
                        max: 10,
                        message: 'Số buổi phải lớn hơn hoặc bằng 1!'
                      }
                    ]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item style={{ width: "100%" }} labelAlign="right" name="Gender" label="Yêu cầu giới tính giáo viên" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                      <Select>
                        <Select.Option value={0}>Nam</Select.Option>
                        <Select.Option value={1}>Nữ</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>


                  <Col span={12}>
                    <Form.Item name="LearnType" label="Hình thức học" rules={[{ required: true, message: 'Vui lòng nhập hình thức học!' }]}>
                      <Select
                        mode="multiple"
                        placeholder="Chọn hình thức học"
                        onChange={(value) => {
                          setShowAddress(value.includes(2)); // Cập nhật showAddress dựa trên giá trị chọn
                        }}
                      >
                        <Select.Option value={1}>Học online</Select.Option>
                        <Select.Option value={2}>Học offline</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {showAddress && (
                      <Form.Item name="Address" label="Địa chỉ" rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập địa chỉ'
                        }
                      ]}>
                        <Input />
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name="Price" label="Học phí mỗi buổi (VNĐ):" rules={[{ required: true, message: 'Vui lòng chọn giá!' }]}>
                      <InputNumber
                        min={0}
                        max={1000000}
                        step={50000}
                        value={price}
                        onChange={(value) => {
                          setPrice(value);
                          form.setFieldsValue({ Price: value });
                        }}
                        formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
                        parser={(value) => value.replace(/\./g, '')}
                      /><span style={{ marginLeft: 10 }}>VNĐ</span>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name="NumberSlot" label="Tổng số buổi:" rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số buổi!'
                      },
                      {
                        type: 'number',
                        min: 1,
                        message: 'Số buổi phải lớn hơn 0!'
                      }
                    ]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item style={{ width: "100%" }} labelAlign="right" name="Gender" label="Yêu cầu giới tính giáo viên" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                      <Select
                      mode="multiple">
                        <Select.Option value={1}>Nam</Select.Option>
                        <Select.Option value={2}>Nữ</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <FormItem >
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
                      id: index + 1,
                      StartTime: "",
                      EndTime: "",
                      Times: []
                    }))
                    setScheduleInWeek(newArray)
                    setSelectedTimes([])
                  }}
                />
                </FormItem>
                  
                
                {
                  !!slotInWeek &&
                  scheduleInWeek.map((i, idxScheduleInWeek) =>
                    <Row gutter={16} key={idxScheduleInWeek}>
                      <Col span={14}>
                        <Form.Item>
                          <DatePicker.RangePicker
                            showTime={{ format: "HH:mm" }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                            onChange={(dateRange) => {
                              if (dateRange && dateRange.length === 2) {
                                const [startDate, endDate] = dateRange;
                                const diffInHours = endDate.diff(startDate, "hours", true); 
      
                                if (!startDate.isSame(endDate, "day")) {
                                  alert("Ngày bắt đầu và ngày kết thúc phải cùng một ngày.");
                                  return;
                                }
if (diffInHours < 1.5) {
        toast.error("Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 tiếng.");
        return; 
      }
                                handleTimeChange(idxScheduleInWeek, {
                                  StartTime: startDate,
                                  EndTime: endDate,
                                });
                              } else {
                                handleTimeChange(idxScheduleInWeek, { StartTime: null, EndTime: null });
                              }
                            }}
                            disabledTime={(currentDate) => {
    if (!currentDate) return {};

    const startTime = form.getFieldValue(["schedules", idxScheduleInWeek, "StartTime"]);
    if (!startTime) return {}; 

    const minEndTime = moment(startTime).add(1, "hours"); 
    const maxEndTime = moment(startTime).endOf("day"); 

    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          if (i < minEndTime.hour() || i > maxEndTime.hour()) {
            hours.push(i);
          }
        }
        return hours;
      },
      disabledMinutes: (hour) => {
        if (hour === minEndTime.hour()) {
          // Không cho chọn phút trước phút tối thiểu trong giờ tối thiểu
          return Array.from({ length: minEndTime.minute() }, (_, i) => i);
        }
        return [];
      },
    };
  }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )
                }
              </Col>
            </Row>
          </Form>
        </StyleModal>
      </SpinCustom>
    </ModalCustom>
  )
}

export default InsertUpdateBlog;

