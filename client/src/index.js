import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "video-react/dist/video-react.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
