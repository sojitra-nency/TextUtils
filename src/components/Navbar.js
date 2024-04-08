// rfc
import React from 'react'
// impt
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

export default function Navbar(props) {
    const submitForm = (e) => {
        e.preventDefault();
    }
  return (
    <div>
      <nav className={`navbar navbar-expand-lg bg-dark navbar-dark`}>
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">{props.title}</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">{props.home}</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/about">{props.about}</Link>
                </li>
                {/* <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Services
                </Link>
                <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/">{props.ser1}</Link></li>
                    <li><Link className="dropdown-item" to="/">{props.ser2}</Link></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><Link className="dropdown-item" to="/">{props.more}</Link></li>
                </ul>
                </li> */}
                
            </ul>
            
            {/* <form className="d-flex" role="search" onSubmit={submitForm}>
                <input className="form-control mx-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-primary mx-3" type="submit">Search</button>
            </form> */}

            {/* <div className="d-flex">
                <div className="bg-primary rounded mx-2" onClick={() => props.toggleMode('primary')} style={{height: '30px', width: '30px'}}></div>
                <div className="bg-secondary rounded mx-2" onClick={() => props.toggleMode('secondary')} style={{height: '30px', width: '30px'}}></div>
                <div className="bg-success rounded mx-2" onClick={() => props.toggleMode('success')} style={{height: '30px', width: '30px'}}></div>
                <div className="bg-danger rounded mx-2" onClick={() => props.toggleMode('danger')} style={{height: '30px', width: '30px'}}></div>
                <div className="bg-warning rounded mx-2" onClick={() => props.toggleMode('warning')} style={{height: '30px', width: '30px'}}></div>
                <div className="bg-info rounded mx-2" onClick={() => props.toggleMode('info')} style={{height: '30px', width: '30px'}}></div>
                <div className="bg-light rounded mx-2" onClick={() => props.toggleMode('light')} style={{height: '30px', width: '30px'}}></div>
                <div className="bg-dark rounded mx-2" onClick={() => props.toggleMode('dark')} style={{height: '30px', width: '30px'}}></div>
            </div> */}

            <div className={`form-check form-switch text-${props.mode === 'light'? 'white':'light'}`}>
                <input className="form-check-input" onClick={props.toggleMode} type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                {/* <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Mode</label> */}
            </div>
            </div>
            
        </div>
        
        </nav>
    </div>
  )
}


Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    home: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    ser1: PropTypes.string.isRequired,
    ser2: PropTypes.string.isRequired,
    more: PropTypes.string.isRequired
    }   

Navbar.defaultProps = {
    title: 'Title',
    home: 'Home',
    about: 'About Us',
    ser1: 'Service',
    ser2: 'Service',
    more: 'More'
    }