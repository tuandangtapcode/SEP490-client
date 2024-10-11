import axios from "axios"
import http from "../index"
import {
  apiChangePassword,
  apiChangeProfile,
  apiCreateSubjectSetting,
  apiDeleteSubjectSetting,
  apiGetDetailProfile,
  apiGetDetailTeacher,
  apiGetInforByGoogleLogin,
  apiGetListStudent,
  apiGetListTeacher,
  apiGetListTeacherBySubject,
  apiGetListTeacherByUser,
  apiGetListTeacherInWeek,
  apiGetListSubjectSettingByTeacher,
  apiInactiveOrActiveAccount,
  apiLogin,
  apiLoginByGoogle,
  apiLogout,
  apiRegister,
  apiRequestConfirmRegister,
  apiResponseConfirmRegister,
  apiUpdateSubjectSetting,
  apiConfirmSubjectSetting,
  apiCheckAuth,
} from "./urls"

const getInforByGoogleLogin = (access_token) => axios.get(apiGetInforByGoogleLogin, {
  headers: {
    Authorization: `Bearer ${access_token}`
  }
})
const login = body => http.post(apiLogin, body)
const checkAuth = () => http.get(apiCheckAuth)
const loginByGoogle = body => http.post(apiLoginByGoogle, body)
const register = body => http.post(apiRegister, body)
const logout = () => http.get(apiLogout)
const changePassword = body => http.post(apiChangePassword, body)
const getDetailProfile = () => http.get(apiGetDetailProfile)
const changeProfile = body => http.post(apiChangeProfile, body)
const requestConfirmRegister = () => http.get(apiRequestConfirmRegister)
const responseConfirmRegister = body => http.post(apiResponseConfirmRegister, body)
const getListTeacher = body => http.post(apiGetListTeacher, body)
const getListTeacherBySubject = body => http.post(apiGetListTeacherBySubject, body)
const getDetailTeacher = body => http.post(apiGetDetailTeacher, body)
const getListTeacherByUser = body => http.post(apiGetListTeacherByUser, body)
const getListStudent = body => http.post(apiGetListStudent, body)
const inactiveOrActiveAccount = body => http.post(apiInactiveOrActiveAccount, body)
const getListTeacherInWeek = body => http.post(apiGetListTeacherInWeek, body)
const getListSubjectSettingByTeacher = body => http.get(apiGetListSubjectSettingByTeacher, body)
const createSubjectSetting = SubjectID => http.get(`${apiCreateSubjectSetting}/${SubjectID}`)
const updateSubjectSetting = body => http.post(apiUpdateSubjectSetting, body)
const deleteSubjectSetting = SubjectSettingID => http.get(`${apiDeleteSubjectSetting}/${SubjectSettingID}`)
const confirmSubjectSetting = body => http.post(apiConfirmSubjectSetting, body)

const UserService = {
  getInforByGoogleLogin,
  login,
  checkAuth,
  loginByGoogle,
  register,
  logout,
  changePassword,
  getDetailProfile,
  changeProfile,
  requestConfirmRegister,
  responseConfirmRegister,
  getListTeacher,
  getListTeacherBySubject,
  getDetailTeacher,
  getListTeacherByUser,
  getListStudent,
  inactiveOrActiveAccount,
  getListTeacherInWeek,
  getListSubjectSettingByTeacher,
  createSubjectSetting,
  updateSubjectSetting,
  deleteSubjectSetting,
  confirmSubjectSetting
}

export default UserService
