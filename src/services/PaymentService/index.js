import http from "../index"
import axios from "axios"
import {
  apiCreatePaymentLink,
  apiCreatePayment,
  apiGetListPaymentHistoryByUser,
  apiChangePaymentStatus,
  apiGetListPayment,
  apiExportExcel,
  apiGetListTransfer,
  apiSendRequestExplanation
} from "./urls"

const ClientID = import.meta.env.VITE_PAYOS_CLIENT_ID
const APIKey = import.meta.env.VITE_PAYOS_API_KEY

const createPaymentLink = body => axios.post(apiCreatePaymentLink, body, {
  headers: {
    "x-client-id": ClientID,
    "x-api-key": APIKey
  }
})
const getDetailPaymentLink = PaymentLinkID => axios.get(`${apiCreatePaymentLink}/${PaymentLinkID}`, {
  headers: {
    "x-client-id": ClientID,
    "x-api-key": APIKey
  }
})
const createPayment = body => http.post(apiCreatePayment, body)
const getListPaymentHistoryByUser = body => http.post(apiGetListPaymentHistoryByUser, body)
const changePaymentStatus = body => http.post(apiChangePaymentStatus, body)
const getListPayment = body => http.post(apiGetListPayment, body)
const exportExcel = () => http.get(apiExportExcel, {
  responseType: 'blob',
})
const getListTransfer = body => http.post(apiGetListTransfer, body)
const sendRequestExplanation = body => http.post(apiSendRequestExplanation, body)

const PaymentService = {
  createPaymentLink,
  getDetailPaymentLink,
  createPayment,
  getListPaymentHistoryByUser,
  changePaymentStatus,
  getListPayment,
  exportExcel,
  getListTransfer,
  sendRequestExplanation
}

export default PaymentService
