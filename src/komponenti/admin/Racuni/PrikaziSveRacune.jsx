import React from "react";
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table } from 'react-bootstrap';
import Spinner from '../../Spinner';

class PrikaziSveRacune extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Racuni: [],
            isLoading: true
        };

    }


    componentDidMount() {
        this.dajRacune();
    }
    
    dajRacune() {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/KontrolerRacuna/DajSveRacunePoKorisnikId`,parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then(data => {
            if(data) {
                this.setState({Racuni: data, isLoading: false});
            }
        })
        .catch(odgovor => {
            odgovor.text()
            .then(text => {
                let error = JSON.parse(text);
                console.log(error.porukaGreske);
                NotificationManager.error(error.porukaGreske);
            })
        })
    }

    popuniTabelu() {
        return this.state.Racuni.map(Racun => {
            return <tr key={Racun.idRacuna}>
                <td width="34%">{Racun.korisnik.korisnickoIme}</td>
                <td width="33%">{Racun.valuta.nazivValute}</td>
                <td width="33%">{Racun.stanje}</td>
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
                    <h1 className="form-header ml-2">Racuni</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {prikaziTabelu}
                </Row>
            </React.Fragment>
        )
    }


}

export default PrikaziSveRacune