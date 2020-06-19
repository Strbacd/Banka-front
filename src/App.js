import React from 'react'
import './App.css';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
// Komponente
import Header from './komponenti/Header';
import Dashboard from './komponenti/admin/Dashboard';

// komponente viseg reda
import {AdminskaRuta} from './ProveraAutentikacije/adminskaRuta'

function App() {
  return (
    <React.Fragment>
      <Header />
      <div className="set-overflow-y">
        <Switch>
          <Redirect exact from="/" to="dashboard" />
          <AdminskaRuta path="/dashboard" component={Dashboard}/>
      </Switch>
      <NotificationContainer/>
      </div>
    </React.Fragment>
  );
}

export default App;