import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChromaticWaves from "./ChromaticWaves";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <ChromaticWaves colors={["rgba(181, 71, 31, 0.26)"]} />
    </div>
    <App />
  </React.StrictMode>
);
