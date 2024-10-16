import dayjs from "dayjs"

export const disabledBeforeDate = current => {
  return current && current <= dayjs().startOf("day")
}

export const disabledAfterDate = current => {
  return current && current >= dayjs().startOf("day")
}

const defaultDays = [
  {
    EngName: "Monday",
    ViName: "T2"
  },
  {
    EngName: "Tuesday",
    ViName: "T3"
  },
  {
    EngName: "Wednesday",
    ViName: "T4"
  },
  {
    EngName: "Thursday",
    ViName: "T5"
  },
  {
    EngName: "Friday",
    ViName: "T6"
  },
  {
    EngName: "Saturday",
    ViName: "T7"
  },
  {
    EngName: "Sunday",
    ViName: "CN"
  }
]
export const convertSchedules = (schedules) => {
  let newSchedules = []
  defaultDays.forEach(i => {
    const listTime = schedules?.filter(item => item.DateAt === i.EngName)
    if (!!listTime.length)
      newSchedules.push({
        DateAt: i.ViName,
        Times: listTime
      })
  })
  return newSchedules
}

export const getCurrentWeekRange = () => {
  const currentDate = new Date()
  const dayOfWeek = currentDate.getDay()
  const startOfWeek = new Date(currentDate)
  const endOfWeek = new Date(currentDate)
  const adjustedDayOfWeek = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(currentDate.getDate() - adjustedDayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)

  endOfWeek.setDate(currentDate.getDate() + (6 - adjustedDayOfWeek))
  endOfWeek.setHours(23, 59, 59, 999)

  return { startOfWeek, endOfWeek }
}
