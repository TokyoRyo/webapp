import React from 'react';
import { NavLink } from 'react-router-dom';
import './navigation.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const NavButton = (props) => {
    return (
        <NavLink exact to={props.to} className="app_navigation__wrapper" activeClassName="app_navigation__wrapper-active">
            <div className="app_navigation__button">
                <FontAwesomeIcon className="app_navigation__icon" icon={props.icon} />
                <span className="app_navigation__text">{props.text}</span>
            </div>
        </NavLink>
    );
};

class NavigationStranger extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return(
        <nav className="app_frame__navigation-stranger">
            <NavButton to="/login" icon={faSignInAlt} text="ログイン" />
            <NavButton to="/signup" icon={faUserPlus} text="新規作成" />
            <NavButton to="/info" icon={faInfoCircle} text="情報" />
        </nav>
        );
    };
};

export default NavigationStranger;
