import "./styles/App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroBanner from "./components/HeroBanner";
import FeaturesSection from "./components/FeaturesSection";
import StatsSection from "./components/StatsSection";
import CrisisSection from "./components/CrisisSection";
import HowItWorks from "./components/HowItWorks";
import CallToAction from "./components/CallToAction";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Verify = lazy(() => import("./pages/Verify"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Warnings = lazy(() => import("./pages/Warnings"));
const ScanCrop = lazy(() => import("./pages/ScanCrop"));
const About = lazy(() => import("./pages/About"));
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster position="top-right" />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/warnings" element={<Warnings />} />
            <Route path="/scan-crop" element={<ScanCrop />} />
            <Route path="/about" element={<About />} />
            {/* Add other routes here */}
            <Route
              path="/"
              element={
                <>
                  <HeroBanner />
                  <FeaturesSection />
                  <StatsSection />
                  <CrisisSection />
                  <HowItWorks />
                  <CallToAction />
                </>
              }
            />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
