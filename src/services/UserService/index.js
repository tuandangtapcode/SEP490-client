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
  apiCheckAuth,
  apiGetListTopTeacher,
  apiForgotPassword,
  apiChangeCareerInformation,
  apiUpdateSchedule,
  apiGetListSubjectSetting,
  apiResponseConfirmSubjectSetting,
  apiDisabledOrEnabledSubjectSetting,
  apiCreateAccountStaff,
  apiGetListAccountStaff,
  apiResetPasswordAccountStaff,
  apiUpdateAccountStaff,
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
const forgotPassword = body => http.post(apiForgotPassword, body)
const getDetailProfile = () => http.get(apiGetDetailProfile)
const changeProfile = body => http.post(apiChangeProfile, body)
const requestConfirmRegister = () => http.get(apiRequestConfirmRegister)
const responseConfirmRegister = body => http.post(apiResponseConfirmRegister, body)
const getListTeacher = body => http.post(apiGetListTeacher, body)
const getDetailTeacher = body => http.post(apiGetDetailTeacher, body)
const getListTeacherByUser = body => http.post(apiGetListTeacherByUser, body)
const getListStudent = body => http.post(apiGetListStudent, body)
const inactiveOrActiveAccount = body => http.post(apiInactiveOrActiveAccount, body)
const getListTeacherInWeek = body => http.post(apiGetListTeacherInWeek, body)
const getListSubjectSettingByTeacher = body => http.get(apiGetListSubjectSettingByTeacher, body)
const createSubjectSetting = SubjectID => http.get(`${apiCreateSubjectSetting}/${SubjectID}`)
const updateSubjectSetting = body => http.post(apiUpdateSubjectSetting, body)
const deleteSubjectSetting = SubjectSettingID => http.get(`${apiDeleteSubjectSetting}/${SubjectSettingID}`)
const responseConfirmSubjectSetting = body => http.post(apiResponseConfirmSubjectSetting, body)
const getListTopTeacher = body => http.post(apiGetListTopTeacher, body)
const changeCareerInformation = body => http.post(apiChangeCareerInformation, body)
const updateSchedule = body => http.post(apiUpdateSchedule, body)
const getListSubjectSetting = body => http.post(apiGetListSubjectSetting, body)
const disabledOrEnabledSubjectSetting = body => http.post(apiDisabledOrEnabledSubjectSetting, body)
const createAccountStaff = body => http.post(apiCreateAccountStaff, body)
const getListAccountStaff = body => http.post(apiGetListAccountStaff, body)
const resetPasswordAccountStaff = UserID => http.get(`${apiResetPasswordAccountStaff}/${UserID}`)
const updateAccountStaff = body => http.post(apiUpdateAccountStaff, body)

const UserService = {
  getInforByGoogleLogin,
  login,
  checkAuth,
  loginByGoogle,
  register,
  logout,
  changePassword,
  forgotPassword,
  getDetailProfile,
  changeProfile,
  requestConfirmRegister,
  responseConfirmRegister,
  getListTeacher,
  getDetailTeacher,
  getListTeacherByUser,
  getListStudent,
  inactiveOrActiveAccount,
  getListTeacherInWeek,
  getListSubjectSettingByTeacher,
  createSubjectSetting,
  updateSubjectSetting,
  deleteSubjectSetting,
  responseConfirmSubjectSetting,
  getListTopTeacher,
  changeCareerInformation,
  updateSchedule,
  getListSubjectSetting,
  disabledOrEnabledSubjectSetting,
  createAccountStaff,
  getListAccountStaff,
  resetPasswordAccountStaff,
  updateAccountStaff
}

export default UserService
