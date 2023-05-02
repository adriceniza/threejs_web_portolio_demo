import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.scss"
import AppearanceToggler from '../AppearanceToggler/AppearanceToggler';

const Navbar = () => {
  return (
    <nav className="navbar">
        <div className='logo'>
            <Link to="/">zeni.me</Link>
        </div>

        <AppearanceToggler/>
    </nav>
  );
};

export default Navbar;
