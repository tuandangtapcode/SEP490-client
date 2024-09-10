import http from "../index"
import {
  apiAttendanceTimeTable,
  apiCreateTimeTable,
  apiGetTimeTableByUser,
  apiUpdateTimeTable
} from "./urls"

const createTimeTable = body => http.post(apiCreateTimeTable, body)
const getTimeTableByUser = () => http.get(apiGetTimeTableByUser)
const attendanceTimeTable = TimeTableID => http.get(`${apiAttendanceTimeTable}/${TimeTableID}`)
const updateTimeTable = body => http.post(apiUpdateTimeTable, body, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

const TimeTableService = {
  createTimeTable,
  getTimeTableByUser,
  attendanceTimeTable,
  updateTimeTable
}

export default TimeTableService
