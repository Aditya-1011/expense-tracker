// client/src/components/Header.tsx
import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Brand - clicking goes to Dashboard */}
          <NavLink to="/" className="logo-button" aria-label="Go to dashboard" style={{ textDecoration: "none" }}>
            <span className="logo">ExpenseFlow</span>
          </NavLink>
        </div>

        <nav className="main-nav" role="navigation" aria-label="Main navigation">
          {/* NavLink adds an active class you can style */}
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Dashboard</NavLink>
          <NavLink to="/daily" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Daily</NavLink>
          <NavLink to="/monthly" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Monthly</NavLink>
        </nav>

        <div className="auth-area">
          {/* Keep your auth/sign-in component here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
