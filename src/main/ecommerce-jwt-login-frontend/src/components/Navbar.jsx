import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import profileIcon from '../assets/profile.png';
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light-theme");
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { token } = useContext(AppContext);

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSearchChange = async (value) => {
    setInput(value);
    if (value) {
      setShowSearchResults(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="https://telusko.com/">Telusko</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/add_product">Add Product</a></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">Categories</a>
                <ul className="dropdown-menu">
                  {categories.map(category => (
                    <li key={category}>
                      <button className="dropdown-item" onClick={() => onSelectCategory(category)}>{category}</button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <button className="theme-btn" onClick={() => setTheme(theme === "dark-theme" ? "light-theme" : "dark-theme")}>
              <i className={`bi bi-${theme === "dark-theme" ? "moon" : "sun"}-fill`}></i>
            </button>
            <a href="/Login"><img src={profileIcon} alt="Profile" style={{height: '40px', background:'white', borderRadius:'50%', margin: '0px 15px'}} /></a>
            <a href="/cart" className="nav-link text-dark"><i className="bi bi-cart me-3 h-100" style={{ display: "flex", alignItems: "center", height:'30px' }}></i>Cart</a>
            <div className="d-flex align-items-center cart">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                value={input}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setShowSearchResults(false)}
              />
              {showSearchResults && (
                <ul className="list-group">
                  {searchResults.length > 0 ? (
                    searchResults.map(result => (
                      <li key={result.id} className="list-group-item">
                        <a href={`/product/${result.id}`} className="search-result-link">{result.name}</a>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No Product with such Name</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
