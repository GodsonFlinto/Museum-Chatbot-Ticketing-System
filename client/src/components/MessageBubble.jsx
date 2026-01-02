const MessageBubble = ({ sender, text }) => {
  return (
    <div
      className={`chat-bubble ${
        sender === "user" ? "chat-user" : "chat-bot"
      }`}
    >
      {text}
    </div>
  );
};

export default MessageBubble;
