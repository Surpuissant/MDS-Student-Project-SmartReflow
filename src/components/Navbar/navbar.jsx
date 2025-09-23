import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="https://www.fluent-planet.com/" className="navbar-logo">
          <img
            src="https://www.fluent-planet.com/wp-content/uploads/2025/08/cropped-cropped-Logo-original-1-160x43.png"
            alt="Fluent Planet Logo"
          />
        </a>

        {/* Menu burger (mobile) */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
