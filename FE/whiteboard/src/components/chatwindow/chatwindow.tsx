import React, { useState, useEffect, createRef } from "react";
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

  const appendMessages = (msg: any) => {
    setMessages([...messages, msg]);
  };
  const chatInputHandle = (e: any) => {
    setChatInputText(e.target.value);
  };
  const sendChatMsg = (e: any) => {
    if (chatInputText) {
      socket.emit("chat-msg", chatInputText);
      appendMessages(chatInputText);
      if (inputRef.current) {
        inputRef.current.value = "";
        // setChatInputText("");
      }
    }
    if(messageContainerRef.current){
      console.log('scroll');
      
      messageContainerRef.current.scrollIntoView(true);
    }
  };
  return (
    <div className="chat-container">
      <h1 className="center chat-header">All Chat</h1>
      {/* body start */}
      <div className="container chat-body" ref={messageContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className="msg">
            {msg}
          </div>
        ))}
      </div>
      {/* body end */}
      <div className="chat-input">
        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12 m6 l6 center">
                <textarea
                  id="icon_prefix2"
                  className="materialize-textarea"
                  placeholder=" Type here"
                  onChange={chatInputHandle}
                  ref={inputRef}
                ></textarea>
              <div className="send-btn-container  " onClick={sendChatMsg}>
                <a className="waves-effect waves-light btn-large ">Send</a>
              </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
