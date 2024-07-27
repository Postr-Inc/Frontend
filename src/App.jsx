import logo from './logo.svg';
import styles from './App.module.css';
import { api } from '.';
import useNavigation from './Utils/Hooks/useNavigation';
import Login from './Pages/auth/login';
import Home from './Pages';
import { Switch, Match } from 'solid-js';

function App() {
  const { route, params, goBack, goForward, navigate } = useNavigation();

  if (api.authStore.isValid()) api.connect();

  api.on('change', () => {
    console.log('change');
    if (!api.authStore.isValid()) navigate('/auth/login');
  });
  return <Home />;
}


export default App;
