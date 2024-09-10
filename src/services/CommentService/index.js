import http from "../index"
import {
  apiCreateComment,
  apiDeleteComment,
  apiGetListCommentOfTeacher
} from "./urls"

const createComment = body => http.post(apiCreateComment, body)
const getListCommentOfTeacher = body => http.post(apiGetListCommentOfTeacher, body)
const deleteComment = CommentID => http.get(`${apiDeleteComment}/${CommentID}`)

const CommentService = {
  createComment,
  getListCommentOfTeacher,
  deleteComment
}

export default CommentService
