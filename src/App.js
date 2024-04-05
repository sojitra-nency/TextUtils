// import logo from './logo.svg';
import './App.css';
import About from './components/About';
import Navbar from './components/Navbar';
// import TextForm from './components/TextForm';

function App() {
  return (
<>
  <Navbar title='TextUtils' home='Home' about='About Us' ser1='Service1' ser2='Service2' more='More'/>
    {/* <Navbar /> */}
    {/* <div className='container my-3'>
    <TextForm heading='TextUtils :)' />
    </div> */}
    <div className='container my-3'>
      <About />
    </div>
</>
  );
}

export default App;
