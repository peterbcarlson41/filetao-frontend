import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import App from "./App.jsx";
import "./index.css";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import NotFound from "./pages/NotFound/index";
import Upload from "./pages/Upload/index";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Retrieve from "./components/common/FileRetrieve";
import MyFiles from "./pages/Dashboard/index";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="upload" element={<Upload />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="retrieve" element={<Retrieve />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<MyFiles />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
