import http from "../index"
import {
  apiChangeProfitPercent,
  apiGetListSystemKey,
  apiGetListTabs,
  apiGetProfitPercent,
  apiGetTotalUserAndSubject,
  apiTeacherRecommend,
  apiTeacherRecommendationByLearnHistory
} from "./urls"

const getListSystemkey = () => http.get(apiGetListSystemKey)
const getProfitPercent = () => http.get(apiGetProfitPercent)
const changeProfitPercent = body => http.post(apiChangeProfitPercent, body)
const teacherRecommend = body => http.post(apiTeacherRecommend, body)
const getListTabs = body => http.post(apiGetListTabs, body)
const teacherRecommendationByLearnHistory = () => http.get(apiTeacherRecommendationByLearnHistory)
const getTotalUserAndSubject = () => http.get(apiGetTotalUserAndSubject)

const CommonService = {
  getListSystemkey,
  getProfitPercent,
  changeProfitPercent,
  teacherRecommend,
  getListTabs,
  teacherRecommendationByLearnHistory,
  getTotalUserAndSubject,
}

export default CommonService
