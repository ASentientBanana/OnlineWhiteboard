import React, {
  useState,
  useEffect,
  createRef,
  useContext
} from "react";
import ChatMessage from "./ChatMessage";
import "./Chatwindow.css";
import {WinnerBannerContext} from '../../contexts/WinnerBannerProvider';


export const Chatwindow = ({ socket  , name}: any) => {
  const [winner,setWinner] = useContext(WinnerBannerContext);
  const [chatInputText, setChatInputText] = useState("");
  const inputRef = createRef<HTMLTextAreaElement>();
  const messageContainerRef = createRef<HTMLDivElement>();
  const [messages, setMessages] = useState<any[]>([]);
  const chatWindow = createRef<HTMLDivElement>();

  useEffect(() => {
    socket.on("chat-message", (msg: any) => {
      console.log(msg);
      appendMessages(msg);
    });
    socket.on("WINNER", (winnerName: any) => {
      console.log('winnin');
      setWinner(winnerName);
    });
  }, [messages]);

  const appendMessages = (msg: any) => {
    if(msg.name == name) msg.name = "You";
    setMessages([...messages, msg]);
  };
  const chatInputHandle = (e: any) => {
    setChatInputText(e.target.value);
  };
  const sendChatMsg = (e: any) => {
    e.preventDefault();
    if (chatInputText) {
      const body = chatInputText;
      const msg = {name,body};
      socket.emit("chat-message", msg);
      setChatInputText("");
      if (inputRef.current) inputRef.current.value = "";
    }
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.offsetHeight;
    }
  };
  const openChatWindow = (e: any) => {
    e.preventDefault();
    if (chatWindow.current) {
      chatWindow.current.style.display = "block";
    }
  };
  const closeChatWindow = () => {
    if (inputRef.current) {
      setChatInputText("");
      inputRef.current.value = '';
    }
    if (chatWindow.current) {
      chatWindow.current.style.display = "none";
    }
  };
  return (
    <div>
      <div className="chat-popup" id="chat-container" ref={chatWindow}>
        <form className="form-container card-panel ">
          <h3 className="center chat-header"> Chat</h3>
          <div className="textarea-output" ref={messageContainerRef}>
            {messages.map((msg, index) => (
              <ChatMessage body={msg.body} time={msg.name} name={msg.name} key={index} />
            ))}
          </div>
          <textarea
            placeholder="Type message.."
            rows={2}
            name="msg-in"
            className="textarea-input"
            ref={inputRef}
            onChange={chatInputHandle}
          ></textarea>
          <div className="btn-container">
            <button
              type="button"
              className="waves-effect waves-light btn-large send "
              onClick={sendChatMsg}
            >
              Send
            </button>
            <button
              type="button"
              className=" cancel waves-effect waves-light btn-large "
              onClick={closeChatWindow}
            >
              Close
            </button>
          </div>
        </form>
      </div>
      <button
        className="open-button  btn-floating btn-large waves-effect waves-light"
        onClick={openChatWindow}
      >
        Chat
      </button>
    </div>
  );
};