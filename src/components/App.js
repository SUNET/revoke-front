import React from "react";

import CertList from "./CertList";
import Login from "./Login";

import "../styles/reset.css";
import "../styles/main.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token")
        };

        this.setToken = this.setToken.bind(this);
        this.clearToken = this.clearToken.bind(this);
    }

    setToken(token) {
        this.setState({ token: token });
        localStorage.setItem("token", token);
    }

    clearToken() {
        this.setState({ token: null });
        localStorage.removeItem("token");
    }

    render() {
        if (this.state.token === null)
            return <Login setToken={this.setToken} />;
        return (
            <CertList token={this.state.token} clearToken={this.clearToken} />
        );
    }
}

export default App;
