import http from "../index"
import {
  apiAttendanceOrCancelTimeTable,
  apiAttendanceTimeTable,
  apiCreateTimeTable,
  apiGetTimeTableByUser,
  apiGetTimeTableOfTeacherOrStudent,
  apiUpdateTimeTable
} from "./urls"

const createTimeTable = body => http.post(apiCreateTimeTable, body)
const getTimeTableOfTeacherOrStudent = body => http.post(apiGetTimeTableOfTeacherOrStudent, body)
const attendanceTimeTable = TimeTableID => http.get(`${apiAttendanceTimeTable}/${TimeTableID}`)
const updateTimeTable = body => http.post(apiUpdateTimeTable, body)
const getTimeTableByUser = body => http.post(apiGetTimeTableByUser, body)
const attendanceOrCancelTimeTable = body => http.post(apiAttendanceOrCancelTimeTable, body)

const TimeTableService = {
  createTimeTable,
  getTimeTableOfTeacherOrStudent,
  attendanceTimeTable,
  updateTimeTable,
  getTimeTableByUser,
  attendanceOrCancelTimeTable
}

export default TimeTableService
