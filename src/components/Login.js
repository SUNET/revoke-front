import React from "react";
import PropTypes from "prop-types";
import { Button, Input } from "semantic-ui-react";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: false
        };

        this.handleInput = this.handleInput.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    static propTypes = {
        setToken: PropTypes.func.isRequired,
        setError: PropTypes.func.isRequired
    };

    // NOTE: btoa() limits email, password to ASCII
    login(email, password) {
        const url = process.env.JWT_URL + "/api/v1.0/auth";
        fetch(url, {
            method: "POST",
            headers: { Authorization: "Basic " + btoa(email + ":" + password) }
        })
            .then(resp => {
                if (resp.status !== 200) throw resp;
                return resp;
            })
            .then(resp => resp.json())
            .then(data => {
                this.props.setToken(data.access_token);
            })
            .catch(resp => {
                if (resp.status === 401) this.setState({ error: true });
                else
                    this.props.setError(
                        `Unexpected response status: ${resp.status} ${resp.statusText}`
                    );
            });
    }

    logout() {
        localStorage.removeItem("token");
    }

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div id="login-container">
                <form
                    id="login"
                    onSubmit={e => {
                        e.preventDefault();
                        this.login(this.state.email, this.state.password);
                    }}
                >
                    <h1>Let&apos;s Revoke</h1>
                    <Input
                        type="text"
                        name="email"
                        placeholder="Username..."
                        onChange={this.handleInput}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password..."
                        name="password"
                        onChange={this.handleInput}
                        required
                    />
                    <Button color="green" className="submit" type="submit">
                        Sign in
                    </Button>
                    {this.state.error && (
                        <p className="error">Wrong username or password</p>
                    )}
                </form>
            </div>
        );
    }
}

export default Login;
