import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api";
function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("login/", {
        username: username,
        password: password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // Save Tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("token", res.data.access);

      console.log("TOKEN SAVED:", localStorage.getItem("token"));

      alert("Login Success");

      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response.data);
      }

      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Login</h2>

      <form onSubmit={loginUser}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-100"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;