import React from "react";
import { Route, Routes } from "react-router-dom";
import Editor from "./Editor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Editor />} />
    </Routes>
  );
}

export default App;