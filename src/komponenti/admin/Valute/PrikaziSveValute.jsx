import React from "react";
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import {withRouter} from 'react-router-dom';
import PrikaziSveKorisnike from "../Korisnici/PrikaziSveKorisnike";

class PrikaziSveValute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valute: [],
            isLoading: true,
            idValute: ''
        };
        this.popuniTabelu = this.popuniTabelu.bind(this);
    }

    componentDidMount() {
        this.dajValute();
    }

    dajValute() {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/KontrolerValuta/DajSveValute`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then (data => {
            if(data) {
                this.setState({valute: data, isLoading: false});
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
        return this.state.valute.map(valuta => {
            return <tr key = {valuta.idValute}>
                <td>{valuta.nazivValute}</td>
                <td>{valuta.odnosPremaDinaru}</td>
                <td width="5%" className="text-center cursor-pointer" onClick={() => this.izmenaValute(valuta.idValute)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
            </tr>
        })
    }


    render() {
        const {isLoading} = this.state;
        const podaciOValutama = this.popuniTabelu();
        var tabela = (
            <Table striped bordered hover size="sm" variant="dark">
                <thead>
                    <tr>
                        <th>Naziv Valute</th>
                        <th>Odnos prema dinaru</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {podaciOValutama}
                </tbody>
            </Table>
        )
        const prikaziTabelu = isLoading ? <Spinner></Spinner> : tabela;
        return (
            <React.Fragment>
                <Row className="no-gutters pt-2">
                    <h1 className="form-header form-heading">Sve Valute</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {prikaziTabelu}
                </Row>
            </React.Fragment>
        )
    }

}

export default withRouter(PrikaziSveValute)