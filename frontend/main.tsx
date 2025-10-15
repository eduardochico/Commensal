import React from "react";
import ReactDOM from "react-dom/client";
import CommensalMock from "./App"; // renombra el TSX del canvas a App.tsx

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CommensalMock />
  </React.StrictMode>
);
