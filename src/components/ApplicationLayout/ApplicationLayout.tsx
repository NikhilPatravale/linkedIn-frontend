import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import classes from "./ApplicationLayout.module.scss";
import { WebSocketContextProvider } from "../../features/ws/WebSocketContextProvider";

function ApplicationLayout() {
  return (
    <WebSocketContextProvider>
      <div className={classes.root}>
        <Header />
        <main className={classes.container}>
          <Outlet />
        </main>
      </div>
    </WebSocketContextProvider>
  );
}

export default ApplicationLayout;