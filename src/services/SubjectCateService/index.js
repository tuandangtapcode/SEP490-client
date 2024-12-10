import http from "../index"
import {
  apiCreateSubjectCate,
  apiDeleteSubjectCate,
  apiGetDetailSubjectCate,
  apiGetListSubjectCate,
  apiGetListSubjectCateAndSubject,
  apiGetListSubjectCateByAdmin,
  apiUpdateSubjectCate,
} from "./urls"

const createSubjectCate = body => http.post(apiCreateSubjectCate, body)
const getListSubjectCate = body => http.post(apiGetListSubjectCate, body)
const updateSubjectCate = body => http.post(apiUpdateSubjectCate, body)
const deleteSubjectCate = body => http.post(apiDeleteSubjectCate, body)
const getListSubjectCateAndSubject = () => http.get(apiGetListSubjectCateAndSubject)
const getDetailSubjectCate = body => http.post(apiGetDetailSubjectCate, body)
const getListSubjectCateByAdmin = body => http.post(apiGetListSubjectCateByAdmin, body)

const SubjectCateService = {
  createSubjectCate,
  getListSubjectCate,
  deleteSubjectCate,
  updateSubjectCate,
  getListSubjectCateAndSubject,
  getDetailSubjectCate,
  getListSubjectCateByAdmin
}

export default SubjectCateService
