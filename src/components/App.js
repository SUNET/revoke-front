import React from "react";

import CertList from "./CertList";
import Login from "./Login";
import Error from "./Error";

import "../styles/reset.css";
import "../styles/main.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            error: null
        };

        this.clearError = this.clearError.bind(this);
        this.clearToken = this.clearToken.bind(this);
        this.setError = this.setError.bind(this);
        this.setToken = this.setToken.bind(this);
    }

    setToken(token) {
        this.setState({ token: token });
        localStorage.setItem("token", token);
    }

    clearToken() {
        this.setState({ token: null });
        localStorage.removeItem("token");
    }

    setError(msg) {
        this.setState({ error: msg });
    }

    clearError() {
        this.setState({ error: null });
    }

    render() {
        if (this.state.error !== null)
            return (
                <Error
                    error={this.state.error}
                    clearError={this.clearError}
                    clearToken={this.clearToken}
                />
            );
        if (this.state.token === null)
            return <Login setToken={this.setToken} setError={this.setError} />;
        return (
            <CertList
                token={this.state.token}
                clearToken={this.clearToken}
                setError={this.setError}
            />
        );
    }
}

export default App;
