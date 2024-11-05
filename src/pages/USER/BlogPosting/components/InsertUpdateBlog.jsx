import { Col, Form, message, Row, Space, Upload, Radio, Slider, Select, Input,DatePicker, Button,InputNumber } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import BlogService from "src/services/BlogService"
import styled from "styled-components"
import SubjectService from "src/services/SubjectService"
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
  const [subjects, setSubjects] = useState([]); // Để lưu danh sách môn học
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  // const handlePriceChange = (value) => {
  //   setPriceRange(value);
  // };
  
  const [schedules, setSchedules] = useState([{ DateAt: null, StartTime: null, EndTime: null }]); // Để lưu lịch
  useEffect(() => {
    if (!!open?._id) {
      form.setFieldsValue(open)
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
      
  },[]);
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
      const body = {
        BlogID: !!open?._id ? open?._id : undefined,
        Title: values?.Title,
        Content: values?.Content,
        Subject:values?.Subject,
        Gender:values?.Gender,
        Price:values?.Price,
        NumberSlot:values?.NumberSlot,
        Address:values?.Address,

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
        </ButtonCustom>
        <ButtonCustom btnType="cancel" onClick={onCancel}>
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
              <Form.Item name="Subject" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
        <Select>
          {subjects.map(subject => (
            <Option key={subject._id} value={subject._id}>{subject.SubjectName}</Option>
          ))}
        </Select>
      </Form.Item>
<Form.Item name="Title" label="Tóm tắt yêu cầu" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!'}]}>
        <Input  onChange={(e) => {
      const value = e.target.value;
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 20) {
        message.warning('Tiêu đề không được vượt quá 20 từ!');
      } else {
        form.setFieldsValue({ Title: value });
      }
    }}/>
      </Form.Item>

<Form.Item name="Content" label="Mô tả chi tiết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
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
      {/* <Form.Item name="Price" label="Học phí mỗi buổi (VNĐ):" rules={[{ required: true, message: 'Vui lòng chọn khoảng giá!' }]}>
      <Slider
    range       
    min={0}  
    max={1000000} 
    step={50000}  
    defaultValue={priceRange} 
    // tooltipVisible 
    onChange={handlePriceChange}
    tipFormatter={formatCurrency}
  />
      </Form.Item> */}

      <Form.Item name="Price" label="Học phí mỗi buổi (VNĐ):" rules={[{ required: true, message: 'Vui lòng chọn giá!' }]}>
  <Row gutter={16}>
    <Col span={18}>
      <Slider
        min={0}  
        max={1000000} 
        step={50000}
        value={priceRange} 
        onChange={(value) => {
          setPriceRange(value);
        }}
        tipFormatter={formatCurrency}
      />
    </Col>
    <Col span={6}>
      <InputNumber 
        min={0}
        max={1000000}
        step={50000}
        value={priceRange} 
        onChange={(value) => {
          setPriceRange(value);
        }} 
        formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
        parser={(value) => value.replace(/\./g, '')}
      /><span style={{marginLeft: 10}}>VNĐ</span>
    </Col>
  </Row>
</Form.Item>
      <Row gutter={16}>
          <Col span={7}>
      <Form.Item name="Gender" label="Giới tính học viên" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
        <Select>
          <Option value={1}>Nam</Option>
          <Option value={2}>Nữ</Option>
        </Select>
      </Form.Item>
</Col>
          <Col span={5}>
      <Form.Item name="NumberSlot" label="Số buổi" rules={[
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
          <Col span={12} >
          <Form.Item name="Address" label="Địa chỉ">
        <Input/>
      </Form.Item>

</Col>
</Row>
      
      {/* <Form.Item name="LearnType" label="hình thức học" rules={[{ required: true, message: 'Vui lòng nhập loại học!' }]}>
        <Input />
      </Form.Item> */}

      <Form.Item label="Lịch học">
        {schedules.map((schedule, index) => (
          <div key={index}>
            <DatePicker onChange={(date, dateString) => {
              const newSchedules = [...schedules];
              newSchedules[index].DateAt = dateString;
              setSchedules(newSchedules);
            }} />
            <DatePicker showTime format="HH:mm" onChange={(time, timeString) => {
              const newSchedules = [...schedules];
              newSchedules[index].StartTime = timeString;
              setSchedules(newSchedules);
            }} />
            <DatePicker showTime format="HH:mm" onChange={(time, timeString) => {
              const newSchedules = [...schedules];
              newSchedules[index].EndTime = timeString;
              setSchedules(newSchedules);
            }} />
          </div>
        ))}
        <Button type="dashed" onClick={addSchedule}>
          Thêm lịch
        </Button>
      </Form.Item>
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
