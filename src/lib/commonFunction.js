import CryptoJS from "crypto-js"
import globalSlice from "src/redux/globalSlice"
import UserService from "src/services/UserService"
import socket from "src/utils/socket"

const HashKey = import.meta.env.VITE_HASH_KEY
const ChecksumKey = import.meta.env.VITE_BANK_CHECKSUMKEY

export const randomNumber = () => {
  const min = 100000
  const max = 999999
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

export const getListComboKey = (key, listSystemKey) => {
  const parent = listSystemKey?.find(i => i?.KeyName === key)
  if (!!parent)
    return parent?.Parents
  return []
}

export const decodeData = data_hashed => {
  const decryptedBytes = CryptoJS.AES.decrypt(
    data_hashed,
    HashKey,
  )
  return JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8))
}

export const generateSignature = (data) => {
  const hmac = CryptoJS.HmacSHA256(data, ChecksumKey)
  const signature = hmac.toString(CryptoJS.enc.Hex)
  return signature
}

export const handleLogout = async (UserID, dispatch, navigate) => {
  const res = await UserService.logout()
  if (!!res?.isError) return
  socket.emit("user-logout", UserID)
  socket.disconnect()
  dispatch(globalSlice.actions.setIsLogin(false))
  dispatch(globalSlice.actions.setUser({}))
  navigate('/dang-nhap')
}

export const getTotalVote = (votes) => {
  const total = votes?.reduce(
    (value, currentValue) => value + currentValue,
    0
  )
  return total
}
