import http from "../index"
import {
  apiCreateFeedback,
  apiDeleteFeedback,
  apiGetListFeedbackOfTeacher
} from "./urls"

const createFeedback = body => http.post(apiCreateFeedback, body)
const getListFeedbackOfTeacher = body => http.post(apiGetListFeedbackOfTeacher, body)
const deleteFeedback = FeedbackID => http.get(`${apiDeleteFeedback}/${FeedbackID}`)

const FeedbackService = {
  createFeedback,
  getListFeedbackOfTeacher,
  deleteFeedback
}

export default FeedbackService
