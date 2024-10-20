import logo from './logo.svg';
import styles from './App.module.css';
import { api } from '.';
import useNavigation from './Utils/Hooks/useNavigation'; 
import Login from './Pages/auth/login';
import Home from './Pages';
import Registration from './Pages/auth/Registration';
import { createEffect } from 'solid-js';

function App() {
  const { route, params, goBack, goForward, navigate } = useNavigation();
  createEffect(() => {
    api.checkAuth();
  });
  api.on('change', () => {
     if(!api.authStore.isValid()) navigate('/auth/login');
  }); 
  const renderContent = () => {
    switch (route()) {
      case "/":
        return <Home navigate={navigate} />;
      case "/auth/login":
        return  <Login navigate={navigate} />;
      case "/auth/register":
        return <Registration navigate={navigate} />;
      default:
        return (
          <div>
            <h1>404 Not Found</h1>
            <button onClick={() => navigate('/')}>Go Home</button>
          </div>
        );
    }
  };

  return <>{renderContent()}</>
}


export default App;
