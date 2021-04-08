import React from 'react';
import { Button, Alert, InputGroup, FormControl, } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash, faBell } from '@fortawesome/free-solid-svg-icons';
import Auth from './Auth';

const CopyButton = (props) => {
    if (props.copy) {
        return(
            <Button variant="success" onClick={props.copyUid}>コピーしました</Button>
        )
    };
    return(
        <Button variant="outline-secondary" onClick={props.copyUid}>コピー</Button>
    )
};

const LineStatus = (props) => {
    if (props.lineToken) {
        return(
            <Alert variant="success">
                <p>
                <FontAwesomeIcon icon={faBell} />
                通知は正常に動作しています。<br />
                新しいLINEアカウントに変更する場合は再度上記のUIDから始まるコードをメッセージしてください。
                </p>
            </Alert>
        );
    };
    return(
        <Alert variant="warning">
            <p>
            <FontAwesomeIcon icon={faBellSlash} />
            通知は未登録です。<br />
            下のボタンから東京寮公式LINEを友だちに登録し、次に上記のUIDから始まるコードをメッセージしてください。
            </p>
        </Alert>
    )
};

class LineNotify extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            copy: false,
        }
        this.copyUid = this.copyUid.bind(this);
        this.resetCopyButton = this.resetCopyButton.bind(this);
    }
    render() {
        return(
            <section className="app_section">
                <h3>LINE通知</h3>
                <div>
                    <InputGroup className="mb-3">
                        <FormControl
                        defaultValue={'UID:' + Auth.myUid}
                        readOnly
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        id="LineUidInput"
                        />
                        <InputGroup.Append>
                            <CopyButton copy={this.state.copy} copyUid={this.copyUid} />
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <LineStatus lineToken={this.props.lineToken} />
                <div>
                    <a href="https://lin.ee/Yjgxywy" target="blank"><img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加" height="36" border="0" /></a>
                </div>
            </section>
        );
    };
    copyUid() {
        clearInterval(this.copyTimer);
        document.getElementById("LineUidInput").select();
        document.execCommand("Copy");
        this.setState({copy: true})
        this.copyTimer = setInterval(
            () => this.resetCopyButton(),
            3000
        );
    };
    resetCopyButton() {
        this.setState({copy: false})
    }
    componentWillUnmount() {
        clearInterval(this.copyTimer);
    };
};

export default LineNotify;
