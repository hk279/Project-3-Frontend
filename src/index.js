import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

//Had to get rid of React.StrictMode tags because it caused error with the Shards UI components.
ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
