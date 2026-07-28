import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChromaticWaves from "./ChromaticWaves";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <ChromaticWaves />
    </div>
    <App />
  </React.StrictMode>
);
