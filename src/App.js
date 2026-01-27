import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Navbar from "./pages/Navbar";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Company from "./components/Company";
import JobDetails from "./components/JobDetails";
import ProfileDetail from "./components/ProfileDetail";
import Footer from "./pages/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollTopButton from "./components/ScrollTopButton";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

/* =========================
   AUTH CHECK
========================= */
const isAuthenticated = () =>
  localStorage.getItem("isLoggedIn") === "true";

/* =========================
   ANIMATED ROUTES
========================= */
function AnimatedRoutes() {
  const location = useLocation();
  const isAuth = isAuthenticated();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* DEFAULT ENTRY */}
        <Route
          path="/"
          element={
            isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />

        {/* AUTH ROUTES */}
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to="/home" />
            ) : (
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <Login />
              </motion.div>
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuth ? (
              <Navigate to="/home" />
            ) : (
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <Register />
              </motion.div>
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ForgotPassword />
            </motion.div>
          }
        />

        <Route
          path="/reset-password"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ResetPassword />
            </motion.div>
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/home"
          element={
            isAuth ? (
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <Home />
              </motion.div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/jobs"
          element={isAuth ? <Jobs /> : <Navigate to="/login" />}
        />

        <Route
          path="/companies"
          element={isAuth ? <Company /> : <Navigate to="/login" />}
        />

        <Route
          path="/jobsdetails/:id"
          element={isAuth ? <JobDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={isAuth ? <ProfileDetail /> : <Navigate to="/login" />}
        />
      </Routes>
    </AnimatePresence>
  );
}

/* =========================
   MAIN APP
========================= */
function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    <>
      {!hideLayout && <Navbar />}
      <ScrollToTop />

      <AnimatedRoutes />

      {!hideLayout && <Footer />}
      {!hideLayout && <ScrollTopButton />}
    </>
  );
}

/* =========================
   ROUTER WRAPPER
========================= */
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
