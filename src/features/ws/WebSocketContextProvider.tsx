import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Sockjs from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

const WebSocketContext = createContext<Client | null>(null);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [stompClient, setStompClient] = useState <Client | null>(null);

  useEffect(() => {
    const socket = new Sockjs(`http://localhost:8080/ws/?token=${localStorage.getItem("token")}`);
    const client = Stomp.over(() => socket);

    client.connect({}, (frame) => {
      console.log("WS Connected: ", frame);

      setStompClient(client);
    }, (error) => {
      console.log("Error in WS Connection: ", error);
    });

    return () => {
      stompClient?.deactivate();
      return;
    };
  }, []);

  return <WebSocketContext.Provider value={stompClient} >{children}</WebSocketContext.Provider>;
};