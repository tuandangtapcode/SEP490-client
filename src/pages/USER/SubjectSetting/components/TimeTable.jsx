
import { Col, Form, Row } from 'antd'
import moment from 'moment'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useSelector } from 'react-redux'
import { globalSelector } from 'src/redux/selector'


const localizer = momentLocalizer(moment)

const formats = {
  monthHeaderFormat: () => { }, // Định dạng tiêu đề tháng
  dayFormat: "ddd", // Định dạng hiển thị ngày trong ngày
  dayHeaderFormat: () => { }, // Tiêu đề nagyf
  dayRangeHeaderFormat: () => { }, // Định dạng tiêu đề ngày khi chọn khoảng thời gian
  agendaDateFormat: () => { }, //Cột trong lịch làm việc
}

const TimeTable = ({ schedules, setSchedules, }) => {

  const { user } = useSelector(globalSelector)

  const handleSelectSlot = ({ start, end }) => {
    // if (user?.RegisterStatus !== 3 && !!schedules.length) return
    setSchedules(prev => [...prev, { start, end, title: "" }])
  }

  const handleSelectEvent = ({ start }) => {
    // if (user?.RegisterStatus !== 3 && !!schedules.length) return
    const schedule = schedules?.find(i => i?.start === start)
    const newData = schedules?.filter(i => i?.start !== schedule?.start)
    setSchedules(newData)
  }

  return (
    <Col span={24}>
      <Row>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Lịch trình giảng dạy</div>
        </Col>
        <Col span={24}>
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
        </Col>
      </Row>
    </Col>
  )
}

export default TimeTable
