import http from "../index"
import {
  apiCreateCourse,
  apiDeleteCourse,
  apiGetListCourse,
  apiGetListCourseByTeacher,
  apiGetListCourseOfTeacher,
  apiUpdateCourse
} from "./urls"

const createCourse = body => http.post(apiCreateCourse, body)
const updateCourse = body => http.post(apiUpdateCourse, body)
const deleteCourse = body => http.post(apiDeleteCourse, body)
const getListCourse = body => http.post(apiGetListCourse, body)
const getListCourseByTeacher = body => http.post(apiGetListCourseByTeacher, body)
const getListCourseOfTeacher = body => http.post(apiGetListCourseOfTeacher, body)

const CourseService = {
  createCourse,
  updateCourse,
  deleteCourse,
  getListCourse,
  getListCourseByTeacher,
  getListCourseOfTeacher
}

export default CourseService
