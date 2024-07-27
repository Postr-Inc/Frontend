/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import SDK from './Utils/SDK';
import { Router, Route } from '@solidjs/router';
import Login from './Pages/auth/login';
import View from './Pages/view';
import User from './Pages/u';
import ForgotPassword from './Pages/auth/ForgotPassword';
import Registration from './Pages/auth/Registration';

const root = document.getElementById('root');
export const api = new SDK({serverURL:'http://localhost:8080'});  
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() =>  (
  <Router>
    <Route path="/auth/login" component={Login} />
    <Route path="/auth/forgot-password" component={ForgotPassword} />
    <Route path="/auth/reset-password/:token" component={ForgotPassword} />
    <Route path="/auth/register" component={Registration} />
    <Route path="/" component={App} />
    <Route path="/view/:collection/:id" component={View} />
    <Route path="/u/:id" component={User} />
  </Router>
), root);
