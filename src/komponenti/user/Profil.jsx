import React from 'react';
import {getUserName} from '../pomocni fajlovi/Autentikacija'
import {serviceConfig} from '../../appSettings'
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

class Profil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnik: [],
            racuni: []
        };
    }

    componentDidMount() {
        this.getUserByUsername();
    }

    getUserByUsername() {
        let ime = getUserName();

        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerKorisnika/DajPoKorisnickomImenu` + ime, parametriZahteva)
            .then(odgovor => {
                if(!odgovor.ok) {
                    return;
                }
                return odgovor.json();
            })
            .then(data => {
                if (data) {
                    this.setState({korisnik: data});

                    this.dajRacunePoKorisnikId(this.state.korisnik.id);
                }
            })
            .catch(odgovor => {
                NotificationManager.error(odgovor.message || odgovor.statusText);
            });
    }

    dajRacunePoKorisnikId(korisnikId) {
        const parametriZahteva = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/KontrolerRacuna/DajSveRacunePoKorisnikId` + korisnikId, parametriZahteva)
            .then(odgovor => {
                if (!odgovor.ok) {
                    return;
                }
                return odgovor.json();
            })
            .then(odgovor => {
                if(odgovor) {
                    this.setState({racuni: odgovor});
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

        render() {
            return (
                <h1>TEST TEST TEST</h1>

            )
        }
}

export default withRouter(Profil);