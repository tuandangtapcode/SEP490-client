import http from "../index"
import {
  apiCreateSubject,
  apiDeleteSubject,
  apiGetListSubject,
  apiUpdateSubject,
} from "./urls"

const createSubject = body => http.post(apiCreateSubject, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
const getListSubject = body => http.post(apiGetListSubject, body)
const updateSubject = body => http.post(apiUpdateSubject, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
const deleteSubject = SubjectID => http.get(`${apiDeleteSubject}/${SubjectID}`)

const SubjectService = {
  createSubject,
  getListSubject,
  updateSubject,
  deleteSubject,
}

export default SubjectService
