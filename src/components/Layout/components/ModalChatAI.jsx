import { FloatButton } from "antd";
import logo from '/logo.png';
import { AiOutlineMinus } from "react-icons/ai";
import { useEffect, useState } from "react";
import { ChatBoxContainerStyled } from "../styled";
import InputCustom from "src/components/InputCustom";
import { BiSolidSend } from "react-icons/bi";
import SpinCustom from "src/components/SpinCustom";
import axios from "axios";
import { toast } from "react-toastify";
const ModalChatAI = () => {
  const [openChatBox, setOpenChatBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const handleSendMessage = async () => {
    if (!content) return;
    
    try {
      setLoading(true);
      setMessages((prev) => [
        ...prev,
        { sender: "user", content },
      ]);

      const res = await axios.post("http://localhost:9999/generate/generateText", { prompt:content });
      // const res= await ChatBoxAiService.generateText(prompt=content);
      const aiResponse = res?.data?.data || "Không có phản hồi từ AI";

      setMessages((prev) => [
        ...prev,
        { sender: "AI", content: aiResponse },
      ]);

      setContent("");
    } catch (error) {
      toast.error("Lỗi khi gửi yêu cầu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FloatButton.Group
      open={openChatBox}
      trigger="click"
      type="primary"
      onClick={() => setOpenChatBox(!openChatBox)}
      icon={<BiSolidSend />}
      style={{
        position: 'fixed',
        zIndex: 1000
      }}
    >
      <SpinCustom spinning={loading}>
        <ChatBoxContainerStyled>
          <div className="header d-flex-sb">
            <img
              className="cursor-pointer"
              src={logo}
              alt=""
              style={{ width: '20px', height: "30px" }}
            />
            <AiOutlineMinus
              onClick={() => setOpenChatBox(false)}
              className="cursor-pointer"
            />
          </div>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "user-message" : "ai-message"}>
                <strong>{msg.sender === "user" ? "Bạn" : "TaTuBoo"}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div className="input-message">
            <InputCustom
              placeholder="Nhập vào tin nhắn"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPressEnter={handleSendMessage}
              suffix={
                <BiSolidSend
                  className="cursor-pointer"
                  onClick={handleSendMessage}
                  color="#106ebe"
                />
              }
            />
          </div>
        </ChatBoxContainerStyled>
      </SpinCustom>
    </FloatButton.Group>
  );
};

export default ModalChatAI;
