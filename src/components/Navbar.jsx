import React, { useState } from "react";
import "../App.css";
import NavbarButtons from "./NavbarButtons";
import Search from "../images/svg/SearchIcon";
import Clear from "../images/svg/ClearIcon";
import MenuIcon from "../images/svg/MenuIcon";


function Navbar({ onLogoClick, onLoveClick, onCartClick }) {
  const [searchValue, setSearchValue] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);


  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleScan = (data) => {
    if (data) {
      setSearchValue(data);
      setShowQrScanner(false);
    }
  };




  const clearQrScannerData = () => {
    setSearchValue("");
  };

  return (
    <div className="navbar">
      <img
        className="logo"
        src={require("../images/logo.png")}
        alt="logo"
        onClick={onLogoClick}
      />
      <div className="search">
        <Search />
        <input
          className="search-input"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && <Clear onClick={clearQrScannerData} />}
        <div className="line"></div>
      </div>
      <NavbarButtons onLoveClick={onLoveClick} onCartClick={onCartClick} />
      <MenuIcon />
      
    </div>
  );
}

export default Navbar;
