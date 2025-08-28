import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="header">
        <nav className="nav_desktop">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#history">Nossa História</a></li>
            <li><a href="#info">Informações</a></li>
            <li><a href="#local">Como Chegar</a></li>
            <li><a href="#gift">Presentes</a></li>
          </ul>
        </nav>
        <div className="nav_mobile">
          <button id="menu_toggle" className="menu_toggle" onClick={toggleMenu}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </header>

      <div id="mobile_menu_items" className={`mobile_menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={toggleMenu}>Home</a>
        <a href="#history" onClick={toggleMenu}>Nossa História</a>
        <a href="#info" onClick={toggleMenu}>Informações</a>
        <a href="#local" onClick={toggleMenu}>Como Chegar</a>
        <a href="#gift" onClick={toggleMenu}>Presentes</a>
      </div>
    </>
  );
};

export default Header;