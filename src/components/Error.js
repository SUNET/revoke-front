import React from "react";
import { Button, Message } from "semantic-ui-react";

class Error extends React.Component {
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
