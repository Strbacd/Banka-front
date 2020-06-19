import React from "react";
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import {withRouter} from 'react-router-dom';

class PrikaziSveKorisnike extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnici: [],
            isLoading: true,
            idKorisnika: '',
            pretraga: ''
        };
        this.popuniTabelu = this.popuniTabelu.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.dajKorisnike();
    }

    dajKorisnike() {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/DajSveKorisnike`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then(data => {
            if(data) {
                this.setState({korisnici: data, isLoading: false});
            }
        })
        .catch(odgovor => {
            NotificationManager.error(odgovor.message || odgovor.statusText);
            this.setState({isLoading: false});
        })
    }

    izmenaKorisnika(idKorisnika) {
        this.props.history.push({pathname: `izmenakorisnika/${idKorisnika}`,
                                state: {idKorisnika: idKorisnika}});
    }
    popuniTabelu() {
        console.log(this.state.korisnici)
        return this.state.korisnici.map(korisnik => {
            return <tr key = {korisnik.idKorisnika}>
                <td>{korisnik.korisnickoIme}</td>
                <td>{korisnik.ime}</td>
                <td>{korisnik.prezime}</td>
                <td>{korisnik.adresa}</td>
                <td width="5%" className="text-center cursor-pointer" onClick={() => this.izmenaKorisnika(korisnik.idKorisnika)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
            </tr>
        })
    }
    
    handleChange(e) {

        var data = e.currentTarget.value;
        this.setState({ pretraga: data})
    }

    handleClick() {
        let parametarPretrage = this.state.pretraga;

        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/DajPoKorisnickomImenu/${parametarPretrage}`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            } else if (odgovor === null)
            {
                return null;
            }
            return odgovor.json();
        })
        .then(data => {
            if(data) {
                let dataArray = new Array;
                dataArray[0] = data;
                this.setState({korisnici: dataArray[0], isLoading: false});
            }
        })
        .catch(odgovor => {
            NotificationManager.error(odgovor.message || odgovor.statusText);
            this.setState({isLoading: false});
        })

    }

    render() {
        const {isLoading} = this.state;
        const podaciOKorisnicima = this.popuniTabelu();
        var tabela = (
            <Table striped bordered hover size="sm" variant="dark">
                <thead>
                    <tr>
                        <th>Korisnicko Ime</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>adresa</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {podaciOKorisnicima}
                </tbody>
            </Table>
        )
        const prikaziTabelu = isLoading ? <Spinner></Spinner> : tabela;
        return (
            <React.Fragment>
                <Row className="no-gutters pt-2">
                    <h1 className="form-header form-heading">Svi Korisnici</h1>
                </Row>
                <Row>
                    <input class="no-gutters pl-5 search-bar" name="inputValue" value={this.inputValue} id="korisnik" type="text" onChange={e => this.handleChange(e)} placeholder="Korisnicko Ime"></input>
                    <button onClick={() => this.handleClick()}>Search</button>
                    </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {prikaziTabelu}
                </Row>
            </React.Fragment>
        )
    }


}

export default withRouter(PrikaziSveKorisnike)