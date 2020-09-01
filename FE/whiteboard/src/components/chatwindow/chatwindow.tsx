import React, {
  useState,
  useEffect,
  createRef,
} from "react";
import ChatMessage from "./ChatMessage";
import "./chatwindow.css";

export const Chatwindow = ({ socket }: any) => {
  const [chatInputText, setChatInputText] = useState("");
  const inputRef = createRef<HTMLTextAreaElement>();
  const messageContainerRef = createRef<HTMLDivElement>();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat-msg", (msg: any) => {
      console.log(msg + "ddddd");
      appendMessages(msg);
    });
  }, [messages]);

  const chatWindow = createRef<HTMLDivElement>();

  const appendMessages = (msg: any) => {
    setMessages([...messages, msg]);
  };
  const chatInputHandle = (e: any) => {
    setChatInputText(e.target.value);
  };
  const sendChatMsg = (e: any) => {
    e.preventDefault();

    if (chatInputText) {
        socket.emit("chat-msg", chatInputText);
        appendMessages(chatInputText);
        setChatInputText("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop  = messageContainerRef.current.offsetHeight;
    }
  };
  const openChatWindow = (e: any) => {
    e.preventDefault();
    if (chatWindow.current) {
      chatWindow.current.style.display = "block";
    }
  };
  const closeChatWindow = () => {
    if(inputRef.current){
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
              <ChatMessage body={msg} time={'now'} name={"anon"} key={index} />
            ))}
          </div>
          <textarea
            placeholder="Type message.."
            rows={2}
            name="msg-in"
            required
            className="textarea-input"
            ref={inputRef}
            onChange={chatInputHandle}
          ></textarea>
          <div className="container">
            <button
              type="button"
              className="waves-effect waves-light btn-large send "
              onClick={sendChatMsg}
            >
              Send
            </button>
            <button
              type="button"
              className=" cancel waves-effect waves-light btn-large"
              onClick={closeChatWindow}
            >
              Close
            </button>
          </div>
        </form>
      </div>
      <button
        className="open-button waves-effect waves-light btn-large"
        onClick={openChatWindow}
      >
        Chat
      </button>
    </div>
  );
};

// <div classNameName="chat-container">
//
// {/* body start */}
// <div classNameName="container chat-body" ref={messageContainerRef}>
//   {messages.map((msg, index) => (
//     <div key={index} classNameName="msg">
//       {msg}
//     </div>
//   ))}
// </div>
// {/* body end */}
// <div classNameName="chat-input">
//   <div classNameName="row">
//     <form classNameName="col s12">
//       <div classNameName="row">
//         <div classNameName="input-field col s12 m6 l6 center">
//           <textarea
//             id="icon_prefix2"
//             classNameName="materialize-textarea"
//             placeholder=" Type here"
//             onChange={chatInputHandle}
//             ref={inputRef}
//           ></textarea>
//         <div classNameName="send-btn-container  " onClick={sendChatMsg}>
//           <a classNameName="waves-effect waves-light btn-large ">Send</a>
//         </div>
//         </div>
//       </div>
//     </form>
//   </div>
// </div>
// </div>
