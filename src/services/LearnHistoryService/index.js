import http from "../index"
import {
  apiCreateLearnHistory,
  apiGetDetailLearnHistory,
  apiGetListLearnHistory,
  apiGetListLearnHistoryOfUser
} from "./urls"

const createLearnHistory = body => http.post(apiCreateLearnHistory, body)
const getListLearnHistory = body => http.post(apiGetListLearnHistory, body)
const getDetailLearnHistory = LearnHistoryID => http.get(`${apiGetDetailLearnHistory}/${LearnHistoryID}`)
const getListLearnHistoryOfUser = body => http.post(apiGetListLearnHistoryOfUser, body)

const LearnHistoryService = {
  createLearnHistory,
  getListLearnHistory,
  getDetailLearnHistory,
  getListLearnHistoryOfUser
}

export default LearnHistoryService
