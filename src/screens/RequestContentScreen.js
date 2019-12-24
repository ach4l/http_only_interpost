import React, { useContext,  useEffect, useState } from "react";
import WebContext from "../components/WebContext";
import * as ajax from "../ajax";

export default function RequestContextScreen(props) {
  const context = useContext(WebContext);
  const [wikitravelHtml, setWikitravelHtml] = useState({__html: "<html></html>"});

  // useEffect(() => {
  //   async function getMobileWikipedia() {
  //     const link = "http://en.m.wikipedia.org/wiki/Main_Page";
  //     const resp = await fetch(link) //.then(resp=>resp.text());
  //     console.log(resp);
  //     console.log("html", html);
  //     setWikitravelHtml({__html: html});
  //   }
  //   getMobileWikipedia();
  // }, []);

  // When first loaded, ask for html to backend
  // useEffect(() => {
  //   async function getIndexHtml() {
  //     const response = await ajax.getWikitravelAsset(link);
  //     const html = await response.text();
  //     console.log("response getIndexHtml", response);
  //     setWikitravelHtml({__html: html});
  //   }
  //   getIndexHtml();
  // }, [context.currentRequest.links]);


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
    <video width="100%" controls>
      <source src={ajax.serverURL + context.currentRequest.links[0]} type="video/mp4" />
      Your browser does not support the video tag
    </video>
  );

  // For wikitravel, embed HTML  
  if (context.currentRequest.type === "Wikitravel") {
    console.log(wikitravelHtml);
    const link = context.currentRequest.links.filter(item => item.indexOf("index.html")>=0)[0];
    content = <a href={ajax.serverURL + link}> Go to resource </a>
  }

  return (
    <div style={styles.screen}>
      {/* <Text style={styles.title}>{context.currentRequest.query}</Text> */}
      {content}
      {/* <Text>{context.currentRequest.links[0]}</Text> */}

    </div>
  );
}


