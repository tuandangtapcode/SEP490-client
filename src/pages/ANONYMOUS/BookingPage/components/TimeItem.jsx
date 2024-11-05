import { Tooltip } from "antd"
import { TimeItemStyled } from "../styled"
import dayjs from "dayjs"

const TimeItem = ({
  timeItem,
  selectedTimes,
  scheduleInWeek,
  handleSetScheduleInWeek,
  timeTablesStudent,
  handleSelectedTimes,
  isFixedSchedule,
}) => {

  return (
    <>
      {
        !!timeTablesStudent?.some(time =>
          dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
          dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
          ?
          <Tooltip title="Bạn đã có lịch học vào khung giờ này">
            <TimeItemStyled
              className={
                !!(!!isFixedSchedule ? scheduleInWeek : selectedTimes)?.some(item =>
                  dayjs(item?.StartTime).format("DD/MM/YYYY HH:mm") ===
                  dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                  ? "active"
                  : !!timeTablesStudent?.some(time =>
                    dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
                    dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                    ? "disabled"
                    : ""
              }
              onClick={() => {
                if (
                  !timeTablesStudent?.some(time =>
                    dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
                    dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                ) {
                  if (!isFixedSchedule) {
                    handleSelectedTimes(timeItem)
                  } else {
                    handleSetScheduleInWeek(timeItem)
                  }
                }
              }}
            >
              {dayjs(timeItem?.StartTime).format("HH:mm")} - {dayjs(timeItem?.EndTime).format("HH:mm")}
            </TimeItemStyled>
          </Tooltip>
          :
          <TimeItemStyled
            className={
              !!(!!isFixedSchedule ? scheduleInWeek : selectedTimes)?.some(item =>
                dayjs(item?.StartTime).format("DD/MM/YYYY HH:mm") ===
                dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                ? "active"
                : !!timeTablesStudent?.some(time =>
                  dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
                  dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                  ? "disabled"
                  : ""
            }
            onClick={() => {
              if (
                !timeTablesStudent?.some(time =>
                  dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
                  dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
              ) {
                if (!isFixedSchedule) {
                  handleSelectedTimes(timeItem)
                } else {
                  handleSetScheduleInWeek(timeItem)
                }
              }
            }}
          >
            {dayjs(timeItem?.StartTime).format("HH:mm")} - {dayjs(timeItem?.EndTime).format("HH:mm")}
          </TimeItemStyled>
      }
    </>
  )
}

export default TimeItem