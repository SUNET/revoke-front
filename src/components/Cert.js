import React from "react";
import PropTypes from "prop-types";
import { Icon } from "semantic-ui-react";

import dateFormat from "dateformat";

class Cert extends React.Component {
    static propTypes = {
        toggleChecked: PropTypes.func.isRequired,
        serial: PropTypes.number.isRequired,
        checked: PropTypes.bool.isRequired,
        requester: PropTypes.string.isRequired,
        subject: PropTypes.string.isRequired,
        issued: PropTypes.string.isRequired,
        expires: PropTypes.string.isRequired,
        revoked: PropTypes.string
    };

    render() {
        return (
            <tr>
                <td>
                    <input
                        type="checkbox"
                        onChange={this.props.toggleChecked}
                        name={this.props.serial}
                        checked={this.props.checked}
                    />
                </td>
                <td>{this.props.serial}</td>
                <td>{this.props.requester}</td>
                <td>{this.props.subject}</td>
                <td>{dateFormat(this.props.issued, "yyyy-mm-dd")}</td>
                <td>{dateFormat(this.props.expires, "yyyy-mm-dd")}</td>
                <td>
                    {this.props.revoked === null ? (
                        <Icon name="check" color="green" />
                    ) : (
                        <div>
                            <Icon name="delete" color="red" />
                            <span>{this.props.revoked}</span>
                        </div>
                    )}
                </td>
            </tr>
        );
    }
}

export default Cert;
