import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/_table.scss"
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import './assets/style.css'
//import './assets/sass/style.scss'
//import './assets/sass/style.react.scss'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();