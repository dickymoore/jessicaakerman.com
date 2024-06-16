import React from 'react';
import logo from './images/logo/logo2018.png'; // Import the logo

function Header() {
  return (
    <header style={headerStyle}>
      <img src={logo} alt="Jessica Akerman Logo" style={logoStyle} />
      <nav>
        <ul style={navListStyle}>
          <li style={navItemStyle}><a href="/" style={navLinkStyle}>Home</a></li>
          <li style={navItemStyle}><a href="/about" style={navLinkStyle}>About</a></li>
          <li style={navItemStyle}><a href="/work" style={navLinkStyle}>Work</a></li>
          <li style={navItemStyle}><a href="/contact" style={navLinkStyle}>Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #ccc'
};

const logoStyle = {
  height: '50px'
};

const navListStyle = {
  listStyle: 'none',
  display: 'flex',
  margin: 0,
  padding: 0
};

const navItemStyle = {
  margin: '0 10px'
};

const navLinkStyle = {
  textDecoration: 'none',
  color: '#333'
};

export default Header;
