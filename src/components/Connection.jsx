import React from 'react';
import firebase from '../firebase-setup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

class Connection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {disConnected: false};
        this.database = firebase.database().ref('.info/connected');
    };
    componentDidMount() {
        this.database.on('value', (snapshot) => {
            this.setState({disConnected: (!snapshot.val())});
        });
    };
    componentWillUnmount() {
        this.database.off();
    };
    render() {
        if (this.state.disConnected){
            return (
                <div className="alert alert-warning app_disconnected" role="alert">
                    <FontAwesomeIcon icon={faLink} /> データベースに接続中...
                </div>
            );
        }else{
            return (<div></div>);
        };
        
    };
};

export default Connection;
