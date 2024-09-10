import http from "../index"
import {
  apiCreateNotification,
  apiGetListNotification,
  apiChangeStatusNotification,
  apiSeenNotification
} from "./urls"

const createNotification = body => http.post(apiCreateNotification, body)
const changeStatusNotification = ReceiverID => http.get(`${apiChangeStatusNotification}/${ReceiverID}`)
const getListNotification = ReceiverID => http.get(`${apiGetListNotification}/${ReceiverID}`)
const seenNotification = body => http.post(apiSeenNotification, body)

const NotificationService = {
  createNotification,
  changeStatusNotification,
  getListNotification,
  seenNotification
}

export default NotificationService
