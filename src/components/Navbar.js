// rfc
import React from 'react'
// impt
import PropTypes from 'prop-types'

export default function Navbar(props) {
    const submitForm = (e) => {
        e.preventDefault();
    }
  return (
    <div>
      <nav className={`navbar navbar-expand-lg bg-dark navbar-dark`}>
        <div className="container-fluid">
            <a className="navbar-brand" href="/">{props.title}</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">{props.home}</a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/">{props.about}</a>
                </li>
                {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Services
                </a>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/">{props.ser1}</a></li>
                    <li><a className="dropdown-item" href="/">{props.ser2}</a></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><a className="dropdown-item" href="/">{props.more}</a></li>
                </ul>
                </li> */}
                
            </ul>
            
            <form className="d-flex" role="search" onSubmit={submitForm}>
                <input className="form-control mx-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-primary mx-3" type="submit">Search</button>
            </form>
            <div className={`form-check form-switch text-${props.mode === 'light'? 'dark':'light'}`}>
                <input className="form-check-input" onClick={props.toggleMode} type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Mode</label>
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