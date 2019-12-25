import React, { useState, useContext } from "react";
import WebContext from "../components/WebContext";

// Material UI imports
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from "@material-ui/core/Switch";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

export default function AddRequestScreen(props) {
  const [query, setQuery] = useState("");
  const [video, setVideo] = useState(false);
  const [level, setLevel] = useState(0);

  const context = useContext(WebContext);


  // Add New request !
  async function addRequestHandler() {
    let mode = video ? 'video' : 'audio';

    if (context.source === "Wikitravel") mode = level;

    const nextRequestId =  context.getNextRequestId();
    console.log("NextRequestId", nextRequestId);

    const request = {
      user_id: context.userId,
      id: context.getNextRequestId(),
      query,
      status: "saved",
      type: context.source,
      mode
    };

    // Add request to context
    context.dispatchAllRequests({ type: "add", newReq: request });

    // Go back
    context.setCurrentScreen("RequestsList");
  }

  // Video / Audio Switch 
  let videoSwitch = null;

  if (context.source === "Youtube") {
    videoSwitch = (
      <div style={styles.video}>
        <FormControlLabel
          labelPlacement="start"
          label={video ? "Video & Audio" : "Only Audio"}
          control={(
            <Switch
              checked={video}
              onChange={() => setVideo(video => !video)}
              value="video"
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          )}

        />

      </div>
    );
  }

  // Level for wikitravel
  let levelSelect = null;
  if (context.source === "Wikitravel") {
    levelSelect = (
      <FormControl>
        <InputLabel id="demo-simple-select-label">Level</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={level}
          onChange={e => setLevel(e.target.value)}
        >
          <MenuItem value="0">0</MenuItem>
          <MenuItem value="1">1</MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <div style={styles.screen}>
      <TextField
        id="standard-basic"
        label="What are you looking for?"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {videoSwitch}
      {levelSelect}
      <div style={styles.buttons}>
        <Button color="secondary" onClick={() => context.setCurrentScreen("RequestsList")}>Cancel</Button>
        <Button color="primary" onClick={addRequestHandler}>Add Request</Button>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 200,
    minHeight: "50%",
    padding: "10%",
    justifyContent: "space-around",
  },

  video: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: "3%"
  },

  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  levelSelect: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },

  levelPicker: {
    width: "29%",
    height: 20,
  }
};
