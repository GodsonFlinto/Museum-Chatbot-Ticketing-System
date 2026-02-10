import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ChatbotPage from "./pages/ChatbotPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import Scanner from "./pages/Scanner";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "../src/admin/pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./admin/routes/AdminRoute";
import Bookings from "./admin/pages/Bookings";
import Payments from "./admin/pages/Payments";
import Users from "./admin/pages/Users";
import Chatbot from "./admin/pages/Chatbot";
import Museums from "./admin/pages/Museums";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Default */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          }
        />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <Scanner />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <Bookings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <Payments />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/chatbot"
          element={
            <AdminRoute>
              <Chatbot />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/museums"
          element={
            <AdminRoute>
              <Museums />
            </AdminRoute>
          }
        />
        {/* Fallback */}
        {/* <Route path="*" element={<Navigate to="/chat" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
