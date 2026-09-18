import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../context/Context";

export default function Header() {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(Context);

  const handleLogout = () => {
    localStorage.removeItem("blog-token");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });

    navigate("/login");
  };

  return (
    <header className="header">
      <div className="headerContainer">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logoIcon">B</span>
          <span className="logoText">BLOG</span>
        </Link>

        {/* Navigation */}
        <nav className="headerNav">
          <Link to="/" className="navLink">
            Home
          </Link>

          <Link to="/category" className="navLink">
            Categories
          </Link>
        </nav>

        {/* User */}
        <div className="headerUser">
          {user ? (
            <>
              <div className="userInfo">
                <div className="userAvatar">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="userDetails">
                  <span className="username">{user.username}</span>
                </div>
              </div>

              <button className="logoutButton" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="headerLoginButton">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
