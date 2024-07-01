import React, { useState } from "react";
import "../public/styles/login.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ setIsLoggedIn, showToast }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/user/login", formData);
      console.log("Login successful::::", response.data);

      const { token, user } = response.data;

      if (formData.rememberMe) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(user));
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userData", JSON.stringify(user));
      }

      navigate('/user_list');
      setIsLoggedIn(true);

      // Show success toast
      showToast("success", "Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      // Show error toast
      showToast("error", "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <div className="sign-btn">
          <button onClick={() => navigate('/register')}>SIGN IN</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="user-icon">
            <FaUserCircle size={100} />
          </div>
          <div className="input">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Username"
            />
          </div>
          <div className="input">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
            />
          </div>
          <div className="checkBox">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="#">Forget Password</a>
          </div>
          <div className="input-button">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
