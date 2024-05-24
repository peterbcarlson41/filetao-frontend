import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App.jsx";
import "./index.css";
import Login from "./pages/Login/index2";
import Register from "./pages/Register/index2";
import NotFound from "./pages/NotFound/index";
import ProtectedRoute from "@/context/ProtectedRoute";
import MyFiles from "./pages/Dashboard/index";
import RootLayout from "./RootLayout";
import VerifyEmail from "./pages/EmailVerification/index.jsx";
import { Analytics } from "@vercel/analytics/react";
import UpdateInfoForm from "./pages/DataMigration/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Analytics />
      <AuthProvider>
        <RootLayout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="update-info" element={<UpdateInfoForm />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<MyFiles />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RootLayout>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
