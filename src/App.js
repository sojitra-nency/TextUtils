// import logo from './logo.svg';
import './App.css';
import Alert from './components/Alert';
import About from './components/About';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';
import React, { useState } from 'react';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';

function App() {
  const [mode, setMode] = useState('light');
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

// to remove the body class to avoid the color palette to be applied on the body

  const removeBodyClasses = () => {
    document.body.classList.remove('bg-light');
    document.body.classList.remove('bg-dark');
    document.body.classList.remove('bg-warning');
    document.body.classList.remove('bg-danger');
    document.body.classList.remove('bg-success');
    document.body.classList.remove('bg-primary');
    document.body.classList.remove('bg-secondary');
    document.body.classList.remove('bg-info');  
  }

  const toggleMode = (cls) => {
    if(mode === 'light'){

      //for color palette - custom backgorund color
      removeBodyClasses();
      console.log(cls)
      document.body.classList.add('bg-'+cls);


      setMode('dark');  
      document.body.style.backgroundColor = '#163563';
      document.body.style.color = 'white';
      showAlert('Dark Mode has been enabled', 'success');
      // document.title = 'TextUtils - Dark Mode';
      
      
    }
    else{
      setMode('light');
      document.body.style.backgroundColor = 'white';  
      document.body.style.color = '#163563';
      showAlert('Light Mode has been enabled', 'success');
      // document.title = 'TextUtils - Light Mode';

      // To change the title of the page after every 2 seconds and 1.5 seconds to make it look lke blinking

      // setInterval(() => {
      //   document.title = 'TextUtils is Amazing';
      // }, 2000);
      // setInterval(() => {
      //   document.title = 'Install TextUtils Now';
      // }, 1500);
    }
  }

  return (
<>
    {/* <Navbar title='TextUtils' home='Home' about='About Us' mode={mode} toggleMode={toggleMode}/>
    <Alert alert={alert} />
    <div className='container my-3'>
      <TextForm heading='TextUtils :)' mode={mode} showAlert={showAlert}/>
    </div>
    <div className='container my-3'>
      <About />
    </div>  */}
    <Router>
        <Navbar title='TextUtils' home='Home' about='About Us' mode={mode} toggleMode={toggleMode} />
        <Alert alert={alert} />
        <Routes>
          <Route exact path="/" element={<TextForm heading='TextUtils :)' mode={mode} showAlert={showAlert} />} />
          <Route exact path="/about" element={<About mode={mode}/>} />
        </Routes>
      </Router>
</>
  );
}

export default App;
