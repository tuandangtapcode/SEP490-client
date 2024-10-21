import { randomNumber } from "./commonFunction"
import moment from "moment"
import QueryString from "qs"
import CryptoJS from "crypto-js"

const VNP_TMN_Code = import.meta.env.VITE_VNP_TMNCODE
const VNP_Hashsecret = import.meta.env.VITE_VNP_HASHSECRET
const VNP_Url = import.meta.env.VITE_VNP_URL

const sortObject = (obj) => {
  let sorted = {}
  let str = []
  let key
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+")
  }
  return sorted
}

const handleCreatePaymentVNPay = (orderInfo, amount, returnUrl, ipAddress) => {
  let vnp_Params
  vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP_TMN_Code,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: randomNumber(),
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: +amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddress,
    vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
  }
  vnp_Params = sortObject(vnp_Params)
  let signData = QueryString.stringify(vnp_Params, { encode: false })
  let hmac = CryptoJS.HmacSHA512(signData, VNP_Hashsecret)
  let signed = CryptoJS.enc.Hex.stringify(hmac)
  vnp_Params['vnp_SecureHash'] = signed
  const vnpURL = `${VNP_Url}?${QueryString.stringify(vnp_Params, { encode: false })}`
  window.location.href = vnpURL
}

export default handleCreatePaymentVNPay
