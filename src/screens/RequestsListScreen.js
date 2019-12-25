import React, { useContext } from "react";
import WebContext from "../components/WebContext";
import RequestDisplay from "../components/RequestDisplay";

export default function RequestsListScreen(props) {
  const context = useContext(WebContext);

  function isDownloadedRequest(req) {
    return (req.type === "Youtube" ? 
      req.status === "downloadedLocally" : 
      req.status === "downloadedServer");
  }


  let reqElements = context.allRequests
    .filter(req => req.type === context.source)
    .map(req => (
      <RequestDisplay
        request={req}
        key={req.id}
        downloaded={isDownloadedRequest(req)}
      />
    ));

  return (
    <div>
      {reqElements}
    </div>
  );

}

