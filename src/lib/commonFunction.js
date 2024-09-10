import CryptoJS from "crypto-js"
import Cookies from "js-cookie"
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

export const getCookie = (key) => {
  return Cookies.get(key)
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
  if (res?.isError) return
  socket.emit("user-logout", UserID)
  socket.disconnect()
  Cookies.remove("token")
  dispatch(globalSlice.actions.setUser({}))
  navigate('/dang-nhap')
}

const defaultDays = [
  {
    EngName: "Monday",
    ViName: "T2"
  },
  {
    EngName: "Tuesday",
    ViName: "T3"
  },
  {
    EngName: "Wednesday",
    ViName: "T4"
  },
  {
    EngName: "Thursday",
    ViName: "T5"
  },
  {
    EngName: "Friday",
    ViName: "T6"
  },
  {
    EngName: "Saturday",
    ViName: "T7"
  },
  {
    EngName: "Sunday",
    ViName: "CN"
  }
]
export const convertSchedules = (schedules) => {
  let newSchedules = []
  defaultDays.forEach(i => {
    const listTime = schedules?.filter(item => item.DateAt === i.EngName)
    if (!!listTime.length)
      newSchedules.push({
        DateAt: i.ViName,
        Times: listTime
      })
  })
  return newSchedules
}

export const getRealFee = (fee) => {
  return fee * 1.2
}

export const getTotalVote = (votes) => {
  const total = votes?.reduce(
    (value, currentValue) => value + currentValue,
    0
  )
  return total
}

export const getCurrentWeekRange = () => {
  const currentDate = new Date()
  const dayOfWeek = currentDate.getDay()
  const startOfWeek = new Date(currentDate)
  const endOfWeek = new Date(currentDate)
  const adjustedDayOfWeek = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(currentDate.getDate() - adjustedDayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)

  endOfWeek.setDate(currentDate.getDate() + (6 - adjustedDayOfWeek))
  endOfWeek.setHours(23, 59, 59, 999)

  return { startOfWeek, endOfWeek }
}
