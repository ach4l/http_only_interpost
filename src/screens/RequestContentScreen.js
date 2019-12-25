import React, { useContext, useRef, useEffect } from "react";
import WebContext from "../components/WebContext";
import * as ajax from "../ajax";
import * as dbCalls from "../db"

export default function RequestContextScreen(props) {
  const context = useContext(WebContext);
  const videoRef = useRef();

  // At the beginning get video
  useEffect(() => {
    async function getVideo() {
      const videoBlob = await dbCalls.getVideo(context.currentRequest.id);
      console.log("videoBlob", videoBlob)
      videoRef.current.src = window.URL.createObjectURL(videoBlob);
    }
    if (videoRef.current) getVideo();
  }, [context.currentRequest.id]);
 
  const styles = {
    screen: {
      backgroundColor: context.currentRequest.type === "Youtube" ? "black" : "white",
      display: "flex",
      justifyContent: "center",
      height: "100%",
    },
  
    title: {
      fontSize: 16
    }
  };

  // Definition of content
  let content = null;

  // For youtube, embed video

  if (context.currentRequest.type === "Youtube") content = (
    <video width="100%" controls ref={videoRef}/>
  );

  // For wikitravel, embed HTML  
  if (context.currentRequest.type === "Wikitravel") {
    const link = context.currentRequest.links.filter(item => item.indexOf("index.html")>=0)[0];
    content = <a href={ajax.serverURL + link}> Go to resource </a>
  }

  return (
    <div style={styles.screen}>
      {content}
    </div>
  );
}


