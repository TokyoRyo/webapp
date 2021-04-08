import React from 'react';
import firebase from '../firebase-setup';
import Auth from './Auth';
import Loading from "./Loading";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { faShareAltSquare } from '@fortawesome/free-solid-svg-icons';

const DriveLink = (props) => {
    return (
        <div><a href={props.link} target="blank"><button type="button" className="btn btn-primary"><FontAwesomeIcon icon={faGoogleDrive} />　{props.roomName}を開く</button></a></div>
    );
};

class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drive: <Loading />,
        }
        this.database = firebase.database().ref('share');
    };
    render() {
        return(
            <div className="app_frame__contentBox">
                <h1><FontAwesomeIcon icon={faShareAltSquare} /> 共有</h1>
                <hr />
                <h2>東京寮共有Googleドライブ</h2>
                <section className="app_section">
                    <p className="app_section_subscript">
                        ファイルを保存・共有・共同編集できます。
                    </p>
                    {this.state.drive}
                </section>
            </div>
        );
    };
    componentDidMount() {
        document.title = '共有 | 東京寮ウェブアプリ';
        this.database.once('value', (snapshot) => {
            this.setState({
                drive: <DriveLink link={snapshot.val().drive} roomName="共有Googleドライブ" />,
            });
        });
    };
};

export default Share;


