
import { Col, message, Row, Space } from 'antd'
import moment from 'moment'
import { useState } from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useDispatch } from 'react-redux'
import ModalCustom from 'src/components/ModalCustom'
import dayjs from "dayjs"
import ButtonCustom from 'src/components/MyButton/ButtonCustom'
import UserService from 'src/services/UserService'
import globalSlice from 'src/redux/globalSlice'
import { toast } from 'react-toastify'


const localizer = momentLocalizer(moment)

const formats = {
  monthHeaderFormat: () => { }, // Định dạng tiêu đề tháng
  dayFormat: "ddd", // Định dạng hiển thị ngày trong ngày
  dayHeaderFormat: () => { }, // Tiêu đề nagyf
  dayRangeHeaderFormat: () => { }, // Định dạng tiêu đề ngày khi chọn khoảng thời gian
  agendaDateFormat: () => { }, //Cột trong lịch làm việc
}

const ModalTimeTable = ({
  open,
  onCancel,
  schedules,
  setSchedules
}) => {

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

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

  console.log("schedules", schedules);


  const handleChangeSchedules = async () => {
    try {
      setLoading(true)
      if (!schedules.length)
        return message.error("Hãy chọn lịch dạy cho bạn")
      const res = await UserService.changeProfile({
        Schedules:
          schedules?.map(i => ({
            DateAt: dayjs(i?.start).format("dddd"),
            StartTime: dayjs(i?.start),
            EndTime: dayjs(i?.end),
          }))
      })
      if (!!res?.isError) return
      toast.success("Lịch học đã được cập nhật thành công")
      dispatch(globalSlice.actions.setUser(res?.data))
    } finally {
      setLoading(false)
    }
  }


  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Cài đặt lịch học"
      width="80vw"
      footer={
        <Space direction="horizontal" className="d-flex-end">
          <ButtonCustom btnType="cancel" onClick={onCancel}>
            Đóng
          </ButtonCustom>
          <ButtonCustom
            loading={loading}
            className="primary"
            onClick={() => {
              handleChangeSchedules()
            }}
          >
            Lưu
          </ButtonCustom>
        </Space>
      }
    >
      <Row>
        <Col span={24}>
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
            min={new Date(new Date().setHours(6, 0, 0, 0))}
            max={new Date(new Date().setHours(23, 0, 0, 0))}
          />
        </Col>
      </Row>
    </ModalCustom>
  )
}

export default ModalTimeTable
