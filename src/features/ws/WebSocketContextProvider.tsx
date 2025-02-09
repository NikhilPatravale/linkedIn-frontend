import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Sockjs from 'sockjs-client';
import { Client, Frame, Stomp } from '@stomp/stompjs';

const WebSocketContext = createContext<Client | null>(null);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [stompClient, setStompClient] = useState <Client | null>(null);

  useEffect(() => {
    const socket = new Sockjs(`http://localhost:8080/ws/?token=${localStorage.getItem("token")}`);
    const client = Stomp.over(() => socket);

    client.connect({}, (frame: Frame) => {
      console.log("WS Connected: ", frame);

      setStompClient(client);
    }, (error: string) => {
      console.log("Error in WS Connection: ", error);
    });

    return () => {
      client?.deactivate();
      return;
    };
  }, []);

  return <WebSocketContext.Provider value={stompClient} >{children}</WebSocketContext.Provider>;
};