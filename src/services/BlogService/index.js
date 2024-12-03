import http from "../index"
import {
  apiCreateBlog,
  apiDeleteBlog,
  apiGetDetailBlog,
  apiGetListBlog,
  apiGetListBlogByUser,
  apiSendRequestReceive,
  apiUpdateBlog,
  apiChangeReceiveStatus,
  apiGetListBlogByTeacher,
  apiChangeRegisterStatus

} from "./urls"

const createBlog = body => http.post(apiCreateBlog, body)
const updateBlog = body => http.post(apiUpdateBlog, body)
const getListBlog = body => http.post(apiGetListBlog, body)
const getDetailBlog = BlogID => http.get(`${apiGetDetailBlog}/${BlogID}`)
const deleteBlog = BlogID => http.get(`${apiDeleteBlog}/${BlogID}`)
const getListBlogByUser = body => http.post(apiGetListBlogByUser, body)
const sendRequestReceive = BlogID => http.get(`${apiSendRequestReceive}/${BlogID}`)
const getListBlogByTeacher = body => http.post(apiGetListBlogByTeacher, body)
const changeReceiveStatus = body => http.post(apiChangeReceiveStatus, body)
const changeRegisterStatus = body => http.post(apiChangeRegisterStatus, body)


const BlogService = {
  createBlog,
  updateBlog,
  getListBlog,
  getDetailBlog,
  deleteBlog,
  getListBlogByUser,
  sendRequestReceive,
  getListBlogByTeacher,
  changeReceiveStatus,
  changeRegisterStatus
}

export default BlogService