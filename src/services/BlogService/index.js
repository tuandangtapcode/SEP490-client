import http from "../index"
import {
  apiCreateBlog,
  apiDeleteBlog,
  apiGetBlogDetail,
  apiGetListBlog,
  apiGetListBlogOfUser,
  apiUpdateBlog
} from "./urls"

const createBlog = body => http.post(apiCreateBlog, body)
const updateBlog = body => http.post(apiUpdateBlog, body)
const getListBlog = body => http.post(apiGetListBlog, body)
const getDetailBlog = params => http.get(`${apiGetBlogDetail}/${params}`)
const deleteBlog = params => http.get(`${apiDeleteBlog}/${params}`)
const followBlog = body => http.post(apiGetListBlog, body)
const getListBlogOfUser = body => http.post(apiGetListBlogOfUser, body)

const BlogService = {
  createBlog,
  updateBlog,
  getListBlog,
  getDetailBlog,
  deleteBlog,
  followBlog,
  getListBlogOfUser,
}

export default BlogService