import React from "react";
interface message {
  body: string;
  time: any;
  name: string;
}
const ChatMessage = ({ body, time, name }: message) => {
  return (
    <div className="">
      <img src="/w3images/avatar_g2.jpg" alt={name} className="right" />
      <p className="center-align">{body}</p>
      <span className="time-left">{time}</span>
    </div>
  );
};
export default ChatMessage;
