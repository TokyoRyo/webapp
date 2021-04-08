import React from 'react';
import { NavLink } from 'react-router-dom';
import './navigation.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserCog, faShareAltSquare } from '@fortawesome/free-solid-svg-icons';
import { faSkype } from '@fortawesome/free-brands-svg-icons';
import firebase from '../firebase-setup';
import Auth from './Auth'

const NavButton = (props) => {
    return (
        <NavLink exact to={props.to} className="app_navigation__wrapper" activeClassName="app_navigation__wrapper-active">
            <div className="app_navigation__button">
                <FontAwesomeIcon className="app_navigation__icon" icon={props.icon} />
                <span className="app_navigation__text">{props.text}</span>
                <NotifyBadge show={props.show} />
            </div>
        </NavLink>
    );
};

const NotifyBadge = (props) => {
    if (props.show) {
        return(
            <div className="app_navigation__badge">{props.show}</div>
        )
    }
    return (<div></div>)
};

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.database = firebase.database().ref('rootInfo');
        this.state = {unread: 0}
    };
    componentDidMount() {
        this.database.on('value', (snapshot) => {
            if (snapshot.val().unread){
                if (snapshot.val().unread[Auth.myUid]){
                    this.setState({unread: Object.keys(snapshot.val()['unread'][Auth.myUid]).length})
                }
                else{
                    this.setState({unread: false})
                }
            }else{
                this.setState({unread: false})
            }
        });
    };
    render() {
        return(
        <nav className="app_frame__navigation">
            <NavButton to="/" icon={faHome} show={this.state.unread} text="ホーム" />
            <NavButton to="/share" icon={faShareAltSquare} text="共有" />
            <NavButton to="/meetings" icon={faSkype} text="会議" />
            <NavButton to="/settings" icon={faUserCog} text="設定" />
        </nav>
        );
    };
};

export default Navigation;
