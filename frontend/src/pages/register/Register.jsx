import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://blogapp-6huo.onrender.com/user/signup",
        {
          username,
          email,
          password,
        }
      );

      console.log("Register response:", res.data);

      if (res.data) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);

      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="registerCard">
        {/* Header */}
        <div className="registerHeader">
          <h1>Create Account</h1>

          <p>Join our blog community today</p>
        </div>

        <form className="registerForm" onSubmit={handleSubmit}>
          {/* Error */}
          {error && <div className="registerError">{error}</div>}

          {/* Username */}
          <div className="inputGroup">
            <label>Username</label>

            <div className="inputWrapper">
              <span className="inputIcon">👤</span>

              <input
                type="text"
                className="registerInput"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email */}
          <div className="inputGroup">
            <label>Email Address</label>

            <div className="inputWrapper">
              <span className="inputIcon">✉</span>

              <input
                type="email"
                className="registerInput"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="inputGroup">
            <label>Password</label>

            <div className="inputWrapper">
              <span className="inputIcon">🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                className="registerInput"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <span className="passwordHint">
              Password must be at least 6 characters
            </span>
          </div>

          {/* Confirm Password */}
          <div className="inputGroup">
            <label>Confirm Password</label>

            <div className="inputWrapper">
              <span className="inputIcon">🔒</span>

              <input
                type={showConfirmPassword ? "text" : "password"}
                className="registerInput"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button className="registerButton" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login */}
        <div className="loginSection">
          <span>Already have an account?</span>

          <Link to="/login" className="loginLink">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
