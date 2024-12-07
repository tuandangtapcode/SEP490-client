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
  apiChangeRegisterStatus,
  apiGetListBlogApproval,
  apiChangeBlogPaid
} from "./urls"

const createBlog = body => http.post(apiCreateBlog, body)
const updateBlog = body => http.post(apiUpdateBlog, body)
const getListBlog = body => http.post(apiGetListBlog, body)
const getDetailBlog = BlogID => http.get(`${apiGetDetailBlog}/${BlogID}`)
const deleteBlog = body => http.post(apiDeleteBlog, body)
const getListBlogByUser = body => http.post(apiGetListBlogByUser, body)
const sendRequestReceive = BlogID => http.get(`${apiSendRequestReceive}/${BlogID}`)
const getListBlogByTeacher = body => http.post(apiGetListBlogByTeacher, body)
const changeReceiveStatus = body => http.post(apiChangeReceiveStatus, body)
const changeRegisterStatus = body => http.post(apiChangeRegisterStatus, body)
const getListBlogApproval = body => http.post(apiGetListBlogApproval, body)
const changeBlogPaid = BlogID => http.get(`${apiChangeBlogPaid}/${BlogID}`)

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
  changeRegisterStatus,
  getListBlogApproval,
  changeBlogPaid
}

export default BlogService