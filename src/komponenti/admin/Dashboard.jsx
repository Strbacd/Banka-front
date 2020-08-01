import React from "react"
import {NavLink, Switch} from "react-router-dom";
import { Col, Row} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faAddressBook, faDollarSign, faPlus, faEuroSign, faList} from '@fortawesome/free-solid-svg-icons';

// Adminske Akcije
import PrikaziSveKorisnike from "./Korisnici/PrikaziSveKorisnike";
import PrikaziSveRacune from "./Racuni/PrikaziSveRacune"
import PrikaziSveValute from "./Valute/PrikaziSveValute"
import NovRacun from "./Racuni/NovRacun";
import NovKorisnik from "./Korisnici/NovKorisnik";
import NovaValuta from "./Valute/NovaValuta"
import IzmenaKorisnika from "./Korisnici/IzmenaKorisnika";

// Korisnicke Akcije
import NovoPlacanje from "../user/NovoPlacanje";

// komponente viseg reda
import {AdminskaRuta} from '../../ProveraAutentikacije/adminskaRuta';
import {korisnickaRuta} from '../../ProveraAutentikacije/korisnickaRuta';
import {proveraRole} from '../pomocni fajlovi/proveraRole';

class Dashboard extends React.Component {
    render() {
        return (
            <Row className="justify-content-center no-gutters">
                {proveraRole()}
                <Col className="pt-2 app-content-main">
                    <Switch>
                        <AdminskaRuta path="/dashboard/SviKorisnici" component={PrikaziSveKorisnike}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/SviRacuni" component={PrikaziSveRacune}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/NovRacun" component={NovRacun}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/NovKorisnik" component={NovKorisnik}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/izmenakorisnika" component={IzmenaKorisnika}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/SveValute" component={PrikaziSveValute}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/NovaValuta" component={NovaValuta}></AdminskaRuta>
                        <korisnickaRuta path="/dashboard/NovoPlacanje" component={NovoPlacanje}></korisnickaRuta>
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Dashboard