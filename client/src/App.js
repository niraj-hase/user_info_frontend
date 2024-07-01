import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginForm, RegistrationForm, UserList, Logout } from "./components";
import { HomePage } from "./Pages";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "./public/styles/App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <ToastContainer />
        
        <div className="nav">
          {isLoggedIn && <Logout setIsLoggedIn={setIsLoggedIn} />}
        </div>
        <Routes>
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/user_list" />
              ) : (
                <RegistrationForm
                  setIsLoggedIn={setIsLoggedIn}
                  setShowLogin={setIsLoggedIn}
                />
              )
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/user_list" />
              ) : (
                <LoginForm
                  setIsLoggedIn={setIsLoggedIn}
                  setShowLogin={setIsLoggedIn}
                  showToast={(type, message) =>
                    toast[type](message, { position: "top-right" })
                  }
                />
              )
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/user_list" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/user_list"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
