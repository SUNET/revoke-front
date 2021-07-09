import React from "react";
import PropTypes from "prop-types";
import { Button, Message } from "semantic-ui-react";

class Error extends React.Component {
    static propTypes = {
        clearError: PropTypes.func.isRequired,
        clearToken: PropTypes.func.isRequired,
        error: PropTypes.string.isRequired
    };

    render() {
        return (
            <div id="error-container">
                <Message negative>
                    <Message.Header>Internal server error</Message.Header>
                    <p>{this.props.error}</p>
                    <Button
                        color="red"
                        onClick={() => {
                            this.props.clearToken();
                            this.props.clearError();
                        }}
                    >
                        Sign out
                    </Button>
                </Message>
            </div>
        );
    }
}

export default Error;
