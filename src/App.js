// import logo from './logo.svg';
import './App.css';
import Alert from './components/Alert';
// import About from './components/About';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';
import React, { useState } from 'react';

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

  const toggleMode = () => {
    if(mode === 'light'){
      setMode('dark');  
      document.body.style.backgroundColor = '#30494F';
      document.body.style.color = '#E0E0E0';
      showAlert('Dark Mode has been enabled', 'success');
    }else{
      setMode('light');
      document.body.style.backgroundColor = '#E0E0E0';  
      document.body.style.color = '#30494F';
      showAlert('Light Mode has been enabled', 'success');
    }
  }

  return (
<>
    <Navbar title='TextUtils' home='Home' about='About Us' mode={mode} toggleMode={toggleMode}/>
    <Alert alert={alert} />
    <div className='container my-3'>
      <TextForm heading='TextUtils :)' mode={mode} showAlert={showAlert}/>
    </div>
    {/* <div className='container my-3'>
      <About />
    </div> */}
</>
  );
}

export default App;
