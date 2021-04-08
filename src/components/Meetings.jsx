import React from 'react';
import firebase from '../firebase-setup';
import Auth from './Auth';
import Loading from "./Loading";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkype } from '@fortawesome/free-brands-svg-icons';

const SkypeLink = (props) => {
    return (
        <div><a href={props.link} target="blank"><button type="button" className="btn btn-primary"><FontAwesomeIcon icon={faSkype} />　{props.roomName}を開く</button></a></div>
    );
};

class Meetings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sokai: <Loading />,
            inkai: <Loading />,
            room1: <Loading />,
            room2: <Loading />,
        }
        this.database = firebase.database().ref('meetings');
    };
    render() {
        return(
            <div className="app_frame__contentBox">
                <h1><FontAwesomeIcon icon={faSkype} /> 会議</h1>
                <hr />
                <h2>Skype会議室へのリンク</h2>
                <section className="app_section">
                    <h3>寮生総会</h3>
                    <p className="app_section_subscript">
                        毎月第一水曜日の次の土曜日の20時から寮生全員が参加する会議です。<br />
                        オンラインで行うかどうかについては寮の方針に従ってください。<br />
                        一部開催されない月、通常と異なる日時に開催される月等あるので詳細は寮の予定に従ってください。
                    </p>
                    {this.state.sokai}
                </section>
                <section className="app_section">
                    <h3>寮生委員会</h3>
                    <p className="app_section_subscript">
                        毎月第一水曜日の22時30分から自治会メンバーと希望者が参加する会議です。<br />
                        オンラインで行うかどうかについては寮の方針に従ってください。<br />
                        一部開催されない月、通常と異なる日時に開催される月等あるので詳細は寮の予定に従ってください。
                    </p>
                    {this.state.inkai}
                </section>
                <section className="app_section">
                    <h3>会議室1</h3>
                    <p className="app_section_subscript">
                        寮生同士で自由に利用してください。<br />
                        東京寮ウェブアプリにアクセスできない人は招待しないでください。
                    </p>
                    {this.state.room1}
                </section>
                <section className="app_section">
                    <h3>会議室2</h3>
                    <p className="app_section_subscript">
                        寮生同士で自由に利用してください。<br />
                        東京寮ウェブアプリにアクセスできない人は招待しないでください。
                    </p>
                    {this.state.room2}
                </section>
            </div>
        );
    };
    componentDidMount() {
        document.title = 'オンライン会議のリンク | 東京寮ウェブアプリ';
        this.database.once('value', (snapshot) => {
            this.setState({
                sokai: <SkypeLink link={snapshot.val().sokai} roomName="寮生総会" />,
                inkai: <SkypeLink link={snapshot.val().inkai} roomName="寮生委員会" />,
                room1: <SkypeLink link={snapshot.val().room1} roomName="会議室1" />,
                room2: <SkypeLink link={snapshot.val().room2} roomName="会議室2" />,
            });
        });
    };
};

export default Meetings;
