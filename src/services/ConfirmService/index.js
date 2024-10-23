import http from "../index"
import {
  apiChangeConfirmStatus,
  apiCreateConfirm,
  apiGetListConfirm,
  apiUpdateConfirm
} from "./url"

const createConfirm = body => http.post(apiCreateConfirm, body)
const getListConfirm = body => http.post(apiGetListConfirm, body)
const changeConfirmStatus = body => http.post(apiChangeConfirmStatus, body)
const updateConfirm = body => http.post(apiUpdateConfirm, body)

const ConfirmService = {
  createConfirm,
  getListConfirm,
  changeConfirmStatus,
  updateConfirm
}

export default ConfirmService
