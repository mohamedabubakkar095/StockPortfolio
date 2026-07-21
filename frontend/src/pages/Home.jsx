import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">
          <span className="hero-badge">
            📈 Smart Portfolio Management
          </span>

          <h1>
            Manage Your
            <span> Investments </span>
            Smarter
          </h1>

          <p>
            Track your stocks, monitor portfolio performance,
            analyze profits and manage your investments
            from one powerful dashboard.
          </p>

          <div className="hero-buttons">
            <Link to="/dashboard" className="primary-btn">
              📊 View Dashboard
            </Link>

            <Link to="/profile" className="secondary-btn">
              👤 View Profile
            </Link>
          </div>
        </div>

        {/* Hero Card */}
        <div className="hero-card">

          <div className="hero-card-header">
            <span>Portfolio Value</span>
            <span className="positive">▲ 12.45%</span>
          </div>

          <h2>₹1,25,000</h2>

          <div className="mini-chart">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="hero-card-footer">
            <span>Total Investment</span>
            <strong>₹1,00,000</strong>
          </div>

        </div>

      </section>


      {/* Features Section */}
      <section className="features-section">

        <div className="section-heading">
          <span>POWERFUL FEATURES</span>
          <h2>Everything You Need to Manage Your Portfolio</h2>
          <p>
            Simple, powerful tools designed to help you
            understand and manage your investments.
          </p>
        </div>


        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Portfolio Tracking</h3>
            <p>
              Track all your stocks and monitor your
              portfolio value in one place.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Performance Analysis</h3>
            <p>
              Analyze your investment performance,
              profit and loss with clear insights.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Profit Tracking</h3>
            <p>
              Easily monitor your total investment,
              current value and overall profit.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Export Reports</h3>
            <p>
              Export your portfolio data as Excel
              and PDF reports anytime.
            </p>
          </div>

        </div>

      </section>


      {/* CTA Section */}
      <section className="cta-section">

        <h2>Ready to Manage Your Investments?</h2>

        <p>
          Start tracking your portfolio and make
          better investment decisions.
        </p>

        <Link to="/dashboard" className="cta-btn">
          Get Started →
        </Link>

      </section>

    </div>
  );
}

export default Home;