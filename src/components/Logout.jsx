import React from 'react';
import { Redirect } from 'react-router-dom';
import firebase from '../firebase-setup';

class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proceeding: false,
        };
        this.handleClick = this.handleClick.bind(this);
    };
    handleClick() {
        this.setState({
            proceeding: true,
        });
        firebase.auth().signOut();
    };
    render() {
        if (this.state.proceeding) {
            return (<button type="button" className="btn btn-light" disabled>ログアウト中...</button>);
        };
        return (<button type="submit" className="btn btn-outline-danger" onClick={this.handleClick}>ログアウトする</button>);
    };
};

export default Logout;
