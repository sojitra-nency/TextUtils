// import logo from './logo.svg';
import './App.css';
// import About from './components/About';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';
import React, { useState } from 'react';

function App() {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    if(mode === 'light'){
      setMode('dark');  
      document.body.style.backgroundColor = '#30494F';
      document.body.style.color = '#E0E0E0';
    }else{
      setMode('light');
      document.body.style.backgroundColor = '#E0E0E0';  
      document.body.style.color = '#30494F';
    }
  }

  return (
<>
  <Navbar title='TextUtils' home='Home' about='About Us' mode={mode} toggleMode={toggleMode}/>
    {/* <Navbar /> */}
    <div className='container my-3'>
    <TextForm heading='TextUtils :)' mode={mode}/>
    </div>
    {/* <div className='container my-3'>
      <About />
    </div> */}
</>
  );
}

export default App;
