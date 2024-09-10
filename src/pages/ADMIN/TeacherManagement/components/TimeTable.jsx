
import { Col, Empty, Form, Input, InputNumber, Row } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useSelector } from 'react-redux'
import ButtonCustom from 'src/components/MyButton/ButtonCustom'
import { getListComboKey } from 'src/lib/commonFunction'
import { SYSTEM_KEY } from 'src/lib/constant'
import { formatMoney } from 'src/lib/stringUtils'
import { globalSelector } from 'src/redux/selector'

const localizer = momentLocalizer(moment)

const formats = {
  monthHeaderFormat: () => { }, // Định dạng tiêu đề tháng
  dayFormat: "ddd", // Định dạng hiển thị ngày trong ngày
  dayHeaderFormat: () => { }, // Tiêu đề nagyf
  dayRangeHeaderFormat: () => { }, // Định dạng tiêu đề ngày khi chọn khoảng thời gian
  agendaDateFormat: () => { }, //Cột trong lịch làm việc
}

const TimeTable = ({ user }) => {

  const { listSystemKey } = useSelector(globalSelector)
  const [schedules, setSchedules] = useState([])
  const parentKeyLearnType = getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)

  useEffect(() => {
    if (!!user?.Schedules?.length) {
      setSchedules(
        user?.Schedules?.map(i => {
          const dayGap = moment(moment().startOf("day")).diff(moment(moment(user?.Schedules[0]?.StartTime).startOf("day")), "days")
          return {
            start: dayGap > 5
              ? moment(i?.StartTime).add(dayGap, "days")
              : moment(i?.StartTime),
            end: dayGap > 5
              ? moment(i?.EndTime).add(dayGap, "days")
              : moment(i?.EndTime),
            title: ""
          }
        })
      )
    }
  }, [])

  return (
    <div className='p-12'>
      <div className='fw-600 fs-18 mb-8'>Thời khóa biểu của {user?.FullName}</div>
      {!!schedules?.length
        ?
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
          events={schedules}
          onShowMore={(schedules, date) =>
            this.setState({ showModal: true, schedules })
          }
        />
        : <Empty description={`${user?.FullName} chưa điền thông tin này`} />
      }
      <div className='fw-600 fs-18 mt-12'>Số tiền {user?.FullName} muốn cho 1 buổi học</div>
      {!!user?.Price
        ? <>
          <div>
            Số tiền {user?.FullName} yêu cầu: {user?.Price}.000 VNĐ
          </div>
          <div>
            Số tiền học sinh cần thanh toán: {(+user?.Price) + (+user?.Price * 20 / 100)}.000 VNĐ
          </div>
        </>
        : <Empty description={`${user?.FullName} chưa điền thông tin này`} />
      }
      <div className='fw-600 fs-18 mt-12'>Hình thức học:</div>
      {
        parentKeyLearnType?.map((item, idx) => {
          if (user?.LearnTypes?.includes(item?.ParentID))
            return <span key={idx} className='mr-8'>{item?.ParentName}</span>
        })
      }
    </div >
  )
}

export default TimeTable
