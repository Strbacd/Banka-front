import React from "react";
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import {withRouter} from 'react-router-dom';

class NovaValuta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nazivValute: '',
            odnosPremaDinaru: 0,
            nazivValuteError: '',
            odnosPremaDinaruError: '',
            uneto: false,
            spremnoZaUnos: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { id,value } = e.target;
        this.setState({[id]: value});
        this.validate(id,value);
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({uneto: true});
        const {nazivValute, odnosPremaDinaru} = this.state;
        if (nazivValute && odnosPremaDinaru) {
            this.dodajValutu();
        }
        else
        {
            NotificationManager.error('Unesite sve parametre. ');
            this.setState({uneto: false})
        }
    }

    validate(id, value) {
        if(id === "nazivValute") {
            if(value === "") {
                this.setState({
                    nazivValuteError: "Neophodno je uneti Naziv Valute",
                    spremnoZaUnos: false
                });
            } else {
                this.setState({
                    nazivValuteError: '',
                    spremnoZaUnos: true
                })
            }
        }

        else if (id === "odnosPremaDinaru" ) {
            if(value <= 0) {
                this.setState({
                    odnosPremaDinaruError: "Neophodno je uneti korektne vrednosti za odnos prema dinaru",
                    spremnoZaUnos: false 
                });
            } else {
                this.setState({
                    odnosPremaDinaruError: '',
                    spremnoZaUnos: true
                })
            }
        }
    }

    dodajValutu() {
        const {nazivValute, odnosPremaDinaru } = this.state;

        const data = {
            nazivValute: nazivValute,
            odnosPremaDinaru: +odnosPremaDinaru
        };

        const parametriZahteva = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
                    body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerValuta/NovaValuta`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor;
        })
        .then(odgovor => {
            NotificationManager.success('Valuta je uspesno dodata');
            this.props.history.push('SveValute');
        })
        .catch(odgovor => {
            odgovor.text()
            .then(text => {
                let error = JSON.parse(text);
                console.log(error.porukaGreske);
                NotificationManager.error(error.porukaGreske);
            })
            this.setState({uneto: false});
        });
    }

    render() {
        const {nazivValute, odnosPremaDinaru, nazivValuteError, odnosPremaDinaruError, uneto, spremnoZaUnos} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                    <h1 className="form-header">Dodavanje Valute</h1>
                    <form onSubmit={this.handleSubmit}>


                        <FormGroup>
                            <FormControl
                                id="nazivValute"
                                type="text"
                                placeholder="3-slovni naziv valute"
                                value={nazivValute}
                                onChange={this.handleChange}
                                className="add-new-form"
                            />
                            <FormText className="text-danger">{nazivValuteError}</FormText>
                        </FormGroup>


                        <FormGroup>
                            <FormControl
                                id="odnosPremaDinaru"
                                type="decimal"
                                placeholder="Koliko dinara vredi jedna jedinica ove valute?"
                                value={odnosPremaDinaru}
                                onChange={this.handleChange}
                                className="add-new-form"
                            />
                            <FormText className="text-danger">{odnosPremaDinaruError}</FormText>
                        </FormGroup>
                        <Button type="submit" disabled={uneto || !spremnoZaUnos} block>Dodaj</Button>
                    </form>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default withRouter(NovaValuta)