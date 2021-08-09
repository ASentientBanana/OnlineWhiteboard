import React from 'react';
import './Navbar.css';
import { Link } from "react-router-dom";

export const Navbar = ()=>{

    return (
        <nav>
        <div className="nav-wrapper">
          <Link className="brand-logo center" to='/'>
            Whiteboard
          </Link>
        </div>
      </nav>
    );

}