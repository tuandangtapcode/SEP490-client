import http from "../index"
import {
  apiCreateSubject,
  apiDeleteSubject,
  apiGetListRecommendSubject,
  apiGetListSubject,
  apiUpdateSubject,
} from "./urls"

const createSubject = body => http.post(apiCreateSubject, body)
const getListSubject = body => http.post(apiGetListSubject, body)
const updateSubject = body => http.post(apiUpdateSubject, body)
const deleteSubject = SubjectID => http.get(`${apiDeleteSubject}/${SubjectID}`)
const getListRecommendSubject = () => http.post(apiGetListRecommendSubject, {})

const SubjectService = {
  createSubject,
  getListSubject,
  updateSubject,
  deleteSubject,
  getListRecommendSubject
}

export default SubjectService
