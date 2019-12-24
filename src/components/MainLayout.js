import React, { useContext } from "react";
import Colors from "../constants/Colors";
import WebContext from "./WebContext";
import { mainIconStyle, videoIconStyle, ICON_SIZE } from "../constants/iconStyles";

// Import Icons
import Add from "@material-ui/icons/Add";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Home from "@material-ui/icons/Home";


export default function MainLayout(props) {
  const context = useContext(WebContext);

  // Add + at RHS if currentScreen==RequestsList
  let addRequest = <div style={{ width: ICON_SIZE }}></div>;
  if (context.currentScreen === "RequestsList") addRequest = (
    <div onClick={() => context.setCurrentScreen("AddRequest")}>
      <Add style={mainIconStyle} />
    </div>
  );

  // Add Left Button
  let leftIcon = <div style={{ width: ICON_SIZE }}></div>;
  if (context.currentScreen === "RequestContent") leftIcon = (
    <div onClick={() => context.setCurrentScreen("RequestsList")} >
      <ArrowBack style={mainIconStyle} />
    </div>
  );
  else if (context.currentScreen !== "SelectSource") leftIcon = (
    <div onClick={() => context.setCurrentScreen("SelectSource")} >
      <Home style={mainIconStyle} />
    </div>
  );

  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        {leftIcon}
        <div style={styles.title}>{props.title}</div>
        {addRequest}
      </div>
      <div style={styles.content}>
        {props.children}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    height: "100%",
    // backgroundColor: "green"
    display: "flex",
    flexDirection: "column",

  },

  header: {
    height: 60,
    backgroundColor: Colors.headerBackground,
    justifyContent: "space-between",
    padding: "0 3vw",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },

  title: {
    color: Colors.headerTitle,
    fontSize: 20,
  },

  content: {
    flexGrow: 1,
  }

};