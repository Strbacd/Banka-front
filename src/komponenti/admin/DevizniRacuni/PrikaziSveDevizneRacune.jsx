import React from "react";
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table } from 'react-bootstrap';
import Spinner from '../../Spinner';

class PrikaziSveDevizneRacune extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devizniRacuni: [],
            isLoading: true
        };

    }


    componentDidMount() {
        this.dajDevizneRacune();
    }
    
    dajDevizneRacune() {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/KontrolerDeviznihRacuna/DajSveDevizneRacuna`,parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then(data => {
            if(data) {
                this.setState({devizniRacuni: data, isLoading: false});
            }
        })
        .catch(odgovor => {
            NotificationManager.error(odgovor.message || odgovor.statusText);
            this.setState({isLoading: false});
        })
    }

    popuniTabelu() {
        return this.state.devizniRacuni.map(devizniRacun => {
            return <tr key={devizniRacun.idDeviznogRacuna}>
                <td width="34%">{devizniRacun.korisnik.korisnickoIme}</td>
                <td width="33%">{devizniRacun.idValute}</td>
                <td width="33%">{devizniRacun.stanje}</td>
            </tr>
        })
    }

    render() {
        
        const {isLoading} = this.state;
        const podaciORacunima = this.popuniTabelu();
        const tabela = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                                <tr>
                                    <th>Korisnik</th>
                                    <th>Valuta</th>
                                    <th>Stanje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {podaciORacunima}
                            </tbody>

                        </Table>);
        const prikaziTabelu = isLoading ? <Spinner></Spinner> : tabela;
        return (
            <React.Fragment>
                <Row className="no-gutters pt-2">
                    <h1 className="form-header ml-2">Devizni Racuni</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {prikaziTabelu}
                </Row>
            </React.Fragment>
        )
    }


}

export default PrikaziSveDevizneRacune