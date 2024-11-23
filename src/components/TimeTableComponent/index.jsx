
import moment from 'moment'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const formats = {
  monthHeaderFormat: () => { }, // Định dạng tiêu đề tháng
  dayFormat: "ddd", // Định dạng hiển thị ngày trong ngày
  dayHeaderFormat: () => { }, // Tiêu đề nagyf
  dayRangeHeaderFormat: () => { }, // Định dạng tiêu đề ngày khi chọn khoảng thời gian
  agendaDateFormat: () => { }, //Cột trong lịch làm việc
}

const TimeTableComponent = ({ schedules }) => {

  return (
    <>
      <Calendar
        localizer={localizer}
        startAccessor={event => {
          return new Date(event.start)
        }}
        endAccessor={event => {
          return new Date(event.end)
        }}
        style={{ width: "100%", height: 540 }}
        toolbar={false}
        defaultView={Views.WEEK}
        formats={formats}
        selectable
        events={schedules}
        onShowMore={(schedules, date) =>
          this.setState({ showModal: true, schedules })
        }
        min={new Date(new Date().setHours(6, 0, 0, 0))}
        max={new Date(new Date().setHours(23, 0, 0, 0))}
      />
    </>
  )
}

export default TimeTableComponent
