import http from "../index"
import {
  apiStatisticTotalBooking,
  apiStatisticFinancial,
  apiStatisticNewRegisteredUser,
  apiStatisticTopTeacher,
  apiStatisticTotalUser,
  apiStatisticBooking
} from "./urls"

const statisticNewRegisteredUser = () => http.get(apiStatisticNewRegisteredUser)
const statisticTotalUser = () => http.get(apiStatisticTotalUser)
const statisticTotalBooking = () => http.get(apiStatisticTotalBooking)
const statisticFinancial = body => http.post(apiStatisticFinancial, body)
const statisticTopTeacher = () => http.get(apiStatisticTopTeacher)
const statisticBooking = body => http.post(apiStatisticBooking, body)

const StatisticService = {
  statisticNewRegisteredUser,
  statisticTotalUser,
  statisticTotalBooking,
  statisticFinancial,
  statisticTopTeacher,
  statisticBooking
}

export default StatisticService
