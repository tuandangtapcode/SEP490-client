import http from "../index"
import {
  apiCreateIssue,
  apiGetListIssue,
  apiHandleIssue
} from "./urls"

const createIssue = body => http.post(apiCreateIssue, body)
const getListIssue = body => http.post(apiGetListIssue, body)
const handleIssue = IssueID => http.get(`${apiHandleIssue}/${IssueID}`)

const IssueService = {
  createIssue,
  getListIssue,
  handleIssue
}

export default IssueService
