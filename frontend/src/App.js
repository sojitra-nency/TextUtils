import './assets/css/App.css';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAlert } from './hooks/useAlert';
import { useTheme } from './hooks/useTheme';
import { ROUTES, APP_NAME } from './constants';

function App() {
  const { alert, showAlert } = useAlert();
  const { mode, toggleMode } = useTheme(showAlert);

  return (
    <Router>
      <Navbar
        title={APP_NAME}
        home="Home"
        about="About Us"
        mode={mode}
        toggleMode={toggleMode}
      />
      <Alert alert={alert} />
      <Routes>
        <Route
          exact
          path={ROUTES.HOME}
          element={<Home mode={mode} showAlert={showAlert} />}
        />
        <Route
          exact
          path={ROUTES.ABOUT}
          element={<AboutPage mode={mode} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
