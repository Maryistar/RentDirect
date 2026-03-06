import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./application/context/AuthContext";

import Navbar from "./presentation/components/Navbar";
import Footer from "./presentation/components/Footer";

import Home from "./presentation/pages/Home";
import Properties from "./presentation/pages/Properties";
import Login from "./presentation/pages/Login";
import Register from "./presentation/pages/Register";
import ForgotPassword from "./presentation/pages/ForgotPassword";
import ResetPassword from "./presentation/pages/ResetPassword";
import VerifyEmail from "./presentation/pages/VerifyEmail";
import PropertyDetail from "./presentation/pages/PropertyDetail";
import MyProperties from "./presentation/pages/MyProperties";
import MyApplications from "./presentation/pages/MyApplications";
import CreateProperty from "./presentation/pages/CreateProperty";
import Profile from "./presentation/pages/Profile";

export default function App() {

  const { user, token } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>

        {/* PÚBLICAS */}

        <Route path="/" element={<Home />} />

        <Route path="/properties" element={<Properties />} />

        <Route path="/properties/:id" element={<PropertyDetail />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/verify-email" element={<VerifyEmail />} />


        {/* TENANT */}

        <Route
          path="/my-applications"
          element={
            token && user?.role === "tenant"
              ? <MyApplications />
              : <Navigate to="/login" />
          }
        />


        {/* OWNER */}

        <Route
          path="/my-properties"
          element={
            token && user?.role === "owner"
              ? <MyProperties />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/create-property"
          element={
            token && user?.role === "owner"
              ? <CreateProperty />
              : <Navigate to="/login" />
          }
        />


        {/* PERFIL */}

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />


        {/* CATCH ALL */}

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      <Footer />
    </>
  );
}