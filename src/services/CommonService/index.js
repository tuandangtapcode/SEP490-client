import http from "../index"
import {
  apiChangeProfitPercent,
  apiGetListSystemKey,
  apiGetProfitPercent
} from "./urls"

const getListSystemkey = () => http.get(apiGetListSystemKey)
const getProfitPercent = () => http.get(apiGetProfitPercent)
const changeProfitPercent = body => http.post(apiChangeProfitPercent, body)

const CommonService = {
  getListSystemkey,
  getProfitPercent,
  changeProfitPercent
}

export default CommonService
