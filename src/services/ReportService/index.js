import http from "../index"
import {
  apiCreateReport,
  apiGetListReport,
  apiHandleReport
} from "./urls"

const createReport = body => http.post(apiCreateReport, body)
const getListReport = body => http.post(apiGetListReport, body)
const handleReport = ReportID => http.get(`${apiHandleReport}/${ReportID}`)

const ReportService = {
  createReport,
  getListReport,
  handleReport
}

export default ReportService
