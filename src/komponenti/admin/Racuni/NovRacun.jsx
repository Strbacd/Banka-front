import React from "react"
import { withRouter } from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { serviceConfig } from "../../../appSettings";
import { Typeahead } from "react-bootstrap-typeahead";
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';

class NovRacun extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnikId: '',
            valutaId: 0,
            korisnici: [],
            valute: [],
            korisnikError:'',
            valutaError:'',
            uneto: false,
            spremnoZaUnos: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.dajValute();
        this.dajKorisnike();
    }

    handleChange(e) {
        const { id,value } = e.target;
        this.setState({[id]: value});
        this.validate(id,value);
    }


    handleSubmit(e) {
        e.preventDefault();

        const {korisnikId, valutaId} = this.state;
        if (korisnikId && valutaId) {
            this.dodajRacun();
            this.setState({uneto: true});
        }
        else
        {
            NotificationManager.error('Unesite oba parametra. ');
            this.setState({uneto: false})
        }
    }

    validate(id, value) {
        if(id === 'korisnikId') {
            if(value === ''){
                this.setState({korisnikError: 'Neophodno je izabrati korisnika.',
                                spremnoZaUnos: false})
            } else {
                this.setState({korisnikError: '',
                                spremnoZaUnos: true})
            }
        } else if (id === 'valutaId') {
            if(value === '') {
                this.setState({korisnikError: 'Neophodno je izabrati Valutu.',
                spremnoZaUnos: false})
            } else {
                this.setState({korisnikError: '',
                                spremnoZaUnos: true})
            }
        }
    }

    dodajRacun() {
        const { korisnikId, valutaId } = this.state;

        const data = {
            idValute: valutaId,
            idKorisnika: korisnikId
        };

        const parametriZahteva = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
                    body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerRacuna`, parametriZahteva)
            .then(odgovor => {
                if (!odgovor.ok) {
                    return Promise.reject(odgovor);
                }
                return odgovor.statusText;
            })
            .then(odgovor => {
                NotificationManager.success('Racun je uspesno napravljen!');
                this.props.history.push('SviRacuni');
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

    dajKorisnike() {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/DajSveKorisnike`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then(data => {
            if (data) {
                this.setState({korisnici: data });
            }
        })
        .catch(odgovor => {
            odgovor.text()
            .then(text => {
                let error = JSON.parse(text);
                console.log(error.porukaGreske);
                NotificationManager.error(error.porukaGreske);
            })
        });
    }

    onKorisnikPromena(korisnik) {
        if(korisnik[0]){
            this.setState({korisnikId: korisnik[0].idKorisnika});
            this.validate('korisnikId', korisnik[0]);
        } else {
            this.validate('korisnikId', null);
        }
    }

    dajValute() {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerValuta/DajSveValute`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.json();
        })
        .then(data => {
            if (data) {
                this.setState({valute: data });
            }
        })
        .catch(odgovor => {
            NotificationManager.error(odgovor.porukaGreske || odgovor.statusKod);
            this.setState({uneto: false});
        });
    }

    onValutaPromena(valuta) {
        if(valuta[0]){
            this.setState({valutaId: valuta[0].idValute});
            this.validate('valutaId', valuta[0]);
        } else {
            this.validate('valutaId', null);
        }
    }

    render() {
        const { korisnici, valute, korisnikError, valutaError, uneto, spremnoZaUnos } = this.state;


        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Dodavanje racuna</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Typeahead 
                                    labelKey="ime"
                                    options={korisnici}
                                    placeholder="korisnik..."
                                    id="browser1"
                                    onChange={e => {this.onKorisnikPromena(e)}}
                                    />
                                    <FormText className="text-danger">{korisnikError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Typeahead 
                                    labelKey="nazivValute"
                                    options={valute}
                                    placeholder="valuta..."
                                    id="browser2"
                                    onChange={e => {this.onValutaPromena(e)}}
                                    />
                                    <FormText className="text-danger">{valutaError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={uneto || !spremnoZaUnos} block>Dodaj</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        )
    }




    }

export default withRouter(NovRacun);