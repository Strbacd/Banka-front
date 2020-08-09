import React from "react";
import {getUserName} from '../pomocni fajlovi/Autentikacija';
import { Card, Button, Row, CardColumns, Table } from 'react-bootstrap';
import Spinner from '../Spinner';
import {withRouter} from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';

class NovoPlacanjeIzborRacuna extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnickoIme: `${getUserName()}`,
            korisnik: '',
            racuni: [],
            isLoading: true

        };
        this.popuniTabelu = this.popuniTabelu.bind(this);
    }

componentDidMount() {
    this.dajKorisnika();
}

 dajKorisnika() {
    const {korisnickoIme} = this.state;
    const parametriZahteva = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };
    
    this.setState({isLoading: true});

    fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/DajPoKorisnickomImenu?ime=${korisnickoIme}`, parametriZahteva)
    .then(odgovor => {
        if(!odgovor.ok) {
            return Promise.reject(odgovor);
        }
        return odgovor.json();
    })
    .then (data => {
        if(data) {
            this.setState({korisnik: data, isLoading: false});
            this.dajRacune();
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

dajRacune() {
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
                <Button onClick={() => this.props.history.push(`NovoPlacanje/${racun.idRacuna}`)} variant="primary">Plati ovim racunom</Button>
            </Card.Body>
        </Card>
    })
}

render() {
    const{isLoading} = this.state;
    const kartice = this.popuniTabelu();
    const prikaziKartice = isLoading ? <Spinner></Spinner> : kartice;

    return (
        <React.Fragment>
            <Row className="no-gutters pt-2">
                <h1 className="form-header form-heading">Odabir Racuna</h1>
            </Row>
            <CardColumns>
            {prikaziKartice}
            </CardColumns>
        </React.Fragment>
    )
}

}

export default withRouter(NovoPlacanjeIzborRacuna);