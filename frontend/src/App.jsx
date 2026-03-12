import './assets/css/App.css';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAlert } from './hooks/useAlert';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { ROUTES, APP_NAME } from './constants';

function App() {
  const { alert, showAlert } = useAlert();
  const { mode, toggleMode } = useTheme(showAlert);
  const { user, isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar
        title={APP_NAME}
        home="Home"
        about="About Us"
        mode={mode}
        toggleMode={toggleMode}
        user={user}
        isAuthenticated={isAuthenticated}
        showAlert={showAlert}
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
        <Route
          path={ROUTES.LOGIN}
          element={<LoginPage showAlert={showAlert} />}
        />
        <Route
          path={ROUTES.SIGNUP}
          element={<SignupPage showAlert={showAlert} />}
        />
        <Route
          path={ROUTES.GOOGLE_CALLBACK}
          element={<GoogleCallbackPage showAlert={showAlert} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
