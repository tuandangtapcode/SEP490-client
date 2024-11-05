import http from "../index"
import {
  apiChangeConfirmPaid,
  apiChangeConfirmStatus,
  apiCreateConfirm,
  apiGetDetailConfirm,
  apiGetListConfirm,
  apiUpdateConfirm
} from "./url"

const createConfirm = body => http.post(apiCreateConfirm, body)
const getListConfirm = body => http.post(apiGetListConfirm, body)
const changeConfirmStatus = body => http.post(apiChangeConfirmStatus, body)
const updateConfirm = body => http.post(apiUpdateConfirm, body)
const getDetailConfirm = ConfirmID => http.get(`${apiGetDetailConfirm}/${ConfirmID}`)
const changeConfirmPaid = ConfirmID => http.get(`${apiChangeConfirmPaid}/${ConfirmID}`)

const ConfirmService = {
  createConfirm,
  getListConfirm,
  changeConfirmStatus,
  updateConfirm,
  getDetailConfirm,
  changeConfirmPaid
}

export default ConfirmService
