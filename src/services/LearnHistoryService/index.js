import http from "../index"
import {
  apiCreateLearnHistory,
  apiGetListLearnHistory
} from "./urls"

const createLearnHistory = body => http.post(apiCreateLearnHistory, body)
const getListLearnHistory = body => http.post(apiGetListLearnHistory, body)

const LearnHistoryService = {
  createLearnHistory,
  getListLearnHistory
}

export default LearnHistoryService
