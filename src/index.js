import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/react-mesto-auth">
    <App />
  </BrowserRouter>
);
