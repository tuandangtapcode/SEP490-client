import moment from "moment"
import { useEffect, useState } from "react"
import TimeTableService from "src/services/TimeTableService"
import {
  Calendar,
  Views,
  momentLocalizer,
} from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import SpinCustom from "src/components/SpinCustom"
import ModalDetailSchedule from "./components/ModalDetailSchedule"

const localizer = momentLocalizer(moment)
const messages = {
  allDay: "Cả ngày",
  previous: "Trước",
  next: "Tiếp",
  today: "Hôm nay",
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
  agenda: "Lịch học hôm nay",
  date: "Ngày",
  time: "Thời gian",
  event: "Sự kiện",
  "There are no events in this range.": "Không có",
}
const formats = {
  monthHeaderFormat: (date, culture, localizer) =>
    "Tháng " + localizer.format(date, "MM/YYYY", culture), // Định dạng tiêu đề tháng
  dayFormat: "ddd, DD/MM", // Định dạng hiển thị ngày trong ngày
  dayHeaderFormat: "dddd, DD/MM/YYYY", // Tiêu đề nagyf
  dayRangeHeaderFormat: ({ start, end }) =>
    `${moment(start).format("DD/MM/YYYY")} - ${moment(end).format(
      "DD/MM/YYYY",
    )}`, // Định dạng tiêu đề ngày khi chọn khoảng thời gian
  agendaDateFormat: (date, culture, localizer) =>
    localizer.format(date, "dddd, DD/MM/YYYY", culture), //Cột trong lịch làm việc
}

const SchedulePage = () => {

  const [loading, setLoading] = useState(false)
  const [timetables, setTimeTables] = useState([])
  const [buttonShow, setButtonShow] = useState()
  const [openModalDetailSchedule, setOpenModalDetailSchedule] = useState(false)

  const getTimeTable = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.getTimeTableByUser()
      if (res?.isError) return
      setTimeTables(
        res?.data?.List?.map(i => (
          {
            ...i,
            start: moment(i?.StartTime),
            end: moment(i?.EndTime),
            title: i?.Subject?.SubjectName,
          }
        ))
      )
      setButtonShow(res?.data?.ButtonShow)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTimeTable()
  }, [])

  return (
    <SpinCustom spinning={loading}>
      <Calendar
        localizer={localizer}
        events={timetables}
        startAccessor={event => {
          return new Date(event.start)
        }}
        endAccessor={event => {
          return new Date(event.end)
        }}
        style={{ width: "100%", height: 700 }}
        defaultView={Views.WEEK}
        onSelectEvent={event => setOpenModalDetailSchedule(event)}
        messages={messages}
        formats={formats}
        onShowMore={(timetables, date) =>
          this.setState({ showModal: true, timetables })
        }
      />

      {
        !!openModalDetailSchedule &&
        <ModalDetailSchedule
          open={openModalDetailSchedule}
          onCancel={() => setOpenModalDetailSchedule(false)}
          buttonShow={buttonShow}
          getTimeTable={getTimeTable}
        />
      }

    </SpinCustom>
  )
}

export default SchedulePage