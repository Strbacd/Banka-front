import { isAdmin, isUser } from './Autentikacija';
import React from "react"
import {NavLink, Switch} from "react-router-dom";
import { Col, Row} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faAddressBook, faDollarSign, faPlus, faEuroSign, faList, faBong} from '@fortawesome/free-solid-svg-icons';

export const proveraRole = () => {
    if (isAdmin())
    {
        return (
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
                <NavLink activeClassName="active-link" to='/dashboard/SviRacuni'><FontAwesomeIcon className='text-primary mr-1' icon={faDollarSign}/>Svi Racuni</NavLink>
            </Row>
            <Row className="justify-content-center mt-2">
                <NavLink activeClassName="active-link" to='/dashboard/NovRacun'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus}/>Dodaj Racun</NavLink>
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
        )
    }
    if(isUser())
    {
        return (
            <Col lg={2} className="dashboard-navigation bg-dark">
{/*                 <Row className="justify-content-center mt-2">
                    <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faUsers}/>Korisnici</span>
                </Row> */}
                <Row className="justify-content-center mt-2">
                    <NavLink activeClassName="active-link" to='/dashboard/NovoPlacanje'><FontAwesomeIcon className='text-primary mr-1' icon={faBong}/>Novo Placanje</NavLink>
                </Row>

            </Col>
        )
    }
}