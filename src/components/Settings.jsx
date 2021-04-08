import React from 'react';
import Profile from './Profile';
import AppInfo from './AppInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';

class Settings extends React.Component {
    componentDidMount() {
        document.title = '設定 | 東京寮ウェブアプリ';
    };
    render() {
        return (<div className="app_frame__contentBox"><h1><FontAwesomeIcon icon={faUserCog} /> 設定</h1><Profile /><hr /><AppInfo /></div>);
    };
};

export default Settings;
