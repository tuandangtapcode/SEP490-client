import http from "../index"
import {
  apiCreateMessage,
  apiGetChatOfAdmin,
  apiGetChatOfUser,
  apiGetChatWithUser,
  apiGetMessageByChat,
  apiSeenMessage
} from "./urls"

const createMessage = body => http.post(apiCreateMessage, body)
const getMessageByChat = body => http.post(apiGetMessageByChat, body)
const getChatWithUser = body => http.post(apiGetChatWithUser, body)
const getChatOfAdmin = () => http.get(apiGetChatOfAdmin)
const seenMessage = ChatID => http.get(`${apiSeenMessage}/${ChatID}`)
const getChatOfUser = () => http.get(apiGetChatOfUser)

const MessageService = {
  createMessage,
  getMessageByChat,
  getChatWithUser,
  getChatOfAdmin,
  seenMessage,
  getChatOfUser
}

export default MessageService
