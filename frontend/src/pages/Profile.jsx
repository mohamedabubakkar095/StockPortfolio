import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stocks, setStocks] = useState([]);

  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // Fetch Profile & Stocks on Mount
  useEffect(() => {
    fetchProfile();
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem("access");

  const response = await axios.get("https://stockportfolio-backend.onrender.com/api/stocks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStocks(response.data);
    } catch (error) {
      console.error("Stocks Error:", error);
    }
  };

  // Portfolio Calculations
  const totalStocks = stocks.length;

  const totalInvestment = stocks.reduce(
    (total, stock) => total + Number(stock.invested_amount || 0),
    0
  );

  const currentValue = stocks.reduce(
    (total, stock) => total + Number(stock.current_value || 0),
    0
  );

  const totalProfit = stocks.reduce(
    (total, stock) => total + Number(stock.profit_loss || 0),
    0
  );

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.get("https://stockportfolio-backend.onrender.com/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);

      setFormData({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
      });
    } catch (error) {
      console.error("Profile Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async () => {
    try {
      if (
        !passwordData.old_password ||
        !passwordData.new_password ||
        !passwordData.confirm_password
      ) {
        alert("Please fill all password fields");
        return;
      }

      if (passwordData.new_password !== passwordData.confirm_password) {
        alert("New passwords do not match");
        return;
      }

      const token = localStorage.getItem("access");

      await axios.put(
        "https://stockportfolio-backend.onrender.com/api/change-password/",
        {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully!");

      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      setChangingPassword(false);
    } catch (error) {
      console.error("Password Change Error:", error);

      alert(
        error.response?.data?.error || "Failed to change password"
      );
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    alert("Logged out successfully!");

    window.location.href = "/login";
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.put(
        "https://stockportfolio-backend.onrender.com/api/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle backend returning updated profile object directly or wrapped in .user
      const updatedUser = response.data.user || response.data;
      setProfile(updatedUser);
      setEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update Profile Error:", error);
      alert("Failed to update profile");
    }
  };

  // Loading State
  if (!profile) {
    return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Loading Profile...</h2>;
  }

  // Main UI
  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.username?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h1>{profile.first_name || profile.username}</h1>
          <p>{profile.email}</p>
          <span className="profile-badge">Investor</span>
        </div>

        <button
          className="edit-profile-btn"
          onClick={() => setEditing(!editing)}
        >
          ✏️ {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Personal Information Card */}
      <div className="profile-card">
        <h2>Personal Information</h2>

        {editing ? (
          <div className="edit-form">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <button onClick={updateProfile}>💾 Save Changes</button>
          </div>
        ) : (
          <>
            <div className="info-item">
              <span>Username</span>
              <strong>{profile.username}</strong>
            </div>

            <div className="info-item">
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>

            <div className="info-item">
              <span>First Name</span>
              <strong>{profile.first_name || "Not Added"}</strong>
            </div>

            <div className="info-item">
              <span>Last Name</span>
              <strong>{profile.last_name || "Not Added"}</strong>
            </div>
          </>
        )}
      </div>

      {/* Portfolio Overview */}
      <div className="portfolio-section">
        <h2>Portfolio Overview</h2>

        <div className="stats-grid">
          {/* Total Stocks */}
          <div className="stat-card">
            <span>📊</span>
            <p>Total Stocks</p>
            <h3>{totalStocks}</h3>
          </div>

          {/* Total Investment */}
          <div className="stat-card">
            <span>💰</span>
            <p>Total Investment</p>
            <h3>₹{totalInvestment.toLocaleString("en-IN")}</h3>
          </div>

          {/* Current Value */}
          <div className="stat-card">
            <span>📈</span>
            <p>Current Value</p>
            <h3>₹{currentValue.toLocaleString("en-IN")}</h3>
          </div>

          {/* Total Profit */}
          <div className="stat-card">
            <span>💹</span>
            <p>Total Profit</p>
            <h3 className="profit">
              ₹{totalProfit.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
      </div>

      {/* Security & Account Card */}
      <div className="profile-card security-card">
        <h2>Security & Account</h2>

        <div className="security-actions">
          <button onClick={() => setChangingPassword(!changingPassword)}>
            🔒 {changingPassword ? "Cancel" : "Change Password"}
          </button>

          <button>📧 Update Email</button>

          <button className="logout-btn" onClick={logoutUser}>
            🚪 Logout
          </button>
        </div>

        {/* Password Form Dropdown */}
        {changingPassword && (
          <div className="password-form">
            <h3>Change Password</h3>

            <input
              type="password"
              name="old_password"
              placeholder="Current Password"
              value={passwordData.old_password}
              onChange={handlePasswordChange}
            />

            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
            />

            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm New Password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
            />

            <button onClick={changePassword}>🔒 Update Password</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

