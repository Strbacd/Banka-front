import React from 'react';
import {getUserName} from '../pomocni fajlovi/Autentikacija'
import {serviceConfig} from '../../appSettings'
import Spinner from '../Spinner';
import { withRouter } from 'react-router-dom';
import { Row, Table, Card, Button, CardColumns } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

class Profil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnik: [],
            racuni: [],
            isLoading: true
        };
    }

    componentDidMount() {
        this.getUserByUsername();
        this.popuniTabelu = this.popuniTabelu.bind(this);
    }

    getUserByUsername() {
        let ime = getUserName();

        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/DajPoKorisnickomImenu?ime=${ime}`, parametriZahteva)
            .then(odgovor => {
                if(!odgovor.ok) {
                    return;
                }
                return odgovor.json();
            })
            .then(data => {
                if (data) {
                    this.setState({korisnik: data});
                    this.dajRacunePoKorisnikId();
                }
            })
            .catch(odgovor => {
                NotificationManager.error(odgovor.message || odgovor.statusText);
            });
    }

    dajRacunePoKorisnikId() {
        this.setState({isLoading: true});
        const {korisnik} = this.state;
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
        fetch(`${serviceConfig.baseURL}/api/KontrolerRacuna/DajSveRacunePoKorisnikId?korisnikId=${korisnik.idKorisnika}`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then (data => {
            if(data) {
                this.setState({racuni: data, isLoading: false});
            }
        })
        .catch(odgovor => {
            odgovor.text()
            .then(text => {
                let error = JSON.parse(text);
                NotificationManager.error(error.porukaGreske);
            })
        })
    }

    popuniTabelu() {
        return this.state.racuni.map(racun => {
            return <Card bg="white" style={{width: '18rem', margin: '10px'}} key={racun.idRacuna}>
                <Card.Body>
                    <Card.Title>{racun.valuta.nazivValute}</Card.Title>
                    <Card.Text>Stanje: {racun.stanje}</Card.Text>
                    <Button onClick={() => this.props.history.push(`SvaPlacanjaPoRacunu/${racun.idRacuna}`)} variant="primary">uplate izvrsene sa ovog racuna</Button>
                </Card.Body>
            </Card>
        })
    }

        render() {
            const {isLoading} = this.state;
            const kartice = this.popuniTabelu();
            const prikaziKartice = isLoading ? <Spinner></Spinner> : kartice;

            return (
                <React.Fragment>
                    <Row className="no-gutters pt-2">
                        <h1 className="form-header form-heading">Hello, {this.state.korisnik.korisnickoIme}</h1>
                    </Row>
                    <Row className="no-gutters pr-5 pl-5">
                <div class="card mb-3 user-info-container">
                <div class="row no-gutters">
                    <div class="col-md-4">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS8tVjlY8BQfSZg9SoudTWMCR6eHXpi-QHhQDUYSyjFmHYOTyyp" class="avatar-img" alt="..."/>
                    </div>
                    <div class="col-md-8">
                    <div style={{marginLeft: '35px'}} class="card-body">
                        <h5 class="card-title">User details:</h5>
                        <p class="card-text"><strong>Korisnicko ime:</strong> {this.state.korisnik.korisnickoIme}</p>
                        <p class="card-text"><strong>Ime i prezime:</strong> {this.state.korisnik.ime + ' ' + this.state.korisnik.prezime}</p>
                        <p class="card-text"><strong>Adresa:</strong> {this.state.korisnik.adresa}</p>
                    </div>
                    </div>
                </div>
                </div>
                </Row>
                <div>
                    <Row className="no-gutters pt-2">
                        <h1 className="form-header form-heading">Odabir Racuna</h1>
                    </Row>
                    <CardColumns>
                        {prikaziKartice}
                    </CardColumns>
                </div>

                </React.Fragment>

            )
        }
}

export default withRouter(Profil);