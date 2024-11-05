import { Col, Form, message, Row, Space, Upload, Radio, Slider, Select, Input, DatePicker, Button, InputNumber, TimePicker } from "antd"
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
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [price, setPrice] = useState(0);
  const [showAddress, setShowAddress] = useState(false);

  const [schedules, setSchedules] = useState([{ DateAt: null, StartTime: null, EndTime: null }]);
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
    const learnTypes = form.getFieldValue('LearnTypes') || [];
    setShowAddress(learnTypes.includes(2));
  }, [form.getFieldValue('LearnTypes')]);

  const addSchedule = () => {
    setSchedules([...schedules, { DateAt: null, StartTime: null, EndTime: null }]);
  };
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return `${value.toLocaleString('vi-VN')} VNĐ`;
  };
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const formattedSchedules = schedules.map((schedule) => ({
        DateAt: moment(schedule.DateAt, "YYYY-MM-DD").toDate(),
        StartTime: moment(schedule.StartTime, "HH:mm").format("HH:mm"),
        EndTime: moment(schedule.EndTime, "HH:mm").format("HH:mm"),
      }));
      const body = {
        BlogID: !!open?._id ? open?._id : undefined,
        Title: values?.Title,
        Content: values?.Content,
        Subject: values?.Subject,
        Gender: values?.Gender,
        Price: price,
        NumberSlot: values?.NumberSlot,
        NumberSlotOfWeek: values?.NumberSlotOfWeek,
        Address: values?.Address,
        LearnTypes: values?.LearnTypes,
        Schedules: formattedSchedules,
      }
      const res = !!open?._id
        ? await BlogService.updateBlog(body)
        : await BlogService.createBlog(body)
      if (!!res?.isError) return toast.error(res?.msg)
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
          Đăng bài
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
                <Form.Item name="Title" label="Tóm tắt yêu cầu:" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
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

                <Form.Item name="Content" label="Mô tả chi tiết yêu cầu:" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
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
                      <Form.Item  name="NumberSlot" label="Tổng số buổi:" rules={[
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
                    <Form.Item name="LearnTypes" label="Hình thức học" rules={[{ required: true, message: 'Vui lòng nhập hình thức học!' }]}>
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
                <h3>Thời gian học</h3>
                <Button onClick={addSchedule}>Thêm lịch</Button>
                {schedules.map((schedule, index) => (
                  <Row key={index} gutter={16}>
                    <Col span={6}>
                      <Form.Item label="Ngày:" style={{ marginBottom: 0 }}>
                        <DatePicker
                          format={"dddd"}
                          onChange={(date) => {
                            const updatedSchedules = [...schedules];
                            updatedSchedules[index].DateAt = date ? date.format("YYYY-MM-DD") : null;
                            setSchedules(updatedSchedules);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item label="Giờ bắt đầu:" style={{ marginBottom: 0 }}>
                        <TimePicker
                          showTime format="HH:mm"
                          onChange={(time) => {
                            const updatedSchedules = [...schedules];
                            updatedSchedules[index].StartTime = time ? time.format("HH:mm") : null;
                            setSchedules(updatedSchedules);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item label="Giờ kết thúc:" style={{ marginBottom: 0 }}>
                        <TimePicker
                          showTime format="HH:mm"
                          onChange={(time) => {
                            const updatedSchedules = [...schedules];
                            updatedSchedules[index].EndTime = time ? time.format("HH:mm") : null;
                            setSchedules(updatedSchedules);
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>
            <div>
              <h2>Yêu cầu giáo viên</h2>
            </div>
            <Col span={4}>
              <div style={{ borderBottom: "2px solid #000", margin: "10px 0" }}></div>
            </Col>
        <Row gutter={16}>
        <Col span={24}>

        </Col>

        </Row>


          </Form>
        </StyleModal>
      </SpinCustom>
    </ModalCustom>
  )
}

export default InsertUpdateBlog;

