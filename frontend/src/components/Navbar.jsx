import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    alert("Logout Successfully");
    navigate("/login");
  };

  const isLoggedIn =
    localStorage.getItem("access") ||
    localStorage.getItem("token");

  const isActive = (path) => {
    return location.pathname === path
      ? "nav-link active"
      : "nav-link";
  };

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg shadow sticky-top">

      <div className="container">

        {/* Logo */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to="/"
        >
          <FaChartLine className="me-2 text-success" />
          Stock Portfolio
        </Link>


        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* Navbar Content */}
        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav ms-auto align-items-lg-center">


            {/* Home */}
            <li className="nav-item">
              <Link
                className={isActive("/")}
                to="/"
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>


            {/* Dashboard */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  className={isActive("/dashboard")}
                  to="/dashboard"
                >
                  <FaTachometerAlt className="me-1" />
                  Dashboard
                </Link>
              </li>
            )}


            {/* Profile */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  className={isActive("/profile")}
                  to="/profile"
                >
                  <FaUser className="me-1" />
                  Profile
                </Link>
              </li>
            )}


            {/* Not Logged In */}
            {!isLoggedIn ? (
              <>

                <li className="nav-item">
                  <Link
                    className="btn btn-outline-light ms-lg-3 me-lg-2 mt-2 mt-lg-0"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn btn-success mt-2 mt-lg-0"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>

              </>
            ) : (

              /* Logout */
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">

                <button
                  className="btn btn-danger"
                  onClick={logout}
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>

              </li>

            )}

          </ul>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;