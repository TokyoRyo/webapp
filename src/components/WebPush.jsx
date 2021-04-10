import React from 'react';
import Auth from './Auth';
import firebase from '../firebase-setup';
import { Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash, faTimesCircle, faExclamationTriangle, faBell } from '@fortawesome/free-solid-svg-icons';

const PermissionRequest = (props) => {
    return(
        <Button variant="success" onClick={props.requestPermission}>通知をリクエスト</Button>
    );
};

class WebPush extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationPermission: 'checking'
        };
        this.database = firebase.database().ref('profile/' + Auth.myUid);
        this.initMessaging = this.initMessaging.bind(this);
        this.requestPermission = this.requestPermission.bind(this);
    }
    componentDidMount() {
        try {
            this.initMessaging();
        }
        catch {
            this.setState({notificationPermission: 'unavail'});
        }
    }
    initMessaging() {
        if (!firebase.messaging.isSupported){
            this.setState({notificationPermission: 'unavail'})
            return true;
        }
        const permission = Notification.permission;
        if (permission !== 'granted'){
            this.setState({notificationPermission: permission});
            return true;
        }
        firebase.messaging().getToken()
        .then((token) => {
            this.setState({notificationPermission: 'granted'});
            if (!this.props.token) {
                this.database.update({webpush: {[token]: true}});
            }
            else if(Object.keys(this.props.webpush).indexOf(token) === -1){
                this.database.child('webpush').update({[token]: true});
            }
        }).catch(() => {
            this.setState({notificationPermission: 'unavail'});
        })
    }
    requestPermission() {
        this.setState({notificationPermission: 'checking'});
        Notification.requestPermission()
            .then(() => {
                try {
                    this.initMessaging();
                }
                catch {
                    this.setState({notificationPermission: 'unavail'});
                }
            });
    }
    render() {
        if (this.state.notificationPermission === 'denied') {
            return (
            <section className="app_section">
                <h3>WebPush通知</h3>
                <Alert variant="danger">
                    <p>
                    <FontAwesomeIcon icon={faBellSlash} />
                    通知がブロックされています。<br />
                    プラウザの設定で通知を許可してリロードするか、LINEでの通知の設定を行なってください。
                    </p>
                </Alert>
            </section>
            );
        };
        if (this.state.notificationPermission === 'unavail') {
            return (
            <section className="app_section">
                <h3>WebPush通知</h3>
                <Alert variant="danger">
                    <p>
                    <FontAwesomeIcon icon={faTimesCircle} />
                    お使いの環境ではWebPush通知が利用できません。<br />
                    LINEでの通知を利用してください。
                    </p>
                </Alert>
                <p className="app_section_subscript">
                    WebPush通知に対応しているのは最新のChrome, Edge, FireFox(iOSを除く)です。
                </p>
            </section>
            );
        };
        if (this.state.notificationPermission === 'default') {
            return (
            <section className="app_section">
                <h3>WebPush通知</h3>
                <Alert variant="warning">
                    <p>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    通知の許可が必要です。<br />
                    下のボタンを押したあと、通知を許可してください。
                    </p>
                </Alert>
                <PermissionRequest requestPermission={this.requestPermission} />
            </section>
            );
        };
        if (this.state.notificationPermission === 'granted') {
            return (
                <section className="app_section">
                    <h3>WebPush通知</h3>
                    <Alert variant="success">
                        <p>
                        <FontAwesomeIcon icon={faBell} />
                        通知は正常に動作しています。
                        </p>
                    </Alert>
                </section>
            );
        };
        return (
            <section className="app_section">
                <h3>WebPush通知</h3>
                <Alert variant="primary">
                    <p>
                    <FontAwesomeIcon icon={faBell} />
                    通知の設定を読み込んでいます...
                    </p>
                </Alert>
            </section>
        );
    }
}

export default WebPush;
