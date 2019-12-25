import React, { useContext } from "react";
import WebContext from "./WebContext";
import Delete from "@material-ui/icons/Delete";
import * as dbCalls from "../db";

export default function RequestDisplay(props) {

  const context = useContext(WebContext);

  function detailRequestHandler() {
    if (props.downloaded) {
      context.setCurrentScreen("RequestContent");
      context.setCurrentRequest(props.request);
    }
  }

  function removeRequestHandler() {
    context.dispatchAllRequests({ type: "remove", reqId: props.request.id })
    dbCalls.removeRequestElement(props.request.id);
    if (props.request.status === "downloadedLocally") {
      dbCalls.removeContent(props.request.id);
    }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.firstColumn} onClick={detailRequestHandler}>
        <div style={styles.infos}>
          {props.request.id} / {props.request.mode} / {props.request.status}
        </div>
        <div style={styles.query}>{props.request.query}</div>
      </div>
      <div onClick={removeRequestHandler}>
        <Delete size={30} style={{ color: "pink" }} />
      </div>
    </div>
  );
}

const styles = {
  screen: {
    padding: "1%",
    margin: "2%",
    maxWidth: "90%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  firstColumn: {
    flexGrow: 1,
    marginRight: "5%",
    maxWidth: "90%",
    borderBottomColor: "grey",
    borderBottomWidth: 1
  },

  infos: {
    color: "grey",
    fontSize: 12,
  },

  query: {
    fontWeight: "bold",
    marginHorizontal: "2vw",
    fontSize: 16,
    marginVertical: "1%",
    maxWidth: "100vw",
  }



};





// const colors = {
//   saved: {
//     textColor: "black",
//     backgroundColor: "white",
//     borderColor: "black"
//   },

//   sent: {
//     textColor: "red",
//     backgroundColor: "white",
//     borderColor: "black"
//   },

//   receivedServer : {
//     textColor: "orange",
//     backgroundColor: "white",
//     borderColor: "black"
//   },

//   // greenish
//   receivedLocal: {
//     textColor: "yellow",
//     backgroundColor: "#3e9455",
//     borderColor: "#235230"
//   },

//   failure: {
//     textColor: "white",
//     backgroundColor: "red",
//     borderColor: "red"
//   }
// };