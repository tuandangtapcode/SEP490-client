import http from "../index"
import {
  apiUploadDocumentList,
  apiUploadFileList,
  apiUploadFileSingle
} from "./urls"

const uploadFileList = body => http.post(apiUploadFileList, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
const uploadFileSingle = body => http.post(apiUploadFileSingle, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
const uploadDocumentist = body => http.post(apiUploadDocumentList, body, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})

const FileService = {
  uploadFileList,
  uploadFileSingle,
  uploadDocumentist
}

export default FileService
