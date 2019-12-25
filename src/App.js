import React, { useReducer, useState, useEffect, useRef } from "react";
import WebContext from "./components/WebContext";
import MainLayout from "./components/MainLayout";
import * as ajax from "./ajax";
import 'typeface-roboto';
import "./App.css";
import * as dbCalls from "./db";

// Screens
import SelectSourceScreen from "./screens/SelectSourceScreen";
import RequestContentScreen from "./screens/RequestContentScreen";
import RequestsListScreen from "./screens/RequestsListScreen";
import AddRequestScreen from "./screens/AddRequestScreen";

export default function App() {

  // Define values for context
  const [allRequests, dispatchAllRequests] = useReducer(reducerReqs, []);
  const [source, setSource] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("SelectSource");
  const [currentRequest, setCurrentRequest] = useState({});
  const videoRef = useRef();

  const SCREENS = {
    SelectSource: { screen: SelectSourceScreen, title: "WebBackPack" },
    RequestsList: { screen: RequestsListScreen, title: source },
    RequestContent: { screen: RequestContentScreen, title: currentRequest.query },
    AddRequest: { screen: AddRequestScreen, title: "Add " + source }
  }

  function getNextRequestId() {
    if (allRequests.length > 0) return Math.max(...allRequests.map(req => req.id)) + 1;
    return 1;
  }

  const context = {
    userId: "Parvati",
    sources: ["Youtube", "Wikitravel"],
    getNextRequestId,
    allRequests,
    dispatchAllRequests,
    currentScreen,
    setCurrentScreen,
    source,
    setSource,
    setCurrentRequest,
    currentRequest,
    videoRef,
  }

  // ------------------------------------
  // Effects for IndexedDb Manipulation
  // ------------------------------------

  // Initialize IndexedDB and load requests data
  useEffect(() => {
    async function initializeRequests() {
      const requests = await dbCalls.initializeDB();
      dispatchAllRequests({type: "init-requests", requests });
    }
    initializeRequests();
  }, []);

  // Whenever allRequests change, backup all info about requests
  useEffect(() => {
    if (allRequests.length > 0) dbCalls.putAllRequestElements(allRequests);
  }, [allRequests]);

  // ------------------------------------
  // ------------------------------------

  // Send saved requests to server
  useEffect(() => {
    async function sendRequestsServer() {
      const reqsOk = context.allRequests.filter(
        req => req.status === "saved"
      );
      const promises = reqsOk.map(req => ajax.sendRequest(req));
      const results = await Promise.all(promises);

      results
        .filter(res => "server_request_id" in res)
        .forEach(res => {
          dispatchAllRequests({
            type: "updateReceivedServer",
            serverRequest: res
          });

        })

    }
    sendRequestsServer();
  });

  // Whenever app rerenders, send requests to server to get content
  useEffect(() => {
    async function getContentRequests() {
      // Ask for content for each request with status receivedServer
      const reqsOk = context.allRequests.filter(
        req => req.status === "receivedServer"
      );
      const promises = reqsOk.map(req => ajax.getContent(req));
      const results = await Promise.all(promises);

      results
        .filter(item => item.status === "OK")
        .forEach(item => {
          dispatchAllRequests({
            type: "updateDownloaded",
            serverResponse: item
          })
        })

    }
    getContentRequests();
  });



  // Main content definition
  const MainContent = SCREENS[currentScreen].screen;

  return (
    <WebContext.Provider value={context}>
      <MainLayout title={SCREENS[currentScreen].title}>
        <MainContent />
      </MainLayout>
    </WebContext.Provider>
  );
}


function reducerReqs(reqs, action) {
  switch (action.type) {
    case "add":
      return [...reqs, action.newReq];
    case "remove":
      return reqs.filter(req => req.id !== action.reqId);
    case "init-requests":
      return [...action.requests];
    case "updateReceivedServer":
      // console.log("updating from serverRequest", action.serverRequest);
      const newRequest = { ...reqs.filter(req => req.id === action.serverRequest.id)[0] };
      newRequest.server_request_id = action.serverRequest.server_request_id;
      newRequest.status = "receivedServer";
      return reqs.map(req => req.id === newRequest.id ? newRequest : req);
    case "updateDownloaded":
      // console.log("Updating download", action.serverResponse);
      const newRequest2 = { ...reqs.filter(req => req.server_request_id === action.serverResponse.server_request_id)[0] };
      newRequest2.status = "downloadedServer";
      newRequest2.links = action.serverResponse.links;
      // console.log(reqs.map(req => req.id === newRequest2.id ? newRequest2 : req));
      // console.log(action.serverResponse.server_request_id)
      return reqs.map(req => (
        req.server_request_id === action.serverResponse.server_request_id ?
          newRequest2 :
          req
      ));
    default:
      throw Error("error in reducerReqs, App.js");
  }
}

