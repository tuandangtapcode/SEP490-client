import http from "../index"
import {
  apiChangeProfitPercent,
  apiGetListSystemKey,
  apiGetProfitPercent,
  apiTeacherRecommend
} from "./urls"

const getListSystemkey = () => http.get(apiGetListSystemKey)
const getProfitPercent = () => http.get(apiGetProfitPercent)
const changeProfitPercent = body => http.post(apiChangeProfitPercent, body)
const teacherRecommend = body => http.post(apiTeacherRecommend, body)

const CommonService = {
  getListSystemkey,
  getProfitPercent,
  changeProfitPercent,
  teacherRecommend
}

export default CommonService
