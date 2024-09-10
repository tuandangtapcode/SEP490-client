
import { Checkbox, Col, Form, InputNumber, Row, Select } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useSelector } from 'react-redux'
import InputCustom from 'src/components/InputCustom'
import ButtonCustom from 'src/components/MyButton/ButtonCustom'
import { getListComboKey, getRealFee } from 'src/lib/commonFunction'
import { SYSTEM_KEY } from 'src/lib/constant'
import { formatMoney } from 'src/lib/stringUtils'
import { globalSelector } from 'src/redux/selector'
import dayjs from "dayjs"

const { Option } = Select

const localizer = momentLocalizer(moment)

const formats = {
  monthHeaderFormat: () => { }, // Định dạng tiêu đề tháng
  dayFormat: "ddd", // Định dạng hiển thị ngày trong ngày
  dayHeaderFormat: () => { }, // Tiêu đề nagyf
  dayRangeHeaderFormat: () => { }, // Định dạng tiêu đề ngày khi chọn khoảng thời gian
  agendaDateFormat: () => { }, //Cột trong lịch làm việc
}

const TimeTable = ({
  changeProfile,
  schedules,
  setSchedules,
}) => {

  const { user } = useSelector(globalSelector)
  const [totalFee, setTotalFee] = useState(0)
  const { listSystemKey } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [learnTypes, setLearnTypes] = useState([])

  useEffect(() => {
    form.setFieldsValue({
      Price: user?.Price,
      LearnTypes: user?.LearnTypes,
      Address: user?.Address
    })
    if (!!user?.Schedules?.length) {
      const getDayFormSchedule = user?.Schedules?.find(i => i?.DateAt === dayjs().format("dddd"))
      setSchedules(
        user?.Schedules?.map(i => {
          const dayGap = dayjs().startOf("day").diff(dayjs(getDayFormSchedule?.StartTime).startOf("day"), "days")
          return {
            start: dayGap > 5
              ? dayjs(i?.StartTime).add(dayGap, "days")
              : dayjs(i?.StartTime),
            end: dayGap > 5
              ? dayjs(i?.EndTime).add(dayGap, "days")
              : dayjs(i?.EndTime),
            title: ""
          }
        })
      )
    }
    if (!!user?.Price) {
      setTotalFee(getRealFee(user?.Price) * 1000)
    }
    setLearnTypes(user?.LearnTypes)
  }, [])

  const handleSelectSlot = ({ start, end }) => {
    if (user?.RegisterStatus !== 3 && !!schedules.length) return
    setSchedules(prev => [...prev, { start, end, title: "" }])
  }

  const handleSelectEvent = ({ start }) => {
    if (user?.RegisterStatus !== 3 && !!schedules.length) return
    const schedule = schedules?.find(i => i?.start === start)
    const newData = schedules?.filter(i => i?.start !== schedule?.start)
    setSchedules(newData)
  }

  return (
    <Form form={form}>
      <div className='fw-600 fs-16'>Chọn thời gian biểu cho bạn</div>
      <div className='fs-14 gray-text mb-12'>
        Chọn thời gian rảnh của bạn cho từng địa điểm giảng dạy mà bạn đã chọn trước đó. Học sinh sẽ chỉ có thể yêu cầu giờ học trong số giờ trên lịch sẵn có của bạn. Để thu hút được nhiều học sinh nhất, hãy đảm bảo bạn có ít nhất 10 giờ học.
      </div>
      <Form.Item
        name='Schedules'
        rules={[
          { required: !!schedules?.length ? false : true, message: "Hãy chọn thời gian biểu cho mình" },
        ]}
      >
        <Calendar
          localizer={localizer}
          startAccessor={event => {
            return new Date(event.start)
          }}
          endAccessor={event => {
            return new Date(event.end)
          }}
          style={{ width: "100%", height: 700 }}
          toolbar={false}
          defaultView={Views.WEEK}
          formats={formats}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          events={schedules}
          onShowMore={(schedules, date) =>
            this.setState({ showModal: true, schedules })
          }
        />
      </Form.Item>
      <div className='fw-600 fs-16'>Hình thức học</div>
      <div className='fs-14 gray-text mb-12'>
        Bạn có thể chọn học online hoặc học offline hoặc cả hai
      </div>
      <Form.Item name="LearnTypes">
        <Checkbox.Group
          disabled={user?.RegisterStatus !== 3 && !!user?.LearnTypes?.length ? true : false}
          mode='multiple'
          onChange={e => setLearnTypes(e)}
        >
          {getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.map((i, idx) =>
            <Checkbox key={idx} value={i?.ParentID}>{i?.ParentName}</Checkbox>
          )}
        </Checkbox.Group>
      </Form.Item>
      {
        !!learnTypes.includes(2) &&
        <Form.Item
          name="Address"
          rules={[
            {
              required: !!learnTypes.includes(2) ? true : false,
              message: "Bạn phải điền địa chỉ nếu dạy offline"
            }
          ]}
        >
          <InputCustom
            placeholder="Địa chỉ"
            disabled={user?.RegisterStatus !== 3 && !!user?.Address ? true : false}
          />
        </Form.Item>
      }
      <div className='fw-600 fs-16'>Chọn số tiền bạn muốn kiếm được cho mỗi buổi học</div>
      <div className='fs-14 gray-text mb-12'>
        Nhập số tiền bạn muốn kiếm được cho mỗi buổi học bạn dạy và chúng tôi sẽ cộng chi phí tiếp thị và dịch vụ của chúng tôi để tính mức giá mà học sinh phải trả.
      </div>
      <div className='mb-16'>
        <Row>
          <Col xxl={3} xl={4} lg={6} md={8} sm={10} xs={12}>
            <div className='fw-600 fs-14 mb-8'>Số tiền bạn nhận được</div>
            <Form.Item
              name='Price'
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
                      return Promise.reject("Số nhập vào phải lớn hơn hoặc bằng 150")
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <InputNumber
                disabled={user?.RegisterStatus !== 3 && !!user?.Price ? true : false}
                style={{ width: "100%" }}
                type='isNumber'
                suffix=".000 VNĐ"
                onBlur={e => {
                  form.setFieldValue("Price", formatMoney(e.target.value))
                }}
                onChange={e => setTotalFee(getRealFee(e) * 1000)}
              />
            </Form.Item>
          </Col>
        </Row>
        <div>
          <div className='fw-600 fs-13'>Số tiền học sinh cần trả</div>
          <div>
            <span>{formatMoney(totalFee)}</span>
            <span> VNĐ</span>
          </div>
        </div>
      </div>
      <ButtonCustom
        className="medium-size primary fw-700"
        loading={loading}
        onClick={() => changeProfile(form, setLoading)}
      >
        {
          user?.RegisterStatus !== 3
            ? !!user?.Schedules?.length && !!user?.Price && !!user?.LearnTypes?.length
              ? "Hoàn thành"
              : "Lưu"
            : "Cập nhật"
        }
      </ButtonCustom>
    </Form >
  )
}

export default TimeTable
