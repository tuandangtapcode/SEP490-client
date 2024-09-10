import http from "../index"
import {
  apiStatisticBooking,
  apiStatisticFinancial,
  apiStatisticNewRegisteredUser,
  apiStatisticTotalUser
} from "./urls"

const statisticNewRegisteredUser = params => http.get(`${apiStatisticNewRegisteredUser}?Key=${params}`)
const statisticTotalUser = body => http.post(apiStatisticTotalUser, body)
const statisticBooking = () => http.get(apiStatisticBooking)
const statisticFinancial = body => http.post(apiStatisticFinancial, body)

const StatisticService = {
  statisticNewRegisteredUser,
  statisticTotalUser,
  statisticBooking,
  statisticFinancial,
}

export default StatisticService
