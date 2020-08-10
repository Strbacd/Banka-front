import React from 'react';
import { withRouter } from 'react-router-dom';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { serviceConfig } from '../../../appSettings';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText } from 'react-bootstrap';

class IzmenaKorisnika extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnickoIme: '',
            adresa: '',
            idKorisnika: '',
            korisnickoImeError: '',
            adresaError: '',
            uneto: false,
            spremnoZaUnos: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const id = this.props.location.state.idKorisnika;
        this.dajKorisnika(this.props.location.state.idKorisnika);
    }


    handleChange(e) {
        const {id,value} = e.target;
        this.setState({[id]: value});
        this.validate(id, value);
    }

    validate(id, value) {
        if(id === 'korisnickoIme') {
            if (value === '') {
                this.setState({korisnickoImeError: 'Neophodno je uneti zeljeno korisnicko Ime',
                                spremnoZaUnos: false});
            } else {
                this.setState({korisnickoImeError: '',
                                spremnoZaUnos: true});
            }
        } else if (id === 'adresa') {
            if (value ==='') {
                this.setState({adresaError: 'neophodno je uneti adresu',
                                spremnoZaUnos: false});
            } else {
                this.setState({adresaError: '',
                                spremnoZaUnos: true});
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ uneto: true });
        const { korisnickoIme, adresa } = this.state;
        if (korisnickoIme && adresa) {
            this.izmeniKorisnika();
        } else {
            NotificationManager.error('Neophodno je uneti sve podatke');
            this.setState({uneto: false});
        }
    }


    dajKorisnika(idKorisnika) {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/DajPoId?id=${idKorisnika}`, parametriZahteva)
            .then(odgovor => {
                if (!odgovor.ok) {
                    return Promise.reject(odgovor);
                }
                return odgovor.json();
            })
            .then(data => {
                if (data) {
                    this.setState({
                        korisnickoIme: data.korisnickoIme,
                        adresa: data.adresa,
                        idKorisnika: data.idKorisnika
                    });
                }
            })
            .catch(odgovor => {
                odgovor.text()
                    .then(text => {
                        let error = JSON.parse(text);
                        NotificationManager.error(error.porukaGreske);
                    })
                    this.setState({uneto: false});
            });
    }

    izmeniKorisnika() {
        const { idKorisnika, korisnickoIme, adresa } = this.state;

        const podaciAzuriranogKorisnika = {
            korisnickoIme: korisnickoIme,
            adresa: adresa
        };

        const parametriZahteva = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            body: JSON.stringify(podaciAzuriranogKorisnika)
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/IzmeniKorisnika?id=${idKorisnika}`, parametriZahteva)
            .then(odgovor => {
                if(!odgovor.ok) {
                    return Promise.reject(odgovor);
                }
                return odgovor.statusText;
            })
            .then(odgovor => {
                this.props.history.goBack();
                NotificationManager.success('Uspesno Azuriran korisnik');
            })
            .catch(odgovor => {
                NotificationManager.error(odgovor.statusText);
                this.setState({ uneto: false});
            });
    }


    render() {
        const { korisnickoIme, korisnickoImeError, adresa, adresaError, uneto, spremnoZaUnos} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Izmena korisnika</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    id="korisnickoIme"
                                    type="text"
                                    placeholder="Korisnicko ime"
                                    value={korisnickoIme}
                                    onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{korisnickoImeError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    id="adresa"
                                    type="text"
                                    placeholder="Adresa"
                                    value={adresa}
                                    onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{adresaError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={uneto || !spremnoZaUnos} block>Izmena korisnika</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(IzmenaKorisnika)