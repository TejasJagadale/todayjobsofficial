import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// Wrapper component to handle page transitions
function AnimatedRoutes() {
  const location = useLocation();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);
    }
  }, [isFirstMount]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1], // Smooth easing
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              key="home"
              variants={pageVariants}
              initial={isFirstMount ? "animate" : "initial"}
              animate="animate"
              exit="exit"
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/jobs"
          element={
            <motion.div
              key="jobs"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Jobs />
            </motion.div>
          }
        />
        <Route
          path="/companies"
          element={
            <motion.div
              key="companies"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Company />
            </motion.div>
          }
        />
        <Route
          path="/jobsdetails/:id"
          element={
            <motion.div
              key="jobdetails"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <JobDetails />
            </motion.div>
          }
        />
        <Route
          path="/profile"
          element={
            <motion.div
              key="profile"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ProfileDetail />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <AnimatedRoutes />
      <Footer />
      <ScrollTopButton />
    </Router>
  );
}

export default App;