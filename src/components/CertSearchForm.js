import React from "react";
import PropTypes from "prop-types";
import { Button, Select, Input, Icon } from "semantic-ui-react";

class CertSearchForm extends React.Component {
    static propTypes = {
        filter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            field: "subject",
            value: ""
        };

        this.clearSearch = this.clearSearch.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
    }

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    clearSearch(_) {
        this.setState({ value: "" });
        this.props.filter(null, null);
    }

    submitSearch(e) {
        e.preventDefault();
        this.props.filter(this.state.field, this.state.value);
    }

    render() {
        const searchOptions = [
            { key: "subject", value: "subject", text: "Subject" }
        ];
        return (
            <form onSubmit={this.submitSearch}>
                <Input
                    action
                    type="text"
                    name="value"
                    placeholder="Search..."
                    iconPosition="left"
                    onChange={this.handleInput}
                    value={this.state.value}
                >
                    <input />
                    <Icon name="delete" link onClick={this.clearSearch} />
                    <Select
                        name="field"
                        options={searchOptions}
                        defaultValue="subject"
                        onChange={this.handleInput}
                    />
                    <Button type="submit">Search</Button>
                </Input>
            </form>
        );
    }
}

export default CertSearchForm;
