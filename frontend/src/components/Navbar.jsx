import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    alert("Logout Successfully");
    navigate("/login");
  };

  const isLoggedIn = localStorage.getItem("token");

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          📈 Stock Portfolio
        </Link>

        <div>
          <Link className="btn btn-outline-light me-2" to="/">
            Home
          </Link>

          {!isLoggedIn ? (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">
                Login
              </Link>

              <Link className="btn btn-success" to="/register">
                Register
              </Link>
            </>
          ) : (
            <button
              className="btn btn-danger"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;