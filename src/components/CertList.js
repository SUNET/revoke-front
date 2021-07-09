import React from "react";
import PropTypes from "prop-types";
import { Button, Pagination } from "semantic-ui-react";

import Cert from "./Cert";
import CertSearchForm from "./CertSearchForm";

class CertList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            certs: [],
            checked: new Set(),
            filter: {
                field: null,
                value: null
            },
            page: 1,
            totalPages: 1
        };

        this.checkedAll = this.checkedAll.bind(this);
        this.filter = this.filter.bind(this);
        this.getCertsData = this.getCertsData.bind(this);
        this.modify = this.modify.bind(this);
        this.setPage = this.setPage.bind(this);
        this.toggleChecked = this.toggleChecked.bind(this);
        this.toggleCheckedAll = this.toggleCheckedAll.bind(this);
    }

    static propTypes = {
        token: PropTypes.string.isRequired,
        clearToken: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.getCertsData();
    }

    //
    // Helpers
    //

    checkedAll() {
        return this.state.checked.size === this.state.certs.length;
    }

    totalPages() {
        return Math.ceil(this.state.totalPages / process.env.PER_PAGE);
    }

    //
    // Event handlers
    //

    getCertsData() {
        let filterString = () => {
            if (
                this.state.filter.field === null ||
                this.state.filter.value === null
            ) {
                return null;
            }
            return `filter[${this.state.filter.field}]=${this.state.filter.value}`;
        };

        let qs = () => {
            return (
                "?" +
                [
                    `per_page=${process.env.PER_PAGE}`,
                    `page=${this.state.page}`,
                    filterString()
                ]
                    .filter(x => x !== null)
                    .join("&")
            );
        };

        fetch(`${process.env.BACK_URL}/api/v0/auth${qs()}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.props.token}`
            }
        })
            .then(resp => {
                if (resp.status !== 200)
                    throw `Unexpected response status: ${resp.status} ${resp.statusText}`;
                return resp;
            })
            .then(resp => {
                this.setState({
                    totalPages: resp.headers.get("X-Total-Count")
                });
                return resp.json();
            })
            .then(data => this.setState({ certs: data }))
            .catch(e => this.props.setError(e));
    }

    modify(revoke) {
        this.state.checked.forEach(serial => {
            fetch(`${process.env.BACK_URL}/api/v0/auth/${serial}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${this.props.token}`
                },
                body: JSON.stringify({
                    revoke: revoke
                })
            })
                .then(resp => {
                    if (resp.status !== 200)
                        throw `Unexpected response status: ${resp.status} ${resp.statusText}`;
                    return resp;
                })
                .then(resp => resp.json())
                .then(data => console.log(data))
                .then(this.getCertsData)
                .catch(e => this.props.setError(e));
        });
        this.setState({ checked: new Set() });
    }

    toggleChecked(e) {
        let serial = parseInt(e.target.name);
        this.setState(state => {
            let checked = new Set(state.checked);
            if (checked.has(serial)) {
                checked.delete(serial);
            } else {
                checked.add(serial);
            }
            return {
                checked: checked
            };
        });
    }

    toggleCheckedAll() {
        this.setState(state => {
            if (this.checkedAll()) {
                return {
                    checked: new Set()
                };
            }
            return {
                checked: new Set(state.certs.map(c => c.serial))
            };
        });
    }

    filter(field, value) {
        this.setState(
            {
                filter: {
                    field: field,
                    value: value
                }
            },
            this.getCertsData
        );
    }

    setPage(e, { activePage: n }) {
        this.setState({ page: n }, this.getCertsData);
    }

    render() {
        return (
            <div id="cert-list">
                <div id="controls">
                    <div id="action">
                        <Button.Group>
                            <Button onClick={() => this.modify(true)}>
                                Revoke
                            </Button>
                            <Button onClick={() => this.modify(false)}>
                                Unrevoke
                            </Button>
                        </Button.Group>
                    </div>
                    <div id="search">
                        <CertSearchForm filter={this.filter} />
                    </div>
                    <div id="logout">
                        <Button color="red" onClick={this.props.clearToken}>
                            Sign out
                        </Button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={this.toggleCheckedAll}
                                    checked={this.checkedAll()}
                                />
                            </th>
                            <th>Serial</th>
                            <th>Requester</th>
                            <th>Subject</th>
                            <th>Issued</th>
                            <th>Expires</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.certs.map(cert => {
                            return (
                                <Cert
                                    {...cert}
                                    key={cert.serial}
                                    checked={this.state.checked.has(
                                        cert.serial
                                    )}
                                    toggleChecked={this.toggleChecked}
                                />
                            );
                        })}
                    </tbody>
                </table>
                <div id="pagination">
                    <Pagination
                        activePage={this.state.page}
                        totalPages={this.totalPages()}
                        onPageChange={this.setPage}
                    />
                </div>
            </div>
        );
    }
}

export default CertList;
