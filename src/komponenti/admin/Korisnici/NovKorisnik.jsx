import React from "react"
import {withRouter} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { serviceConfig } from "../../../appSettings";
import { Typeahead } from "react-bootstrap-typeahead";
import { FormGroup, FormControl, Button, Container, Row, Col, FormText } from 'react-bootstrap';

class NovKorisnik extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnickoIme: '',
            ime: '',
            prezime: '',
            adresa: '',
            korisnickoImeError: '',
            imeError: '',
            prezimeError: '',
            adresaError: '',
            uneto: false,
            spremnoZaUnos: true
        };
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

        const {korisnickoIme, ime, prezime, adresa} = this.state;
        if (korisnickoIme && ime && prezime && adresa) {
            this.dodajKorisnika();
            this.setState({uneto: true});
        }
        else
        {
            NotificationManager.error('Unesite sve parametre. ');
            this.setState({uneto: false})
        }
    }



    validate(id, value) {


        if(id === "korisnickoIme") {
            if(value === '') {
                this.setState({
                    korisnickoImeError: 'Neophodno je uneti korisnicko ime',
                    spremnoZaUnos: false
                });
            } else {
                this.setState({
                    korisnickoImeError: '',
                    spremnoZaUnos: true
                })
            }
        } 
        
        else if(id === "ime") {
            if(value === '') {
                this.setState({
                    ImeError: 'Neophodno je uneti ime',
                    spremnoZaUnos: false
                });
            } else {
                this.setState({
                    ImeError: '',
                    spremnoZaUnos: true
                })
            }
        }
        
        
        else if(id === "prezime") {
            if(value === '') {
                this.setState({
                    prezimeError: 'Neophodno je uneti prezime',
                    spremnoZaUnos: false
                });
            } else {
                this.setState({
                    prezimeError: '',
                    spremnoZaUnos: true
                })
            }
        } else if(id === "adresa") {
            if(value === '') {
                this.setState({
                    adresaError: 'Neophodno je uneti adresu',
                    spremnoZaUnos: false
                });
            } else {
                this.setState({
                    adresaError: '',
                    spremnoZaUnos: true
                })
            }
        }
    }

    dodajKorisnika() {
        const {korisnickoIme, ime, prezime, adresa} = this.state;

        const data = {
            korisnickoIme: korisnickoIme,
            ime: ime,
            prezime: prezime,
            adresa: adresa
        };

        const parametriZahteva = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
                    body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/dodajKorisnika`, parametriZahteva)
            .then(odgovor => {
                if(!odgovor.ok) {
                    return Promise.reject(odgovor);
                }
                return odgovor.statusText.length;
            })
            .then(odgovor => {
                NotificationManager.success('Korisnik je uspesno registrovan');
                this.props.history.push('SviKorisnici');
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
        const {korisnickoIme, ime, prezime, adresa, korisnickoImeError, imeError, prezimeError, adresaError, spremnoZaUnos, uneto} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Dodavanje korisnika</h1>
                        <form onSubmit={this.handleSubmit}>

                            <FormGroup>
                                <FormControl
                                    id="korisnickoIme"
                                    type="text"
                                    placeholder="Korisnicko Ime"
                                    value={korisnickoIme}
                                    onChange={this.handleChange}
                                    className="add-new-form"
                                />
                                <FormText className="text-danger">{korisnickoImeError}</FormText>
                            </FormGroup>


                            <FormGroup>
                                <FormControl
                                    id="ime"
                                    type="text"
                                    placeholder="Ime"
                                    value={ime}
                                    onChange={this.handleChange}
                                    className="add-new-form"
                                />
                                <FormText className="text-danger">{imeError}</FormText>
                            </FormGroup>


                            <FormGroup>
                                <FormControl
                                    id="prezime"
                                    type="text"
                                    placeholder="Prezime"
                                    value={prezime}
                                    onChange={this.handleChange}
                                    className="add-new-form"
                                />
                                <FormText className="text-danger">{prezimeError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    id="adresa"
                                    type="text"
                                    placeholder="Adresa"
                                    value={adresa}
                                    onChange={this.handleChange}
                                    className="add-new-form"
                                />
                                <FormText className="text-danger">{adresaError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={uneto || !spremnoZaUnos} block>Dodaj</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        )
    }




}

export default withRouter(NovKorisnik);