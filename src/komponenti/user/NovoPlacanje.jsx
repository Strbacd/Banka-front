import React from "react"
import {withRouter} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { serviceConfig } from "../../appSettings";
import { FormGroup, FormControl, Button, Container, Row, Col, FormText } from 'react-bootstrap';

class NovoPlacanje extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nazivPrimaoca: '',
            brojRacunaPrimaoca: 0,
            modelPlacanja: 0,
            pozivNaBroj: 0,
            iznos: 0,
            nazivPrimaocaError: '',
            brojRacunaPrimaocaError: '',
            iznosError: '',
            uneto: false,
            spremnoZaUnos: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({[id] : value});
        this.validate(id,value);
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({uneto: true});
        const {nazivPrimaoca, brojRacunaPrimaoca, modelPlacanja, pozivNaBroj, iznos} = this.state;
        if(nazivPrimaoca && brojRacunaPrimaoca && modelPlacanja && pozivNaBroj && iznos) {
            this.dodajPlacanje();
        }
        else
        {
            NotificationManager.error("Unesite sve neophodne parametre. ");
            this.setState({uneto: false})
        }
    }

    validate(id, value) {

        if(id === "nazivPrimaoca") {
            if (value === '') {
                this.setState({
                    nazivPrimaocaError: "Neophodno je uneti naziv primaoca.",
                    spremnoZaUnos: false
                });
            } else {
                this.setState({
                    nazivPrimaocaError: '',
                    spremnoZaUnos: true
                })
            }
            }

            else if (id === "brojRacunaPrimaoca") {
                if (value === 0) {
                    this.setState({
                        brojRacunaPrimaocaError: "Neophodno je uneti naziv primaoca.",
                        spremnoZaUnos: false
                    });
                } else {
                    this.setState({
                        brojRacunaPrimaocaError: '',
                        spremnoZaUnos: true
                    })
            }
            }

            else if (id === "iznost") {
                if (value === 0) {
                    this.setState({
                        iznosError: "Neophodno je uneti iznos.",
                        spremnoZaUnos: false
                    });
                } else {
                    this.setState({
                        iznosError: '',
                        spremnoZaUnos: true
                    })
                }
            }
        }


        dodajPlacanje() {
            const {nazivPrimaoca, brojRacunaPrimaoca, modelPlacanja, pozivNaBroj, iznos} = this.state;

            const data = {
                nazivPrimaoca: nazivPrimaoca,
                brojRacunaPrimaoca: brojRacunaPrimaoca,
                modelPlacanja: modelPlacanja,
                pozivNaBroj: pozivNaBroj,
                iznos: iznos
            };

            const parametriZahteva = {
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
                        body: JSON.stringify(data)
            };

            fetch(`${serviceConfig.baseURL}/api/KontrolerPlacanja/NovoPlacanje`, parametriZahteva)
                .then(odgovor => {
                    if(!odgovor.ok) {
                        return Promise.reject(odgovor);
                    }
                    return odgovor.statusText;
                })
                .then(odgovor => {
                    NotificationManager.success('Placanje izvrseno uspesno');
                    this.props.history.push(/*nazad na placanja*/);
                })
                .catch(odgovor => {
                    NotificationManager.error(odgovor.message);
                    this.setState({uneto: false})
                })
        }


    render() {
        const {nazivPrimaoca, brojRacunaPrimaoca, modelPlacanja, pozivNaBroj, iznos, nazivPrimaocaError, brojRacunaPrimaocaError, iznosError, uneto, spremnoZaUnos} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Placanje</h1>
                            <form onSubmit={this.handleSubmit}>

                                <FormGroup>
                                    <FormControl
                                        id="nazivPrimaoca"
                                        type="text"
                                        placeholder="Naziv Primaoca"
                                        value={nazivPrimaoca}
                                        className="add-new-form"
                                        />
                                    <FormText className="text-danger">{nazivPrimaocaError}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <FormControl
                                        id="brojRacunaPrimaoca"
                                        type="long"
                                        placeholder="Broj Racuna Primaoca"
                                        value={brojRacunaPrimaoca}
                                        className="add-new-form"
                                        />
                                    <FormText className="text-danger">{brojRacunaPrimaocaError}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <FormControl
                                        id="modelPlacanja"
                                        type="int"
                                        placeholder="Model"
                                        value={modelPlacanja}
                                        className="add-new-form"
                                        />
                                </FormGroup>

                                <FormGroup>
                                    <FormControl
                                        id="pozivNaBroj"
                                        type="long"
                                        placeholder="Poziv na broj"
                                        value={pozivNaBroj}
                                        className="add-new-form"
                                        />
                                </FormGroup>

                                <FormGroup>
                                    <FormControl
                                        id="iznos"
                                        type="decimal"
                                        placeholder="Iznos"
                                        value={iznos}
                                        className="add-new-form"
                                        />
                                    <FormText className="text-danger">{iznosError}</FormText>
                                </FormGroup>
                                <Button type="submit" disabled={uneto || !spremnoZaUnos} block>Dodaj</Button>

                            </form>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default withRouter(NovoPlacanje);