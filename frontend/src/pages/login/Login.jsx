import "./login.css";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { login } from "../../service/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch, isFetching } = useContext(Context);

  useEffect(() => {
    const token = localStorage.getItem("blog-token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(login, {
        email,
        password,
      });

      console.log("login data", res);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res?.data?.data?.user,
      });

      localStorage.setItem("blog-token", res?.data?.data?.access_token);
      localStorage.setItem("user", JSON.stringify(res?.data?.data?.users));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      dispatch({ type: "LOGIN_FAILED" });

      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="login">
      <div className="loginCard">
        <div className="loginHeader">
          <div className="loginLogo">B</div>
          <h1>Welcome Back</h1>
          <p>Login to continue to post your blog</p>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          {error && <div className="loginError">{error}</div>}

          <div className="inputGroup">
            <label>Email Address</label>

            <div className="inputWrapper">
              <span className="inputIcon">✉</span>

              <input
                className="loginInput"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="inputGroup">
            <label>Password</label>

            <div className="inputWrapper">
              <span className="inputIcon">🔒</span>

              <input
                className="loginInput"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="forgotPassword">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="loginButton" disabled={isFetching}>
            {isFetching ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="registerSection">
          <span>Don't have an account?</span>

          <Link to="/register" className="registerLink">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
