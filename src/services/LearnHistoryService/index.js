import http from "../index"
import {
  apiCreateLearnHistory,
  apiGetDetailLearnHistory,
  apiGetListLearnHistory
} from "./urls"

const createLearnHistory = body => http.post(apiCreateLearnHistory, body)
const getListLearnHistory = body => http.post(apiGetListLearnHistory, body)
const getDetailLearnHistory = LearnHistoryID => http.get(`${apiGetDetailLearnHistory}/${LearnHistoryID}`)

const LearnHistoryService = {
  createLearnHistory,
  getListLearnHistory,
  getDetailLearnHistory
}

export default LearnHistoryService
