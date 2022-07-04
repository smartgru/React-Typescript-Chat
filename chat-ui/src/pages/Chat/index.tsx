import { useState, useContext, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";

import { SocketContext } from "../../context/socket";
import MessagePanel from "../../components/MessagePanel";
import { IMessage } from "../../interfaces";
import "./style.css";

const Chat = () => {
  const userName = localStorage.getItem("userName");
  const socket = useContext(SocketContext);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [text, setText] = useState("");

  const handleReceiveMsg = useCallback((message: IMessage) => {
    setMessageList((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    socket.emit("join", { name: userName });

    socket.on("join", handleReceiveMsg);

    socket.on("message", handleReceiveMsg);

    socket.on("left", handleReceiveMsg);

    return () => {
      socket.off("join");
      socket.off("message");
      socket.off("left");
    };
  }, [handleReceiveMsg, socket, userName]);

  if (!userName) {
    return <Navigate to="/" />;
  }

  const handleSendMessage = () => {
    socket.emit("message", { message: text });
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };

  return (
    <div className="chat">
      <h1>Welcome Join!</h1>
      <MessagePanel messageList={messageList} sId={socket.id} />
      <div className="chat-input">
        <input
          value={text}
          placeholder="Type your message"
          onChange={handleChangeText}
        />
        <button type="button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
