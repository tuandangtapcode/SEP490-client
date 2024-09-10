import http from "../index"
import {
  apiCreateSubjectCate,
  apiDeleteSubjectCate,
  apiGetDetailSubjectCate,
  apiGetListSubjectCate,
  apiGetListSubjectCateAndSubject,
  apiUpdateSubjectCate,
} from "./urls"

const createSubjectCate = body => http.post(apiCreateSubjectCate, body)
const getListSubjectCate = body => http.post(apiGetListSubjectCate, body)
const updateSubjectCate = body => http.post(apiUpdateSubjectCate, body)
const deleteSubjectCate = SubjectCateID => http.get(`${apiDeleteSubjectCate}/${SubjectCateID}`)
const getListSubjectCateAndSubject = () => http.get(apiGetListSubjectCateAndSubject)
const getDetailSubjectCate = body => http.post(apiGetDetailSubjectCate, body)

const SubjectCateService = {
  createSubjectCate,
  getListSubjectCate,
  deleteSubjectCate,
  updateSubjectCate,
  getListSubjectCateAndSubject,
  getDetailSubjectCate,
}

export default SubjectCateService
