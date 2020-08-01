import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { NotificationManager } from 'react-notifications';
import * as Autentikacija from '../komponenti/pomocni fajlovi/Autentikacija';


export const AdminskaRuta = ({ component: Component, ...rest }) => {
    useEffect(() => {
        if(!Autentikacija.isAdmin()){
            NotificationManager.error('You shall not pass!');
        }
      });
    return (
    <Route {...rest} render={ (props) => (localStorage.getItem('jwt') && Autentikacija.isAdmin()) ? (<Component {...props} />) : 
    (    <Redirect to={{pathname: "/", state: {from: props.location} }}/>
    )}/>
    )
}