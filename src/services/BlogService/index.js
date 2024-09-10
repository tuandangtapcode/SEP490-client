import http from "../index"
import {
  apiCreateBlog,
  apiDeleteBlog,
  apiGetBlogDetail,
  apiGetListBlog,
  apiGetListBlogOfTeacher,
  apiUpdateBlog
} from "./urls"

const createBlog = body => http.post(apiCreateBlog, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
const updateBlog = body => http.post(apiUpdateBlog, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
const getListBlog = body => http.post(apiGetListBlog, body)
const getDetailBlog = params => http.get(`${apiGetBlogDetail}/${params}`)
const deleteBlog = params => http.get(`${apiDeleteBlog}/${params}`)
const followBlog = body => http.post(apiGetListBlog, body)
const getListBlogOfTeacher = body => http.post(apiGetListBlogOfTeacher, body)

const BlogService = {
  createBlog,
  updateBlog,
  getListBlog,
  getDetailBlog,
  deleteBlog,
  followBlog,
  getListBlogOfTeacher,
}

export default BlogService