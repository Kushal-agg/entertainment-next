import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "./Header.scss"; // Import the SCSS file for styles
import SearchInput from "./SearchInput";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const url = "https://api.themoviedb.org/3";
const Header = () => {
  const location = useLocation();

  const isVisible = location.pathname.includes("/search");

  return (
    <nav className="header">
      <img
        id="home"
        src="https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/8f/80/18/8f801836-5772-212d-970e-34703cc29fad/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg"
        alt="Logo"
      />
      <div className="nav-links">
        <NavLink exact to="/home" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/tvshows" activeClassName="active">
          TV Shows
        </NavLink>
        <NavLink to="/movies" activeClassName="active">
          Movies
        </NavLink>
      </div>
      <div className="search">{!isVisible && <SearchInput />}</div>
    </nav>
  );
};

export default Header;
