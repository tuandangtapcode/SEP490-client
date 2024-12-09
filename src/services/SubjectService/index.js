import http from "../index"
import {
  apiCreateSubject,
  apiDeleteSubject,
  apiGetDetailSubject,
  apiGetListSubject,
  apiGetListTopSubject,
  apiUpdateSubject,
} from "./urls"

const createSubject = body => http.post(apiCreateSubject, body)
const getListSubject = body => http.post(apiGetListSubject, body)
const updateSubject = body => http.post(apiUpdateSubject, body)
const deleteSubject = SubjectID => http.get(`${apiDeleteSubject}/${SubjectID}`)
const getDetailSubject = SubjectID => http.get(`${apiGetDetailSubject}/${SubjectID}`)
const getListTopSubject = () => http.get(apiGetListTopSubject)

const SubjectService = {
  createSubject,
  getListSubject,
  updateSubject,
  deleteSubject,
  getDetailSubject,
  getListTopSubject
}

export default SubjectService
