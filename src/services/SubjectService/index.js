import http from "../index"
import {
  apiCreateSubject,
  apiDeleteSubject,
  apiGetDetailSubject,
  apiGetListSubject,
  apiGetListSubjectByAdmin,
  apiGetListTopSubject,
  apiUpdateSubject,
} from "./urls"

const createSubject = body => http.post(apiCreateSubject, body)
const getListSubject = body => http.post(apiGetListSubject, body)
const updateSubject = body => http.post(apiUpdateSubject, body)
const deleteSubject = body => http.post(apiDeleteSubject, body)
const getDetailSubject = SubjectID => http.get(`${apiGetDetailSubject}/${SubjectID}`)
const getListTopSubject = () => http.get(apiGetListTopSubject)
const getListSubjectByAdmin = body => http.post(apiGetListSubjectByAdmin, body)

const SubjectService = {
  createSubject,
  getListSubject,
  updateSubject,
  deleteSubject,
  getDetailSubject,
  getListTopSubject,
  getListSubjectByAdmin
}

export default SubjectService
