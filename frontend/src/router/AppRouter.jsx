import { Routes, Route } from "react-router-dom";

import Layout from "../presentation/layout/Layout";

import Home from "../presentation/pages/Home";
import Login from "../presentation/pages/Login";
import Register from "../presentation/pages/Register";
import PropertyDetail from "../presentation/pages/PropertyDetail";
import Profile from "../presentation/pages/Profile";
import MyApplications from "../presentation/pages/MyApplications";
import MyProperties from "../presentation/pages/MyProperties";
import CreateProperty from "../presentation/pages/CreateProperty";
import ForgotPassword from "../presentation/pages/ForgotPassword";
import ResetPassword from "../presentation/pages/ResetPassword";
import VerifyEmail from "../presentation/pages/VerifyEmail";

import ProtectedRoute from "../application/components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Layout global */}
      <Route element={<Layout />}>

        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Perfil */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Tenant */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute role="tenant">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Owner */}
        <Route
          path="/my-properties"
          element={
            <ProtectedRoute role="owner">
              <MyProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-property"
          element={
            <ProtectedRoute role="owner">
              <CreateProperty />
            </ProtectedRoute>
          }
        />

        
      </Route>
    </Routes>
  );
}