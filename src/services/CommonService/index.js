import http from "../index"
import {
  apiGetListSystemKey
} from "./urls"

const getListSystemkey = () => http.get(apiGetListSystemKey)

const CommonService = {
  getListSystemkey
}

export default CommonService
