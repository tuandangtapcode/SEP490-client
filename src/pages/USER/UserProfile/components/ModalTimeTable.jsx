
import { Col, message, Row, Space } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useDispatch, useSelector } from 'react-redux'
import ModalCustom from 'src/components/ModalCustom'
import dayjs from "dayjs"
import ButtonCustom from 'src/components/MyButton/ButtonCustom'
import UserService from 'src/services/UserService'
import globalSlice from 'src/redux/globalSlice'
import { toast } from 'react-toastify'
import { globalSelector } from 'src/redux/selector'
import Notice from 'src/components/Notice'
import { convertToCurrentEquivalent } from 'src/lib/dateUtils'

const localizer = momentLocalizer(moment)
moment.updateLocale('en', { week: { dow: 1 } })

const formats = {
  monthHeaderFormat: () => { }, // Định dạng tiêu đề tháng
  dayFormat: "dddd", // Định dạng hiển thị ngày trong ngày
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

  console.log("schedules", schedules);


  const handleChangeSchedules = async () => {
    try {
      setLoading(true)
      if (!schedules.length)
        return message.error("Hãy chọn lịch dạy cho bạn")
      if (schedules?.some(i => dayjs(i.end).diff(dayjs(i.start)) < 90)) {
        return Notice({
          msg: "Thời gian 1 buổi học không được dưới 90 phút",
          isSuccess: false
        })
      }
      const res = await UserService.updateSchedule({
        Schedules: schedules?.map(i => ({
          DateAt: dayjs(i?.start).format("dddd"),
          StartTime: dayjs(i?.start),
          EndTime: dayjs(i?.end),
        }))
      })
      if (!!res?.isError) return
      toast.success(res?.msg)
      dispatch(globalSlice.actions.setUser(res?.data))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!user?.Schedules?.length) {
      setSchedules(
        user?.Schedules?.map(i => {
          return {
            start: convertToCurrentEquivalent(new Date(i?.StartTime)),
            end: convertToCurrentEquivalent(new Date(i?.EndTime)),
            title: ""
          }
        })
      )
    }
  }, [user?.Schedules])


  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Cài đặt lịch học"
      width="80vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom className="third" onClick={onCancel}>
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
            style={{ width: "100%", height: 540 }}
            toolbar={false}
            defaultView={Views.WEEK}
            formats={formats}
            firstDayOfWeek={1}
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
