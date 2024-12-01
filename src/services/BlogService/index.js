import http from "../index"
import {
  apiCreateBlog,
  apiDeleteBlog,
  apiGetDetailBlog,
  apiGetListBlog,
  apiGetListBlogOfUser,
  apiSendRequestReceive,
  apiUpdateBlog,
  apiChangeReceiveStatus,
  apiGetListBlogByStudent,
  apiGetListBlogByTeacher,
  apiChangeRegisterStatus

} from "./urls"

const createBlog = body => http.post(apiCreateBlog, body)
const updateBlog = body => http.post(apiUpdateBlog, body)
const getListBlog = body => http.post(apiGetListBlog, body)
// const getDetailBlog = params => {
//   console.log("Fetching blog detail with params:", params);
//   http.get(`${apiGetDetailBlog}/${params}`)}
const getDetailBlog = (params) => {
  const url = `${apiGetDetailBlog}/${params}`;
  // console.log("Fetching from URL:", url); 
  return http.get(url); 
};
const deleteBlog = params => http.get(`${apiDeleteBlog}/${params}`)
// const followBlog = body => http.post(apiGetListBlog, body)
const getListBlogOfUser = body => http.post(apiGetListBlogOfUser, body)
const sendRequestReceive = params => {
  http.get(`${apiSendRequestReceive}/${params}`)
}
const getListBlogByStudent = body => http.post(apiGetListBlogByStudent, body)
const getListBlogByTeacher = body => http.post(apiGetListBlogByTeacher, body)

const changeReceiveStatus = body => http.post(apiChangeReceiveStatus, body)
const changeRegisterStatus = body => http.post(apiChangeRegisterStatus, body)


const BlogService = {
  createBlog,
  updateBlog,
  getListBlog,
  getDetailBlog,
  deleteBlog,
  // followBlog,
  getListBlogOfUser,
  sendRequestReceive,
  getListBlogByStudent,
  getListBlogByTeacher,
  changeReceiveStatus,
  changeRegisterStatus
}

export default BlogService