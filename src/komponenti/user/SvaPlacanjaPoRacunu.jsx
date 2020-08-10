import React from "react";
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../Spinner';
import { Row, Table } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

class SvaPlacanjaPoRacunu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placanja: [],
            isLoading: true,
            idPlacanja: ''
        };
        this.popuniTabelu = this.popuniTabelu.bind(this);
        this.obrisiPlacanje = this.obrisiPlacanje.bind(this);
    }

    componentDidMount() {
        this.dajPlacanja();
    }

    dajPlacanja() {

        let urlElements = window.location.href.split('/');

        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/KontrolerPlacanja/DajPoRacunu?racunId=${urlElements[5]}`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then(data => {
            if(data) {
                this.setState({placanja: data, isLoading: false});
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

    obrisiPlacanje(idPlacanja) {
        
        const parametriZahteva = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/KontrolerPlacanja/IzbrisiPlacanje?idPlacanja=${idPlacanja}`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then(data => {
            if(data) {
                window.location.reload(false);
                NotificationManager.success("Uspesno ste obrisali placanje");
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
        return this.state.placanja.map(placanje => {
            return <tr key = {placanje.idPlacanja}>
                <td>{placanje.nazivPrimaoca}</td>
                <td>{placanje.modelPlacanja}</td>
                <td>{placanje.pozivNaBroj}</td>
                <td style={{color: 'red'}}>{placanje.iznos}</td>
                <td width="5%" className="text-center cursor-pointer" onClick={() => this.obrisiPlacanje(placanje.idPlacanja)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faTrash}/></td>
            </tr>
        })
    }


    render() {
        const {isLoading} = this.state;
        const podaciOPlacanjima = this.popuniTabelu();
        var tabela = (
            <Table striped bordered hover size="sm" variant="dark">
                <thead>
                    <tr>
                        <th>Primaoc</th>
                        <th>Model</th>
                        <th>Poziv na broj</th>
                        <th>Iznos</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {podaciOPlacanjima}
                </tbody>
            </Table>
        )
        const prikaziTabelu = isLoading ? <Spinner></Spinner> : tabela;
        return (
            <React.Fragment>
                <Row className="no-gutters pt-2">
                    <h1 className="form-header form-heading">Sva placanja za izabrani racun</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {prikaziTabelu}
                </Row>
            </React.Fragment>
        )
    }
}

export default withRouter(SvaPlacanjaPoRacunu)