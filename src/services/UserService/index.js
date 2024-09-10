import axios from "axios"
import http from "../index"
import {
  apiChangePassword,
  apiChangeProfile,
  apiGetDetailProfile,
  apiGetDetailTeacher,
  apiGetInforByGoogleLogin,
  apiGetListStudent,
  apiGetListTeacher,
  apiGetListTeacherBySubject,
  apiGetListTeacherByUser,
  apiInactiveOrActiveAccount,
  apiLogin,
  apiLoginByGoogle,
  apiLogout,
  apiPushOrPullSubjectForTeacher,
  apiRegister,
  apiRegisterByGoogle,
  apiRequestConfirmRegister,
  apiResponseConfirmRegister,
} from "./urls"

const getInforByGoogleLogin = (access_token) => axios.get(apiGetInforByGoogleLogin, {
  headers: {
    Authorization: `Bearer ${access_token}`
  }
})
const login = body => http.post(apiLogin, body)
const loginByGoogle = body => http.post(apiLoginByGoogle, body)
const register = body => http.post(apiRegister, body)
const registerByGoogle = body => http.post(apiRegisterByGoogle, body)
const logout = () => http.get(apiLogout)
const changePassword = body => http.post(apiChangePassword, body)
const getDetailProfile = () => http.get(apiGetDetailProfile)
const changeProfile = body => http.post(apiChangeProfile, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
const requestConfirmRegister = () => http.get(apiRequestConfirmRegister)
const responseConfirmRegister = body => http.post(apiResponseConfirmRegister, body)
const pushOrPullSubjectForTeacher = SubjectID => http.get(`${apiPushOrPullSubjectForTeacher}/${SubjectID}`)
const getListTeacher = body => http.post(apiGetListTeacher, body)
const getListTeacherBySubject = body => http.post(apiGetListTeacherBySubject, body)
const getDetailTeacher = body => http.post(apiGetDetailTeacher, body)
const getListTeacherByUser = body => http.post(apiGetListTeacherByUser, body)
const getListStudent = body => http.post(apiGetListStudent, body)
const inactiveOrActiveAccount = body => http.post(apiInactiveOrActiveAccount, body)

const UserService = {
  getInforByGoogleLogin,
  login,
  loginByGoogle,
  register,
  registerByGoogle,
  logout,
  changePassword,
  getDetailProfile,
  changeProfile,
  requestConfirmRegister,
  responseConfirmRegister,
  pushOrPullSubjectForTeacher,
  getListTeacher,
  getListTeacherBySubject,
  getDetailTeacher,
  getListTeacherByUser,
  getListStudent,
  inactiveOrActiveAccount
}

export default UserService
