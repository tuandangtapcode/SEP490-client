import dayjs from "dayjs"

export const disabledBeforeDate = current => {
  return current && current <= dayjs().startOf("day")
}

export const disabledAfterDate = current => {
  return current && current >= dayjs().startOf("day")
}

export const defaultDays = [
  {
    EngName: "Monday",
    VieName: "T2",
    VieNameSpecific: "Thứ 2",
    value: 1
  },
  {
    EngName: "Tuesday",
    VieName: "T3",
    VieNameSpecific: "Thứ 3",
    value: 2
  },
  {
    EngName: "Wednesday",
    VieName: "T4",
    VieNameSpecific: "Thứ 4",
    value: 3
  },
  {
    EngName: "Thursday",
    VieName: "T5",
    VieNameSpecific: "Thứ 5",
    value: 4
  },
  {
    EngName: "Friday",
    VieName: "T6",
    VieNameSpecific: "Thứ 6",
    value: 5
  },
  {
    EngName: "Saturday",
    VieName: "T7",
    VieNameSpecific: "Thứ 7",
    value: 6
  },
  {
    EngName: "Sunday",
    VieName: "CN",
    VieNameSpecific: "Chủ nhật",
    value: 0
  }
]
export const convertSchedules = (schedules) => {
  let newSchedules = []
  defaultDays.forEach(i => {
    const listTime = schedules?.filter(item => item.DateAt === i.EngName)
    if (!!listTime.length)
      newSchedules.push({
        DateAt: i.VieName,
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
  const adjustedDayOfWeek = (dayOfWeek === 0) ? 6 : dayOfWeek - 1
  startOfWeek.setDate(currentDate.getDate() - adjustedDayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)

  endOfWeek.setDate(currentDate.getDate() + (6 - adjustedDayOfWeek))
  endOfWeek.setHours(23, 59, 59, 999)

  return { startOfWeek, endOfWeek }
}

export const convertToCurrentEquivalent = (date) => {
  const currentDate = new Date() // Ngày hiện tại
  const currentDayOfWeek = currentDate.getUTCDay() // Ngày trong tuần hiện tại (0 - Chủ nhật, 1 - Thứ hai, ...)
  // Tính ngày Thứ hai của tuần hiện tại
  const daysToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek // Nếu Chủ nhật thì đi tới Thứ hai tuần hiện tại
  const currentWeekMonday = new Date(currentDate)
  currentWeekMonday.setUTCDate(currentDate.getUTCDate() + daysToMonday)
  // Chuyển ngày nhập vào thành ngày tương ứng với tuần hiện tại
  const dayOfWeek = date.getUTCDay() // Ngày trong tuần của ngày cần chuyển đổi
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()
  const newDate = new Date(currentWeekMonday)
  newDate.setUTCDate(currentWeekMonday.getUTCDate() + (dayOfWeek === 0 ? 6 : dayOfWeek - 1)) // Nếu Chủ nhật, đặt là Thứ bảy
  newDate.setUTCHours(hours, minutes, seconds, 0)

  return newDate
}
