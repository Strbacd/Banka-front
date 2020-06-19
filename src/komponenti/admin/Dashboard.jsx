import React from "react"
import {NavLink, Switch} from "react-router-dom";
import { Col, Row} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faAddressBook, faDollarSign, faPlus, faEuroSign, faList} from '@fortawesome/free-solid-svg-icons';

// Adminske Akcije
import PrikaziSveKorisnike from "./Korisnici/PrikaziSveKorisnike";
import PrikaziSveDevizneRacune from "./DevizniRacuni/PrikaziSveDevizneRacune"
import PrikaziSveValute from "./Valute/PrikaziSveValute"
import NovDevizniRacun from "./DevizniRacuni/NovDevizniRacun";
import NovKorisnik from "./Korisnici/NovKorisnik";
import NovaValuta from "./Valute/NovaValuta"
import IzmenaKorisnika from "./Korisnici/IzmenaKorisnika";

// komponente viseg reda
import {AdminskaRuta} from '../../ProveraAutentikacije/adminskaRuta';

class Dashboard extends React.Component {
    render() {
        return (
            <Row className="justify-content-center no-gutters">
                <Col lg={2} className="dashboard-navigation bg-dark">
                    <Row className="justify-content-center mt-2">
                        <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faUsers}/>Korisnici</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/SviKorisnici'><FontAwesomeIcon className='text-primary mr-1' icon={faAddressBook}/>Lista korisnika</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NovKorisnik'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus}/>Dodaj korisnika</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faUsers}/>Racuni</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/SviDevizniRacuni'><FontAwesomeIcon className='text-primary mr-1' icon={faDollarSign}/>Svi Devizni Racuni</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NovDevizniRacun'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus}/>Dodaj Racun</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faEuroSign}/>Valute</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/SveValute'><FontAwesomeIcon className='text-primary mr-1' icon={faEuroSign}/>Lista Valuta</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NovaValuta'><FontAwesomeIcon className='text-primary mr-1' icon={faList}/>Dodaj Valutu</NavLink>
                    </Row>
                </Col>
                <Col className="pt-2 app-content-main">
                    <Switch>
                        <AdminskaRuta path="/dashboard/SviKorisnici" component={PrikaziSveKorisnike}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/SviDevizniRacuni" component={PrikaziSveDevizneRacune}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/NovDevizniRacun" component={NovDevizniRacun}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/NovKorisnik" component={NovKorisnik}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/izmenakorisnika" component={IzmenaKorisnika}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/SveValute" component={PrikaziSveValute}></AdminskaRuta>
                        <AdminskaRuta path="/dashboard/NovaValuta" component={NovaValuta}></AdminskaRuta>
                    </Switch>
                </Col>
            </Row>
        )
    }
}

export default Dashboard