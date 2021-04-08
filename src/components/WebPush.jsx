import React from 'react';
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
    }
    componentDidMount() {
    }
    render() {
        if (this.props.notificationPermission === 'denied') {
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
        if (this.props.webpushAvail === 'unavail') {
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
        if (this.props.notificationPermission === 'default') {
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
                <PermissionRequest requestPermission={this.props.requestPermission} />
            </section>
            );
        };
        if (this.props.notificationPermission === 'granted') {
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
