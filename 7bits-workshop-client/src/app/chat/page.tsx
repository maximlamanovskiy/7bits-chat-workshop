'use client'

import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

type WebhookMessage = {
  name: string;
  message: string;
};

export default function Chat() {
  const [messageHistroy, setMessageHistory] = useState<WebhookMessage[]>([]);
  const [message, setMessage] = useState("");

  const { sendMessage, lastMessage } = useWebSocket('ws:localhost:8000/ws');

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data);
      setMessageHistory((prev) => [
        ...prev,
        {
          name: message['Name'],
          message: message['Message'],
        },
      ]);
    }
  }, [lastMessage])

  const onSendClick = () => {
    if (message !== "") {
      const jsonMessage = JSON.stringify({
        name: localStorage.getItem("name") as string,
        message: message,
      });
      sendMessage(jsonMessage);
    }
  }

  return (
    <main className="flex flex-col">
      <form>
        <input className="text-black" type="text" onChange={(e) => setMessage(e.target.value)} />
        <button type="button" onClick={onSendClick}>
          Send
        </button>
      </form>

      <div>
        {messageHistroy.map((message, idx) => (
          <p key={idx}>{`${message.name} says: ${message.message}`}</p>
        ))}
      </div>
    </main>
  );
}
