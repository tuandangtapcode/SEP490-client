import http from "../index"
import { apiCreateConfirm } from "./url"

const createConfirm = body => http.post(apiCreateConfirm, body)

const ConfirmService = {
  createConfirm
}

export default ConfirmService
