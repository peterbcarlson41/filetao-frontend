import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import "./index.css";
import Login from "@/pages/Login/index";
import Register from "@/pages/Register/index";
import NotFound from "@/pages/NotFound/index";
import ProtectedRoute from "@/context/ProtectedRoute";
import MyFiles from "@/pages/Dashboard/index";
import MyAccount from "@/pages/Account/index";
import VerifyEmail from "@/pages/EmailVerification/index";
import DataMigration from "@/pages/DataMigration/index";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Analytics />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="update-info" element={<DataMigration />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<MyFiles />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<MyAccount />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
