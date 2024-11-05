import http from "../index"
import { apiGenerateText } from "./urls" 

const generateText = body => http.post(apiGenerateText,prompt)

const ChatBoxAiService ={
    generateText,
}

export default ChatBoxAiService