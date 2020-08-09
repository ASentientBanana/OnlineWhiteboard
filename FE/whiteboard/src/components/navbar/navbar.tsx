import React from 'react';
import './navbar.css';

export const Navbar = ()=>{

    return (
        <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo center">Whiteboard</a>
          <ul id="nav-mobile" className="left hide-on-med-and-down">
          </ul>
        </div>
      </nav>
    );

}