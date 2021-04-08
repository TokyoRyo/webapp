import React from 'react';
import AppInfo from './AppInfo';
import NavigationStranger from './NavigationStranger';

class Info extends React.Component {
    componentDidMount() {
        document.title = '情報 | 東京寮ウェブアプリ';
    }
    render() {
        return(
            <div className="app_frame">
                <div className="app_frame__content">
                    <div className="app_frame__contentBox">
                        <h1>情報</h1>
                        <hr />
                        <AppInfo />
                    </div>
                </div>
                <NavigationStranger />
            </div>
        );
    };
};

export default Info;
