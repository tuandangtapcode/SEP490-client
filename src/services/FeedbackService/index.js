import http from "../index"
import {
  apiCreateFeedback,
  apiDeleteFeedback,
  apiGetListFeedback,
  apiGetListFeedbackOfTeacher
} from "./urls"

const createFeedback = body => http.post(apiCreateFeedback, body)
const getListFeedbackOfTeacher = body => http.post(apiGetListFeedbackOfTeacher, body)
const deleteFeedback = FeedbackID => http.get(`${apiDeleteFeedback}/${FeedbackID}`)
const getListFeedback = body => http.post(apiGetListFeedback, body)

const FeedbackService = {
  createFeedback,
  getListFeedbackOfTeacher,
  deleteFeedback,
  getListFeedback
}

export default FeedbackService
