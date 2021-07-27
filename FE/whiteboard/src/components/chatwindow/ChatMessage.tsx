import React from "react";
interface message {
  body: string;
  time: any;
  name: string;
}
const ChatMessage = ({ body, time, name }: message) => {
  console.log('user name is ' + name);
  
  return (
    <div className="chat-message">
      <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgenslerzudansdentistry.com%2Fwp-content%2Fuploads%2F2015%2F11%2Fanonymous-user.png&f=1&nofb=1" alt={name} className="right" />
      <p>{name}</p>
      <p className="center-align">{body}</p>
      <span className="time-left">{time}</span>
    </div>
  );
};
export default ChatMessage;
