import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import App from "./App.jsx";
import "./index.css";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import NotFound from "./pages/NotFound/index";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MyFiles from "./pages/Dashboard/index";
import Statistics from "./components/common/StatisticsCard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<MyFiles />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="statistics" element={<Statistics />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
