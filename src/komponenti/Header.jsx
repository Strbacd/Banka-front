import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import { serviceConfig } from '../appSettings';
import { NotificationManager } from 'react-notifications';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            korisnickoIme: '',
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
    }
    
    handleSubmit(e) {
        e.preventDefault();
    
        this.setState({ submitted: true });
        const { korisnickoIme: korisnickoIme } = this.state;
        if (korisnickoIme) {
            this.login();
        } else {
            this.setState({ submitted: false });
        }
    }
    
    login() {
        const { korisnickoIme: korisnickoIme } = this.state;
    
        const requestOptions = {
            method: 'GET'
        };
    
        fetch(`${serviceConfig.baseURL}/daj-token?korisnickoIme=${korisnickoIme}`, requestOptions)
            .then(response => {
              if (!response.ok) {
                return Promise.reject(response);
            }
            return response.json();
            })
            .then(data => {
              NotificationManager.success('Successfully signed in!');
              if (data.token) {
                localStorage.setItem("jwt", data.token);
                }
            })
            .catch(response => {
                response.text()
                    .then(text => {
                        let error = JSON.parse(text);
                        console.log(error.porukaGreske);
                        NotificationManager.error(error.porukaGreske);
                    })
                this.setState({ submitted: false });
            });
        }
    

    render() {
        const {korisnickoIme: korisnickoIme} = this.state;
        return (
            <div>
            <Navbar bg="dark" expand="lg">
                <Navbar.Brand className="text-info font-weight-bold text-capitalize">
                    <Link className="text-decoration-none" to='/dashboard'>Pupin Banka</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-white" />
                <Navbar.Collapse id="basic-navbar-nav" className="text-white">
                <Nav className="mr-auto text-white" >
              </Nav>
              <Form inline onSubmit={this.handleSubmit}>
                <FormControl type="text" placeholder="Korisnicko Ime"
                  id="korisnickoIme"
                  value={korisnickoIme}
                  onChange={this.handleChange}
                  className="mr-sm-2" />
                <Button type="submit" variant="outline-success">Log In</Button>
              </Form>
            </Navbar.Collapse>

            </Navbar>
            </div>
        )
    }
}

export default Header;