import React from 'react';
import { withRouter } from 'react-router-dom';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { serviceConfig } from '../../../appSettings';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText } from 'react-bootstrap';

class IzmenaValute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idValute: '',
            nazivValute: '',
            odnosPremaDinaru: '',
            odnosPremaDinaruError: '',
            uneto: false,
            spremnoZaUnos: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.setState({idValute: this.props.location.state.valuta.idValute,
                        nazivValute: this.props.location.state.valuta.nazivValute,
                        odnosPremaDinaru: this.props.location.state.valuta.odnosPremaDinaru
                        })
    }

    handleChange(e) {
        const {id,value} = e.target;
        this.setState({[id]: value});
        this.validate(id, value);
    }



    validate(id, value) {
        if(id === 'odnosPremaDinaru') {
            if (value <= 0) {
                this.setState({odnosPremaDinaruError: 'Neophodno je uneti odnos prema dinaru',
                                spremnoZaUnos: false});
            } else {
                this.setState({odnosPremaDinaruError: '',
                                spremnoZaUnos: true});
            }
        }
    }


    handleSubmit(e) {
        e.preventDefault();

        this.setState({ uneto: true });
        const { odnosPremaDinaru } = this.state;
        if (odnosPremaDinaru) {
            this.izmeniValutu();
        } else {
            NotificationManager.error('Neophodno je uneti sve podatke');
            this.setState({uneto: false});
        }
    }

    izmeniValutu() {
        const { idValute, odnosPremaDinaru } = this.state;
        const podaciIzmenjeneValute = {
            odnosPremaDinaru: +odnosPremaDinaru
        };
        const parametriZahteva = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            body: JSON.stringify(podaciIzmenjeneValute)
        };
        fetch(`${serviceConfig.baseURL}/api/KontrolerValuta/IzmeniValutu?id=${idValute}`, parametriZahteva)
        .then(odgovor => {
            if(!odgovor.ok) {
                return Promise.reject(odgovor);
            }
            return odgovor.statusText;
        })
        .then(odgovor => {
            this.props.history.goBack();
            NotificationManager.success('Uspesno Azurirana Valuta');
        })
        .catch(odgovor => {
            NotificationManager.error(odgovor.statusText);
            this.setState({ uneto: false});
        });
    }

    render() {
        const { nazivValute ,odnosPremaDinaru,odnosPremaDinaruError, uneto, spremnoZaUnos} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Izmena valute</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    id="nazivValute"
                                    type="text"
                                    placeholder={nazivValute}
                                    readOnly
                                    />
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    id="odnosPremaDinaru"
                                    type="text"
                                    placeholder="Adresa"
                                    value={odnosPremaDinaru}
                                    onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{odnosPremaDinaruError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={uneto || !spremnoZaUnos} block>Izmena Valute</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }


}

export default withRouter(IzmenaValute)